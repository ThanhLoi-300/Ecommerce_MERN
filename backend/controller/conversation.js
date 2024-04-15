const Conversation = require("../model/conversation");
const User = require("../model/user");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

module.exports = {
    createConversation: async (req, res, next) => {
        try {
            const { groupTitle, userId, sellerId } = req.body;

            const isConversationExist = await Conversation.findOne({ groupTitle });

            if (isConversationExist) {
                const conversation = isConversationExist;
                res.status(201).json({
                    success: true,
                    conversation,
                });
            } else {
                const user = await User.findById(userId);
                const shop = await Shop.findById(sellerId).populate("user");
                const conversation = await Conversation.create({
                    user, shop,
                    groupTitle: groupTitle,
                });

                res.status(201).json({
                    success: true,
                    conversation,
                });
            }
        } catch (error) {
            return next(new ErrorHandler(error.response.message), 500);
        }
    },
    
    getSellerConversation: async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                shop: req.params.id,
            }).sort({ updatedAt: -1, createdAt: -1 });

            res.status(201).json({
                success: true,
                conversations,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    },
    
    getUserConversation: async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                user: req.params.id,
            }).sort({ updatedAt: -1, createdAt: -1 });

            res.status(201).json({
                success: true,
                conversations,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    },
    
    updateLastMessage: async (req, res, next) => {
        async (req, res, next) => {
            try {
                const { lastMessage, lastMessageId } = req.body;

                const conversation = await Conversation.findByIdAndUpdate(
                    req.params.id,
                    {
                        lastMessage,
                        lastMessageId,
                    }
                );

                res.status(201).json({
                    success: true,
                    conversation,
                });
            } catch (error) {
                return next(new ErrorHandler(error), 500);
            }
        };
    }
};

// module.exports = router;
