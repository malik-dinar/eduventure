const Conversation = require("../models/Conversation");
const Message = require("../models/message");

const asyncHandler = require("express-async-handler");

const newConversation = asyncHandler(async (req, res) => {
  const { senderId , receiverId } = req.body;; 
  const newConversation = new Conversation({
    members: [ senderId, receiverId],
  });

  const savedConversation = await newConversation.save();
  res.status(200).json(savedConversation);
});

const getConversation = asyncHandler(async(req, res) => {
    const conversation = await Conversation.find({
        members:{ $in :[req.params.userId]}
    })
    res.status(200).json(conversation);
});

const newMessage = asyncHandler(async(req,res)=>{
    const newMessage = new Message(req.body);

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
})

const getMessages = asyncHandler(async(req,res)=>{
    const messages = await Message.find({
        conversationId  : req.params.conversationId
    });
    res.status(200).json(messages);
})

module.exports = { newConversation , getConversation, newMessage ,getMessages};
