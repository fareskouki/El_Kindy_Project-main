import MessageModel from "../models/messageModel.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text,picturePath } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
    picturePath
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  console.log('ChatId:', chatId); // Add this line to log the chatId
  try {
    const result = await MessageModel.find({ chatId:chatId });
    
    console.log('Messages:', result); // Add this line to log the result
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};