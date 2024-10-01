"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var wss = new ws_1.WebSocketServer({ port: 8080, path: "/ws/checkers" });
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
var rooms = [];
var sessions = [];
var users = new Map();
var userCounter = 0;
var userIdGenerator = function () {
    return userCounter++;
};
var dateToString = function () {
    return new Date().toLocaleTimeString("ru", {
        hour: "2-digit",
        minute: "2-digit",
    });
};
var sendAllUsersRoomList = function () {
    users.forEach(function (user) {
        user.ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
    });
};
var createRoom = function (nickname, ws, userId) {
    users.set(userId, { ws: ws, inGame: true, nickname: nickname });
    var roomId = rooms.length + 1;
    var room = {
        roomId: roomId,
        roomName: nickname,
        created: dateToString(),
        playersInRoom: [{ nickname: nickname, userId: userId, pieceType: "white" }],
    };
    rooms.push(room);
    var currentSession = {
        roomId: roomId,
        created: dateToString(),
        players: { creator: { ws: ws, userId: userId, nickname: nickname } },
        chat: [],
    };
    sessions.push(currentSession);
    ws.send(JSON.stringify({ action: "current_session", session: currentSession }));
};
var joinRoom = function (nickname, roomId, ws, userId) {
    users.set(userId, { ws: ws, inGame: true, nickname: nickname });
    if (rooms[roomId - 1].playersInRoom.length === 1) {
        rooms[roomId - 1].playersInRoom.push({
            nickname: nickname,
            userId: userId,
            pieceType: "black",
        });
        sessions.forEach(function (session) {
            if (session.roomId === roomId) {
                session.players.guest = { ws: ws, userId: userId, nickname: nickname };
                ws.send(JSON.stringify({ action: "current_session", session: session }));
                session.players.creator.ws.send(JSON.stringify({ action: "current_session", session: session }));
            }
        });
        return true;
    }
    return false;
};
wss.on("connection", function (ws) {
    // console.log("Client connected");
    var currentUserId = userIdGenerator();
    users.set(currentUserId, { ws: ws, inGame: false });
    ws.send(JSON.stringify({ action: "create_user", userId: currentUserId }));
    ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
    ws.on("message", function (message) {
        var data = JSON.parse(message.toString());
        switch (data.action) {
            case "create_room":
                createRoom(data.nickname, ws, data.userId);
                sendAllUsersRoomList();
                ws.send(JSON.stringify({
                    action: "to_room",
                    nickname: data.nickname,
                    roomId: data.roomId,
                }));
                break;
            case "join_room":
                if (joinRoom(data.nickname, data.roomId, ws, data.userId)) {
                    sendAllUsersRoomList();
                    ws.send(JSON.stringify({
                        action: "to_room",
                        nickname: data.nickname,
                        roomId: data.roomId,
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
                        creator.ws.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
                        (_a = guest === null || guest === void 0 ? void 0 : guest.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
                    }
                });
                break;
        }
    });
    ws.on("close", function () {
        sendAllUsersRoomList();
        users.forEach(function (user, key) {
            if (user.ws === ws) {
                users.delete(key);
            }
        });
        // console.log("Client disconnected");
    });
});
app.listen(PORT, function () {
    console.log("Server started on http://localhost:" + PORT);
});
