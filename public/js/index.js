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
        $('#symbol'+i).text(stock.symbol)
        $('#name'+i).text(stock.name)

        let lastTradePrice = stock.lastTradePriceOnly.toFixed(2) + ' (' + stock.changeInPercent.toFixed(4) + ')'
        $('#lastTradePrice'+i).text(lastTradePrice)

        if (stock.changeInPercent < 0){
           $('#lastTradePrice'+i).css('color', 'red') 
        }

        let purchasePrice = stock.purchasePrice.toFixed(2)  + ' (' + stock.gainPct.toFixed(4) + ')'
        $('#purchasePrice'+i).text(purchasePrice)
        if (stock.gainPct < 0){
           $('#purchasePrice'+i).css('color', 'red') 
        }
        $('#qty'+i).text(stock.qty)
        $('#cost'+i).text(stock.cost.toFixed(2))
        
        let marketValue = stock.value.toFixed(2)  + ' (' + stock.valueGain.toFixed(2) + ')'
        console.log(stock.symbol, marketValue)
        $('#marketValue'+i).text(marketValue)
        if (stock.valueGain < 0){
           $('#marketValue'+i).css('color', 'red') 
        }

    }
})



window.socketio = socket
