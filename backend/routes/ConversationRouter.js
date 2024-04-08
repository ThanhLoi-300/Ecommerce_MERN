const router = require("express").Router();
const conversationController = require("../controller/conversation");
const { isSeller, isAuthenticated } = require("../middleware/auth");

// create a new conversation
router.post("/create-new-conversation", conversationController.createConversation);

// get seller conversations
router.get("/get-all-conversation-seller/:id", isSeller, conversationController.getSellerConversation);

// get user conversations
router.get("/get-all-conversation-user/:id", isAuthenticated, conversationController.getUserConversation);

// update the last message
router.put("/update-last-message/:id", conversationController.updateLastMessage);

module.exports = router;
