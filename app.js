const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);

const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
    console.log("New user connected:", socket.id);
    
    socket.on("send-location", function(data){
        console.log("Location received from:", socket.id, data);
        io.emit("receive-location", {id: socket.id, ...data});
    });
    
    socket.on("disconnect", function(){
        console.log("User disconnected:", socket.id);
        io.emit("user-disconnected", socket.id);
    });
})

app.get('/',(req,res)=>{
    res.render("index");
})

server.listen(port,()=>{
console.log(`server running at ${port}`)
})