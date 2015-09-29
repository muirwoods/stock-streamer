// Node-style (commonjs) require in the browser!


let $ = require('jquery')
let io = require('socket.io-client')
let socket = io('http://127.0.0.1:8000')
let $template = $('#template')
socket.on('connect', ()=>console.log('connected'))

// Enable the form now that our code has loaded
$('#send').removeAttr('disabled')


socket.on('stock-updates', watchlist => {
    // let $li = $template.clone().show()
    // $li.children('span').text(msg)
    // $li.children('i').text(username+': ')
    // $('#messages').append($li)
})

// $('form').submit(() => {
//     socket.emit('im', $('#m').val())
//     $('#m').val('')
//     return false
// })