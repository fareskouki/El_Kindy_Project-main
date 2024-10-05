import { log } from "console";
import ChatModel from "../models/chatModel.js";
import User from "../models/User.js";

export const createChat = async (req, res) => {
  console.log("createChat", req.body);
  const { senderId, receiverId } = req.body;
  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'Both senderId and receiverId are required' });
  }

  try {
    // Vérifiez si un chat existe déjà entre l'expéditeur et le destinataire
    const existingChat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (existingChat) {
      // Le chat existe déjà, renvoyer un message approprié
      console.log("Chat already exists between sender and receiver");
      return res.status(200).json({ error: 'Chat already exists between sender and receiver' });
    }

    // Le chat n'existe pas encore, créer un nouveau chat
    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });console.log("newChat",newChat);
    const result = await newChat.save();
    res.status(201).json(result);
    console.log("result", result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await ChatModel.find({
      members: { $elemMatch: { $eq: userId } },
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get the chats of the current user
export const getChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    let chats = await ChatModel.find({
      members: { $in: [userId] }
    }).lean(); // Utilisez .lean() pour améliorer la performance en retournant des objets JavaScript simples

    // Enrichir chaque chat avec les informations de l'autre utilisateur
    const chatsWithOtherUserInfo = await Promise.all(chats.map(async (chat) => {
      // Trouvez l'ID de l'autre utilisateur
      const otherUserId = chat.members.find(id => id !== userId);
      // Récupérez les informations de base de l'autre utilisateur
      const otherUser = await User.findById(otherUserId, 'firstName lastName picturePath').lean();
      
      // Ajoutez les informations de l'autre utilisateur à l'objet de chat
      return { ...chat, otherUser };
    }));

    res.status(200).json(chatsWithOtherUserInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur lors de la récupération des chats" });
  }
};



export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
    console.log("chat", chat);
  } catch (error) {
    res.status(500).json(error)
  }
};