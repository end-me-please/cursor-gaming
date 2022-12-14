const express = require('express');
const app = express();
const port = 8080;
const { Server } = require('socket.io'); 
let server = require("http").createServer(app);

//serve static files from the public directory and the dist directory
app.use(express.static('public'));


let io = require('socket.io')(server,{
    cors: {
        origin: "https://end-me-please.github.io",
        methods: ["GET", "POST"]
      }
});


let users = {};
let mice = {};
io.on('connection', function(socket){
    socket.on('join', function(joinData){
    mice[socket.id] = {x: 0, y:0, name:""+joinData.name};

    console.log('a user connected');
    users[socket.id] = socket;
    socket.on('disconnect', function(){
        console.log('user disconnected');
        delete users[socket.id];
        delete mice[socket.id];
    });
    socket.on('mouse', function(data){
        mice[socket.id] = {x: parseInt(data.x), y: parseInt(data.y), name: mice[socket.id].name};
    });
    });
});

function broadcastData(){
    io.emit('data', Object.values(mice));
}

setInterval(broadcastData, 1000/20);

server.listen(port, () => console.log(`Listening on port ${port}`));

