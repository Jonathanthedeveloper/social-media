const mongoose = require("mongoose")
const app = require("./app")


/**
 * Connect to database
 */
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to mongodb sucessfully"))
    .catch(() => console.log("failed to connect to database"))


const PORT = process.env.PORT || 3000


/**
 * Listen for incoming requests on the port specified in the .env file or 3000
 */
app.listen(PORT, function () {
    console.log(`server started on http://127.0.0.1:${PORT}`)
})

process.on("uncaughtException", function(error) {
    console.log(`UNCAUGHT EXCEPTION: ${error}`)
})

process.on("unhandledRejection", function(error) {
    console.log(`UNHANDLED REJECTION: ${error}`)
})