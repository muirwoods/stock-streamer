let isLoggedIn = require('../middlewares/isLoggedIn')
let Stock = require('../models/stock');
let yahooFinance = require('yahoo-finance');
let stocklib = require('../lib/stock');
let _ = require('lodash')

require('songbird');

async function getWatchlist(req, res) {
  let watchlist = await stocklib.fetchStockQuotes(req.user.email);
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
  let {symbol,purchasePrice,qty} = req.body
  if (!symbol || symbol.length === 0){
    req.flash('error', 'Invalid ticker symbol')
    res.redirect('/add')
    return
  }
  let pp
  let q
  try{
    pp = parseFloat(purchasePrice);
  }catch(e){}

  try{
    q = parseInt(qty);
  }catch(e){}

  if (isNaN(pp)){
    req.flash('error', 'Invalid Price')
    res.redirect('/add')
    return
  }
  if (isNaN(q)){
    req.flash('error', 'Invalid Quantity')
    res.redirect('/add')
    return
  }
  symbol = symbol.toUpperCase()

  let exist = await Stock.promise.findOne({
    symbol: symbol,
    email: req.user.email
  });

  if (exist){
    req.flash('error', `Ticker symbol: ${symbol} has already been added to watchlist`)
    res.redirect('/add')
    return
  }
  // make sure it is a valid stock
  let valid = await stocklib.isValidTicker(symbol);
  if (!valid){
    req.flash('error', `Ticker symbol: ${symbol} is not a valid`)
    res.redirect('/add')
    return  
  }

  let stock = new Stock()
  stock.symbol = symbol
  stock.created = new Date()
  stock.email = req.user.email
  stock.purchasePrice = pp
  stock.qty = q
  stock.save()
  res.redirect('/edit')
}


async function edit (req, res) {
  let id = req.params.id
  let stock = await Stock.promise.findById(id)
  console.log('editttt', id, stock)
  if (!stock){
      res.send(404, 'Not found');
      return;
  }
  let {purchasePrice,qty} = req.body
  let pp
  let q
  try{
    pp = parseFloat(purchasePrice);
  }catch(e){}

  try{
    q = parseInt(qty);
  }catch(e){}

  if (isNaN(pp)){
    req.flash('error', 'Invalid Price')
    res.redirect('/edit')
    return
  }
  if (isNaN(q)){
    req.flash('error', 'Invalid Quantity')
    res.redirect('/edit')
    return
  }
  stock.purchasePrice = pp
  stock.qty = q
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
  app.post('/edit/:id', isLoggedIn, edit)
  app.get('/add', isLoggedIn, getAdd)
  app.post('/add', isLoggedIn, add)
  app.get('/delete/:id', isLoggedIn, remove)
}
