// Node-style (commonjs) require in the browser!


let $ = require('jquery')
let io = require('socket.io-client')
let socket = io('http://127.0.0.1:8000')
let $template = $('table#stocktable')
socket.on('connect', ()=>console.log('connected', socket.id))

// Enable the form now that our code has loaded
$('#send').removeAttr('disabled')


socket.on('stock-updates', ({watchlist})=> {
    // update the last updated span object to current datetime
    $('#lastupdated').text(new Date())

    console.log('client receivvvveeeeeeed', watchlist)
    let $table = $template.clone().show()
    for( let i = 0; i < watchlist.length; i++) { 
    	let stock = watchlist[i]; 
    	console.log("i ", i ," stock.price: ", watchlist[i].lastTradePriceOnly)
    	// console.log("debug.... ", $table.find('lastTradePrice' + i))
    	// $table.find('#symbol' + i).html(stock.symbol);
    	// $table.find('#name' + i).html(stock.name);
    	// $table.find('lastTradePrice' + i).text(watchlist[i].lastTradePriceOnly);
    	let value = stock.lastTradePriceOnly + ' (' + stock.changeInPercent.toFixed(4) + ')'
    	console.log("Value ", value)
    	document.getElementById('lastTradePrice' + i) .innerHTML = stock.lastTradePriceOnly + 
    							' (' + stock.changeInPercent.toFixed(4) + ')';
    }
})


window.socketio = socket
