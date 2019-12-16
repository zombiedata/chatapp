const generateMessage = (username, id, message) => {
    return {
        socketId: id,
        username: username,
        text: message,
        createdAt: new Date().getTime()
    }
}


module.exports = {generateMessage};















