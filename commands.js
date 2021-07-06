const axios = require("axios");

const commands = {
    "joke": joke,
    "users": listUsers,
}

async function interpret(command, user, room, args) {
    if (!commands[command]) throw new Error(`Command ${command} is invalid!`);
    let response = await commands[command](user, room, ...args);
    return response;
}

function listUsers(user, room) {
    let members;
    for(let user of room.members){
        members += user.name;
    }

    user.send({
        type: "info",
        message: "Users: " + members
    });
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