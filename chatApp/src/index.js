const path = require("path")
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { generateMessage } = require("./utils/message");
const {
    addUsers,
    removeUser,
    getUser,
    getUsersInRoom
} = require("./utils/users")

const app = express();
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDir = path.join(__dirname, "../public")
app.use(express.static(publicDir))

io.on("connection", (socket) => {


    socket.on("join", ({username, room}, callback) => {

        const {error, user} = addUsers({id: socket.id, username, room})

        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit("welcomeMessage",  generateMessage("Welcome to socket.io chat"))
        socket.broadcast.to(user.room).emit("userJoinMessage", generateMessage(`${user.username} has joined the room`))
        io.to(user.room).emit("roomData", {
            room: user.room,
            usersInRoom: getUsersInRoom(user.room)
        })

        callback()
    })
    

    socket.on("inputMessage", (inputMessage) => {
        const getUserInfo = getUser(socket.id)
        io.to(getUserInfo.room).emit("chat-message", generateMessage(getUserInfo.username , getUserInfo.id, inputMessage))
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        
        if(user) {
            io.to(user.room).emit("leftUserMessage", generateMessage(`${user.username} has left`))
            io.to(user.room).emit("roomData", {
                room: user.room,
                usersInRoom: getUsersInRoom(user.room)
            })

        }

    })
})



server.listen(port, () => {
    console.log(`server is up on to ${port}`)
})