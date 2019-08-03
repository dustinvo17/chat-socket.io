const express = require('express')
const app = express()
const server = require('http').createServer(app)

const io = require('socket.io').listen(server)
let users = []
let connections = []
app.use(express.static(__dirname+'/public'))
server.listen(process.env.PORT || 3000)
console.log('server is running')
app.get('/',(req,res)=>{
    res.sendFile((__dirname+"/public/index.html"))
})
io.sockets.on('connection',(socket)=>{
    console.log(socket)
    console.log(connections)
    connections.push(socket)
    console.log('Connected: sockets connected ' , connections.length)
    socket.on('disconnect',data => { 
        users.splice(users.indexOf(socket.username),1)
          connections.splice(connections.indexOf(socket),1)
        console.log('Disconnected',connections.length )
     })
     socket.on('send message',data =>{
      
        io.sockets.emit('new message' , {msg:data,name:socket.username})
     })
     socket.on('register user',function(data,callback){
     
        socket.username = data
         callback(true)
         users.push(socket.username)
      
         socket.emit('get user',users)

     })
    

  
})