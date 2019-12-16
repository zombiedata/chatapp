const users = []

// two users in different rooms with same name can exist but with same name in same room can;t exist
const addUsers = ({id, username, room}) => {

    // cleaning the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();


    // validating the data
    if(!username || !room) {
        return {
            error: "username and room are required"
        }
    }

    // check for exisiting users in particular room
    const exisitingUser = users.find(user => {
        return user.room === room && user.username === username;
    })

    // validate username
    if(exisitingUser) {
        return {
            error: "username is in use"
        }
    }

    // storing user
    const user = {id, username, room}
    users.push(user)
    return {user};
}

// addUsers({
//     id: 22,
//     username: "  Andrew",
//     room: "Delhi"
// })

// addUsers({
//     id: 41,
//     username: "Mike",
//     room: "Delhi"
// })

// addUsers({
//     id: 89,
//     username: "Jhon Doe",
//     room: "Delhi"
// })

// addUsers({
//     id: 75,
//     username: "Mike",
//     room: "Mumbai"
// })


// const res = addUsers({
//     id: 44,
//     username: "  Andrew",
//     room: "Mumbai"
// })

// console.log(res, users)

// remove user by id

const removeUser = (id) => {
    const index = users.findIndex(user => {
        return user.id === id
    })

    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}

// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)

// get users 
const getUser = (id) => {
    const matchedUser = users.find(user => {
        return user.id === id
    })

    if(!matchedUser) {
        return {error: "no user found"}
    }

    return matchedUser
}

// const myUser = getUser(34)
// console.log(myUser)

// getUsersInRoom
const getUsersInRoom = (room) => {
    const usersInRoom = users.filter(user => {
        return user.room === room
    })

    return usersInRoom
}

// const usersInRoom = getUsersInRoom("mumbai")
// console.log(usersInRoom)

module.exports = {
    addUsers,
    removeUser,
    getUser,
    getUsersInRoom,
}