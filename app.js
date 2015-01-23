// var WebSocketServer = require("ws").Server
// var http = require("http")
// var express = require("express")
// var app = express()
// var port = process.env.PORT || 5000

// app.use(express.static(__dirname + "/"))

// var server = http.createServer(app)
// server.listen(port)

// console.log("http server listening on %d", port)

// var wss = new WebSocketServer({server: server})
// console.log("websocket server created")

// var connections = [];

// wss.on("connection", function(ws) {
// 	connections.push(ws);
// 	ws.on('close', function () {
// 		connections = connections.filter(function (conn, i) {
// 			return (conn === ws) ? false : true;
// 		});
// 	});
// 	ws.on('message', function (message) {
// 		console.log('message:', message);
// 		broadcast(JSON.stringify(message));
// 	});
// });

// function broadcast(message) {
//     connections.forEach(function (con, i) {
//         con.send(message);
//     });
// };

//app.js
var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express();
 
app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
var wss = new WebSocketServer({server:server});
var port = process.env.PORT || 5000


//Websocket接続を保存しておく
var connections = [];
 
//接続時
wss.on('connection', function (ws) {
    //配列にWebSocket接続を保存
    connections.push(ws);
    //切断時
    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });
    //メッセージ送信時
    ws.on('message', function (message) {
        console.log('message:', message);
        broadcast(message);
    });
});
 
//ブロードキャストを行う
function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};
 
server.listen(port);