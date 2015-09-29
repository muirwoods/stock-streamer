let Stock = require('../models/stock');
let User = require('../models/user');
let yahooFinance = require('yahoo-finance');
let HashMap = require('hashmap')
require('songbird');

async function fetchStockQuotes(req, res) {
  let users = await User.promise.find({});
  let quotes = []
  let map = new HashMap()

  if (users && users.length > 0){
    let emailList = users.map( user =>{
      return user.email
    })

    for (let i = 0; i < emailList.length; i++) {
      console.log("Email ", emailList[i])
      let stocks = await Stock.promise.find({ email : emailList[i]});
      if (stocks && stocks.length > 0){
        let stocklist = stocks.map( stock =>{
          return stock.symbol
        })
        quotes = await lookupTicker(stocklist);
        map.set(emailList[i],quotes)
      }
    }
  }
  return map
}

async function lookupTicker(symbols){
    return await yahooFinance.promise.snapshot({
      symbols: symbols,
      fields: ['s', 'n', 'd1', 'l1', 'y', 'r','c1', 'p2'],
    })
}

module.exports = {fetchStockQuotes,lookupTicker}