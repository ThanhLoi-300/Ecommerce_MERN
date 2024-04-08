const router = require("express").Router();
const messageController = require("../controller/message");

// create new message
router.post("/create-new-message", messageController.createMessage);

// get all messages with conversation id
router.get("/get-all-messages/:id", messageController.getAllMessages);

module.exports = router;
