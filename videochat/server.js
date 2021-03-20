const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server) //creates server and passes it into socket.io
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId,userId)
        //tell other users we have a new user joined
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId) //tells everyone we connected but ourselves
        
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})
server.listen(3000)