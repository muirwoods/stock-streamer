let path = require('path')
let Server = require('http').Server
let requireDir = require('require-dir')
let express = require('express')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let mongoose = require('mongoose')
let flash = require('connect-flash')
let io = require('socket.io')
let passportMiddleware = require('./middlewares/passport')
let browserify = require('browserify-middleware')
let routes = requireDir('./routes', {recurse: true})
let {fetchStockQuotes} = require('./lib/stock')

require('songbird')

class App {
  constructor(config) {
    let app = this.app = express()
    this.config = app.config = config

    passportMiddleware.configure()
    app.passport = passportMiddleware.passport

    // set up our express middleware
    app.use(morgan('dev')) 
    app.use(cookieParser('ilovethenodejs')) // read cookies (needed for auth)
    app.use(bodyParser.json()) // get information from html forms
    app.use(bodyParser.urlencoded({ extended: true }))

    app.set('views', path.join(__dirname, '..', 'views'))
    app.set('view engine', 'ejs')

    browserify.settings({transform: ['babelify']})
    app.use('/js/index.js', browserify('./public/js/index.js'))

    this.sessionMiddleware = session({
      secret: 'ilovethenodejs',
      store: new MongoStore({db: 'stockstream'}),
      resave: true,
      saveUninitialized: true
    })
    let initializedPassport = app.passport.initialize()
    let passportSessions = app.passport.session()

    // required for passport
    app.use(this.sessionMiddleware)
    // Setup passport authentication middleware
    app.use(initializedPassport)
    // persistent login sessions
    app.use(passportSessions)
    // Flash messages stored in session
    app.use(flash())
    // configure routes
    for (let key in routes) {
      routes[key](app)
    }
    this.server = Server(app)

    this.io = io(this.server)

    this.setupIo() 

    this.io.use(
      (socket, next) => {
        this.sessionMiddleware(socket.request, socket.request.res, next)
      })

    this.io.use(
      (socket, next) => {
            initializedPassport(socket.request, socket.request.res, next)
    })
    
    this.io.use(
      (socket, next) => {
            passportSessions(socket.request, socket.request.res, next)
    }) 

  }

  async initialize(port) {
    await Promise.all([
      // start server
      this.server.promise.listen(port),
      // connect to the database
      mongoose.connect(this.config.database.url)
    ])
    
    return this
  }

  setupIo() {

    // And add some connection listeners:
    this.io.on('connection', socket => {
      console.log('a user connected')

      socket.on('disconnect', () => clearInterval(intervalId))
      let email
      if (socket.request.user) {
        email = socket.request.user.email
        if (email) {
          console.log("User Email", email)
        }
      }
     
      let intervalId = setInterval(async ()=> {
        console.log("Invoking fetchStockQuotes for ", email)
        let watchlist = await fetchStockQuotes(email)
        console.log("No of connected clients: ", this.io.sockets.sockets.length)
        console.log('iddddddddd', socket.id)
        console.log('wwwwwwwwwwatttt', watchlist)
        this.io.to(socket.id).emit('stock-updates', {watchlist})
      }, 15000)

    })
    console.log("SetupIO done!")
  }
}

module.exports = App