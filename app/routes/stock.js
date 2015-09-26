let isLoggedIn = require('../middlewares/isLoggedIn')
let Stock = require('../models/stock');
require('songbird');

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

function add (req, res) {
  let {symbol} = req.body;
  let d = new Date();
  let stock = new Stock();
  stock.symbol = symbol.toUpperCase();
  stock.created = d;
  stock.updated = d;
  stock.email = req.user.email;
  stock.save();
  res.redirect('/edit')
}

async function remove (req, res) {
    console.log('ffffffffffffound')
  let id = req.params.id
  console.log('ffffffffffffound id', id)
  let stock = await Stock.promise.findById(id)
  console.log('founddddddd sotckkkk', stock)
  if (!stock){
      res.send(404, 'Not found');
      return;
  }

  await stock.remove();
  res.redirect('/edit')
}

module.exports = (app) => {
  app.get('/edit', isLoggedIn, getEdit)
  app.get('/add', isLoggedIn, getAdd)
  app.post('/add', isLoggedIn, add)
  app.get('/delete/:id', isLoggedIn, remove)
}
