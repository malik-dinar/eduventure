const Conversation = require("../models/Conversation");

const createConnection = (users,tutorId) => {
  users.forEach(async (user) => {
    console.log(user);
    const userId = user._id.toString();
    // Create a new conversation with the tutor and user
    const newConversation = new Conversation({
      members: [userId, tutorId],
    });
    await newConversation.save();
  });
};

module.exports = { createConnection }
