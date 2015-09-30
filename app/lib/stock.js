let Stock = require('../models/stock');
let User = require('../models/user');
let yahooFinance = require('yahoo-finance');
let HashMap = require('hashmap')
require('songbird');

async function fetchStockQuotes(email) {
  let quotes = []
  let stocks = await Stock.promise.find({ email : email});
  if (stocks && stocks.length > 0){
    let stocklist = stocks.map( stock =>{
      return stock.symbol
    })
    quotes = await lookupTicker(stocklist)
  }

  return quotes
}

async function lookupTicker(symbols){
    return await yahooFinance.promise.snapshot({
      symbols: symbols,
      fields: ['s', 'n', 'd1', 'l1', 'y', 'r','c1', 'p2'],
    })
}

module.exports = {fetchStockQuotes,lookupTicker}