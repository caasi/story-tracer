require! request
require! express
require! jquery

$ = do jquery.create

Story =
  getArticle: (url, cb) ->
    request.get(
      url
      (err, res, body) ->
        if not err and res.statusCode is 200
          cb body
    )
  checkSource: (body) ->
    $body = $ body
    if $body.find \.post-title .length and $body.find \.post-body .length
      return \blogspot
    if $body.find \.textpostbody .length
      return \tumblr
  source:
    moretext: (cb) ->
      title <- Story.util.moretext do
        n: 1
        limit: 10
      contents <- Story.util.moretext do
        n: 3
        limit: 150
      cb do
        title: title.sentences[0]
        contents: contents.sentences
    blogspot: (body, cb) ->
      result = []
      $body = $ body
      $title = $body.find \.post-title
      $contents = $body.find ".post-body p"
      $contents.each (index, element) ->
        p = $ element .html()
        p = p.replace /(<br \/>)\s*(<br \/>)+\s*/g \\u2029
        p = p.replace /(<br \/>)\s*/g \\n
        p = p.split \\u2029
        Array.prototype.push.apply result, p
        if index is $contents.length - 1
          cb do
            title: $title.text().trim()
            contents: result
    tumblr: (body, cb) ->
      result = []
      $body = $ body
      $contents = $body.find \.textpostbody .children()
      result = [$contents.text()]
      $title = $contents.prev \h2
      $contents.each (index, element) ->
        p = $ element .html()
        result.push p
        if index is $contents.length - 1
          console.log result
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
    if req.body.url is void
      story <- Story.source.moretext
      res.json story
    else
      body <- Story.getArticle req.body.url
      story <- Story.source[Story.checkSource body] body
      res.json story
  .listen 8080

console.log \ready
