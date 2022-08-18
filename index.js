const express = require('express');
const app = express();
const port = 8080;
const { Server } = require('socket.io'); 
//console.log(coreGame);
let server = require("http").createServer(app);

//serve static files from the public directory and the dist directory
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/dist'));


let io = require('socket.io')(server);


let users = {};
let mice = {};
io.on('connection', function(socket){
    console.log('a user connected');
    users[socket.id] = socket;
    socket.on('disconnect', function(){
        console.log('user disconnected');
        delete users[socket.id];
        delete mice[socket.id];
    });
    socket.on('mouse', function(data){
        mice[socket.id] = {x: parseInt(data.x), y: parseInt(data.y)};
        console.log(mice);
    });
});

function broadcastData(){
    io.emit('data', Object.values(mice));
}

setInterval(broadcastData, 1000/20);

server.listen(port, () => console.log(`Listening on port ${port}`));

