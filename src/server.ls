require! request
require! express
require! jquery

$ = do jquery.create

Story =
  demoURL: \http://blogger.godfat.org/2013/06/blog-post.html
  getArticle: (url, cb) ->
    request.get(
      url
      (err, res, body) ->
        if not err and res.statusCode is 200
          cb body
    )
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
        paragraphs = $(element).html()
        paragraphs = paragraphs.replace /(<br \/>)\s*(<br \/>)+\s*/g \\u2029
        paragraphs = paragraphs.replace /(<br \/>)\s*/g \\n
        paragraphs = paragraphs.split \\u2029
        Array.prototype.push.apply result, paragraphs
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
    if req.body.url is void
      story <- Story.source.moretext
      res.json story
    else
      body <- Story.getArticle req.body.url
      story <- Story.source.blogspot body
      res.json story
  .listen 8080

console.log \ready
