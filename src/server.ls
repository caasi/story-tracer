require! request
require! express
require! entities
require! cheerio

html2json = (node) ->
  if node.type is \tag
    children = node.children?
                .map html2json
                .filter (child) ->
                  child.type is \text or child.children.length
    return do
      type: node.type
      name: node.name
      children: children
  else
    return do
      type: node.type
      # FB55's node-entities, 0 = XML, 1 = HTML4, 2 = HTML5
      data: entities.decode node.data, 2

Story =
  getArticle: (url, cb) ->
    if not url
      do cb
    else
      request.get(
        do
          url: url
          timeout: 2000
        (err, res, body) ->
          if err
            console.log err
            do cb
          else if res.statusCode is 200
            cb body
      )
  checkSource: ($) ->
    | $ \.post-title .length and $ \.post-body .length  => \blogspot
    | $ \.textpostbody .length                          => \tumblr
    | otherwise                                         => \moretext
  source:
    moretext: ($, cb) ->
      title <- Story.util.moretext do
        n: 1
        limit: 10
      contents <- Story.util.moretext do
        n: 3
        limit: 150
      cb do
        title: title.sentences[0]
        contents: contents.sentences
    blogspot: ($, cb) ->
      result = []
      $title = $ \.post-title
      $contents = $ ".post-body p"
      #console.log JSON.stringify Story.util.html2json $(\.post-body)[0]
      next = ->
        cb do
          title: $title.text().trim()
          contents: result
      $contents.each (index, element) ->
        p = $ element .text()
        p = p.replace /\n\s*\n+\s*/g \\u2029
        p = p.replace /\n\s*/g \\n
        p = p.split \\u2029
        Array.prototype.push.apply result, p
        if index is $contents.length - 1
          do next
      do next if not $contents.length
    tumblr: ($, cb) ->
      result = []
      $contents = $ \.textpostbody .children()
      result = [$contents.text()]
      $title = $contents.prev \h2
      $contents.each (index, element) ->
        p = $ element .text()
        console.log element.nodeName
        result.push p
        if index is $contents.length - 1
          cb do
            title: $title.text().trim()
            contents: result
  util:
    moretext: (options, cb) ->
      request.get(
        \http://more.handlino.com/sentences.json?n= + options.n + \&limit= + options.limit
        (err, res, body) ->
          if not err and res.statusCode is 200
            cb JSON.parse body
      )
    html2json: html2json

app = express!
app
  .use express.bodyParser!
  .use express.methodOverride!
  .use express.static __dirname + \/public
  .post \/story, (req, res) ->
    body <- Story.getArticle req.body.url
    $ = cheerio.load body, ignoreWhitespace: true
    story <- Story.source[Story.checkSource $] $
    res.json story
  .listen(process.env.PORT or 8080)

console.log \ready
