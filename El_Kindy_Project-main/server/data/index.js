import mongoose from "mongoose";

const userIds = [
  new mongoose.Types.ObjectId()
];

export const users = [
  {
    _id: userIds[0],
    firstName: "malc,a",
    lastName: "aknc",
    email: "aaaaaaazralecng@gmail.com",
    password: "$2b$10$dsasdgsagacasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUyz"
  }
];
