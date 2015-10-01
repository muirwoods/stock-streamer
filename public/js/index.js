// Node-style (commonjs) require in the browser!


let $ = require('jquery')
let io = require('socket.io-client')
let $template = $('#template')
let socket = io('http://127.0.0.1:8000')

socket.on('connect', ()=>console.log('connected', socket.id))

socket.on('stock-updates', ({watchlist})=> {
    // update the last updated span object to current datetime
    $('#lastupdated').text(new Date())
    
    console.log('client received', watchlist)
    // iterate throught the watchlist and populate table dynamically
})


window.socketio = socket
