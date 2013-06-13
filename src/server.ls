require! express

app = express!

app
  .use express.bodyParser!
  .use express.methodOverride!
  .use express.static __dirname + \/public
  .listen 8080

console.log \ready
