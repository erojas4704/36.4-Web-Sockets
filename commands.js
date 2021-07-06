const axios = require("axios");

const commands = {
    "joke": joke,
    "users": listUsers,
    "priv": privateMessage,
    "w": privateMessage,
    "t": privateMessage,
    "whisper": privateMessage
}

async function interpret(command, user, room, args) {
    if (!commands[command]) throw new Error(`Command ${command} is invalid!`);
    let response = await commands[command](user, room, ...args);
    return response;
}

function listUsers(user, room) {
    let members = "";
    for (let user of room.members) {
        members += " " + user.name;
    }

    user.send(JSON.stringify({
        name: "Server",
        type: "chat",
        text: "Users: " + members
    }));
}

function privateMessage(user, room, toUser, message) {
    debugger;
    try {
        let target = room.getUser(toUser);
        target.send(JSON.stringify({
            name: `From ${user.name}`,
            type: "private",
            text: message
        }));
        user.send(JSON.stringify({
            name: `To ${toUser}`,
            type: "private",
            text: message
        }));
    }catch(err){
        user.send(JSON.stringify({
            name: "Server",
            type: "error",
            text: err.message
        }));
    }
}

async function joke(user, room) {
    let joke;
    try {
        let res = await axios.get("https://icanhazdadjoke.com/", {
            headers: {
                "Accept": "application/json"
            }
        });
        joke = res.data.joke;
    } catch (err) {
        joke = `We could not get the joke. \n ${err}`
    }

    room.broadcast({
        name: user.name,
        type: 'chat',
        text: joke
    });
}

module.exports = {
    interpret
}