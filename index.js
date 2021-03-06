const io = require("socket.io")(8000, {
    cors: {
        origin: "https://peace-social-app.herokuapp.com",
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {

    // Take uesrID and socket id from user
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    });

    //Send and get a Message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId, 
            text,
        })
    })

    //When disconnect
    socket.on("disconnect", () => {
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})