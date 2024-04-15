const Messages = require("../model/messages");
const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");

module.exports = {
  createMessage: async (req, res, next) => {
    try {
      const messageData = req.body;

      if (req.body.images) messageData.images = req.body.images;

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();

      const conversation = await Conversation.findByIdAndUpdate(req.body.conversationId, {
        lastMessage: messageData.text,
        //lastMessageId,
      });

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  },

  getAllMessages: async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  },
};

