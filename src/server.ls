require! request
require! express
require! cheerio

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
    if $ \.post-title .length and $ \.post-body .length
      return \blogspot
    if $ \.textpostbody .length
      return \tumblr
    \moretext
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
      $contents.each (index, element) ->
        p = $ element .text()
        p = p.replace /\n\s*\n+\s*/g \\u2029
        p = p.replace /\n\s*/g \\n
        p = p.split \\u2029
        Array.prototype.push.apply result, p
        if index is $contents.length - 1
          cb do
            title: $title.text().trim()
            contents: result
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

app = express!
app
  .use express.bodyParser!
  .use express.methodOverride!
  .use express.static __dirname + \/public
  .post \/story, (req, res) ->
    body <- Story.getArticle req.body.url
    $ = cheerio.load body
    story <- Story.source[Story.checkSource $] $
    res.json story
  .listen(process.env.PORT or 8080)

console.log \ready
