
function logout(req, res) {
  req.logout()
  res.redirect('/')
}

function home(req, res) {
  res.render('index.ejs')
}

function showLogin(req, res) {
  res.render('login.ejs', {
    message: req.flash('error')
  })
}

function showSignup(req, res) {
  res.render('signup.ejs', {
    message: req.flash('error')
  })
}

module.exports = (app) => {
  app.get('/', home)

  app.get('/logout', logout)

  app.get('/login', showLogin)

  app.get('/signup', showSignup)
}
