// Node-style (commonjs) require in the browser!


let $ = require('jquery')
let io = require('socket.io-client')
let socket = io('http://127.0.0.1:8000')
let $template = $('#template')
socket.on('connect', ()=>console.log('connected', socket.id))

// Enable the form now that our code has loaded
$('#send').removeAttr('disabled')


socket.on('stock-updates', ({watchlist})=> {
  console.log('client receivvvveeeeeeed', watchlist)
})
