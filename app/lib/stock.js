let Stock = require('../models/stock');
let User = require('../models/user');
let yahooFinance = require('yahoo-finance');
let HashMap = require('hashmap')
require('songbird');

async function fetchStockQuotes(email) {
  let quotes = []
  let stocks = await Stock.promise.find({ email : email});
  let stockMap = {}

  if (stocks && stocks.length > 0){
    // create a map to lookup later
    stocks.forEach(stock=>{
      stockMap[stock.symbol] = stock
    })
    quotes = await lookupTicker( Object.keys(stockMap) )
    quotes = quotes.map( quote =>{
      let s = stockMap[quote.symbol]
      let gain = (quote.lastTradePriceOnly - s.purchasePrice) / s.purchasePrice * 100
      return {
        symbol: quote.symbol,
        name: quote.name,
        lastTradeDate: quote.lastTradeDate,
        lastTradePriceOnly: quote.lastTradePriceOnly,
        changeInPercent: quote.changeInPercent,
        dividendYield: quote.dividendYield,
        peRatio: quote.peRatio,
        change: quote.change,
        purchasePrice: s.purchasePrice,
        qty: s.qty,
        gains: gain
      }
    })
  }

  return quotes
}

async function lookupTicker(symbols){
    return await yahooFinance.promise.snapshot({
      symbols: symbols,
      fields: ['s', 'n', 'd1', 'l1', 'y', 'r','c1', 'p2'],
    })
}

async function isValidTicker(symbol){
    let [valid] = await lookupTicker([symbol])
    if (valid.name){
      return true
    }
    return false
}

module.exports = {fetchStockQuotes,isValidTicker}