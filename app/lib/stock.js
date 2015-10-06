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

      // to make it random, just uncomment the 3 lines of code below
      //
      // let change = Math.random() * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
      // quote.changeInPercent = quote.changeInPercent + (change / quote.lastTradePriceOnly * 100)
      // quote.lastTradePriceOnly = quote.lastTradePriceOnly + change


      let gain = (quote.lastTradePriceOnly - s.purchasePrice) / s.purchasePrice * 100
      let value = quote.lastTradePriceOnly * s.qty
      let cost = s.purchasePrice * s.qty
      let value_gains = value - cost
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
        gainPct: gain,
        value: value,
        cost: cost,
        valueGain: value_gains
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