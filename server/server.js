"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var connection = new ws_1.WebSocketServer({ port: 8080, path: "/ws/checkers" });
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
var rooms = [];
var sessions = [];
var users = [];
// const users = new Map<number, WebSocket>();
var dateToString = function () {
    return new Date().toLocaleTimeString("ru", {
        hour: "2-digit",
        minute: "2-digit",
    });
};
var sendAllUsersRoomList = function () {
    users.forEach(function (user) {
        user.send(JSON.stringify({ action: "create_room", rooms: rooms }));
    });
};
var createRoom = function (nickname, ws) {
    var room = {
        id: rooms.length + 1,
        name: nickname,
        created: dateToString(),
        players: [{ name: nickname, pieceType: "white" }],
    };
    rooms.push(room);
    sessions.push({
        id: sessions.length + 1,
        created: dateToString(),
        players: { creator: { connect: ws, nickname: nickname } },
        chat: [],
    });
};
var joinRoom = function (nickname, id, ws) {
    if (rooms[id - 1].players.length === 1) {
        rooms[id - 1].players.push({ name: nickname, pieceType: "black" });
        sessions.forEach(function (session) {
            if (session.id === id) {
                session.players.guest = { connect: ws, nickname: nickname };
            }
        });
        return true;
    }
    return false;
};
connection.on("connection", function (ws) {
    console.log("Client connected");
    users.push(ws);
    ws.send(JSON.stringify({ action: "create_room", rooms: rooms }));
    ws.on("message", function (message) {
        var data = JSON.parse(message.toString());
        switch (data.action) {
            case "create_room":
                createRoom(data.nickname, ws);
                sendAllUsersRoomList();
                ws.send(JSON.stringify({
                    action: "to_room",
                    nickname: data.nickname,
                    id: data.id,
                }));
                break;
            case "join_room":
                if (joinRoom(data.nickname, data.id, ws)) {
                    sendAllUsersRoomList();
                    ws.send(JSON.stringify({
                        action: "to_room",
                        nickname: data.nickname,
                        id: data.id,
                    }));
                }
                break;
            case "chat_message":
                sessions.forEach(function (session) {
                    var _a;
                    var creator = session.players.creator;
                    var guest = session.players.guest;
                    if (data.nickname === creator.nickname || data.nickname === (guest === null || guest === void 0 ? void 0 : guest.nickname)) {
                        session.chat.push({ nickname: data.nickname, date: dateToString(), text: data.text });
                        creator.connect.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
                        (_a = guest === null || guest === void 0 ? void 0 : guest.connect) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
                    }
                });
                break;
        }
    });
    ws.on("close", function () {
        sendAllUsersRoomList();
        console.log("Client disconnected");
    });
});
app.listen(PORT, function () {
    console.log("Server started on http://localhost:" + PORT);
});
