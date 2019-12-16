const socket = io();

socket.on("welcomeMessage",  (welcomeMessage) => {
    const html = Mustache.render($messageTemplate, {
        id: welcomeMessage.socketId,
        username: welcomeMessage.username,
        message: welcomeMessage.text,
        time: moment(welcomeMessage.createdAt).format("hh:mm:ss a")
    })
    
    $allMessages.insertAdjacentHTML('beforeend', html)
})


const $messageForm = document.querySelector("#message-form");
const $messageFormTextInput = $messageForm["message"]
const $messageFormSentButton = $messageForm["send"]
const $allMessages = document.querySelector("#messages");

// message-template
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;

// options
const {room, username} = Qs.parse(location.search, { ignoreQueryPrefix: true });


const autoScroll = () => {
    // New message element
    const $newMessage = $allMessages.lastElementChild;

    // get styles of new messages
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $allMessages.offsetHeight

    // height of message contaniner
    const containerHeight = $allMessages.scrollHeight;


    const scrollOffset = $allMessages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $allMessages.scrollTop = $allMessages.scrollHeight
    }

    

    

}

// welcome msg
socket.on("userJoinMessage",  (joiningUserMessage) => {
    const html = Mustache.render($messageTemplate, {
        id: joiningUserMessage.socketId,
        username: joiningUserMessage.username,
        message: joiningUserMessage.text,
        time: moment(joiningUserMessage.createdAt).format("hh:mm:ss a")
    })
    
    $allMessages.insertAdjacentHTML('beforeend', html)
})

// roomData
socket.on("roomData", ({room, usersInRoom}) => {
    console.log(room, usersInRoom)
    const html = Mustache.render($sideBarTemplate, {
        room: room,
        users: usersInRoom
    })

    document.querySelector("#sidebar").innerHTML = html;
})


// sending msg to server
$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    socket.emit("inputMessage", $messageFormTextInput.value)

    $messageFormTextInput.value = "";
})

// receiving input msg
socket.on("chat-message", (inputMessage) => {
    console.log(inputMessage)
    const html = Mustache.render($messageTemplate, {
        id: inputMessage.socketId,
        username: inputMessage.username,
        message: inputMessage.text,
        time: moment(inputMessage.createdAt).format("hh:mm:ss a")
    })
    
    $allMessages.insertAdjacentHTML('beforeend', html)

    autoScroll();
})

























// user left room msg
socket.on("leftUserMessage", (leavingMessage) => {
    const html = Mustache.render($messageTemplate, {
        id: leavingMessage.socketId,
        username: leavingMessage.username,
        message: leavingMessage.text,
        time: moment(leavingMessage.createdAt).format("hh:mm:ss a")
    })
    
    $allMessages.insertAdjacentHTML('beforeend', html)
})


socket.emit("join", {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = "/";
    }
})