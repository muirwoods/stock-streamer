let isLoggedIn = require('../middlewares/isLoggedIn')
let Stock = require('../models/stock');
require('songbird');

async function getWatchlist(req, res) {
  let stocks = await Stock.promise.find({ email: req.user.email });
  let watchlist = []
  stocks.forEach(stock =>{
    watchlist.push({
      symbol: stock.symbol,
      price: (Math.random() * 100).toFixed(2),
      change: Math.random().toFixed(2)
    })
  })
  res.render('watchlist.ejs', {
    watchlist: watchlist,
    message: req.flash('error')
  })
}

async function getEdit(req, res) {
  let stocks = await Stock.promise.find({ email: req.user.email });
  res.render('edit.ejs', {
    user: req.user,
    stocks: stocks,
    message: req.flash('error')
  })
}

function getAdd(req, res) {
  res.render('add.ejs', {
    user: req.user,
    message: req.flash('error')
  })
}

async function add (req, res) {
  let {symbol} = req.body
  if (!symbol || symbol.length === 0){
    req.flash('error', 'Invalid ticker symbol')
    res.redirect('/add')
    return
  }
  let exist = await Stock.promise.findOne({
    symbol: symbol.toUpperCase(),
    email: req.user.email
  });
  if (exist){
    req.flash('error', `Ticker symbol: ${symbol} has already been added to watchlist`)
    res.redirect('/add')
    return
  }
  let stock = new Stock()
  stock.symbol = symbol.toUpperCase()
  stock.created = new Date()
  stock.email = req.user.email
  stock.save()
  res.redirect('/edit')
}

async function remove (req, res) {
  let id = req.params.id
  let stock = await Stock.promise.findById(id)
  if (!stock){
      res.send(404, 'Not found');
      return;
  }

  await stock.remove();
  res.redirect('/edit')
}

module.exports = (app) => {
  app.get('/watchlist', isLoggedIn, getWatchlist)
  app.get('/edit', isLoggedIn, getEdit)
  app.get('/add', isLoggedIn, getAdd)
  app.post('/add', isLoggedIn, add)
  app.get('/delete/:id', isLoggedIn, remove)
}
