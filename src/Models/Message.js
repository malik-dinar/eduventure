const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    conversationId:{
        type:String
    },
    sender:{
        type:String
    },
    text:{
        type:String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", MessageSchema);