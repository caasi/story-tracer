require! request
require! express

moretext = (options, cb) ->
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
    ret =
      title: void
      contents: void
    body <- moretext do
      n: 1
      limit: 10
    ret.title = body.sentences[0]
    body <- moretext do
      n: 3
      limit: 150
    ret.contents = body.sentences
    res.json ret
  .listen 8080

console.log \ready
