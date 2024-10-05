import mongoose from "mongoose";

const shopSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picturePath: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  remise: {
    type: Number,
  },
  marque: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'refused'],
    default: 'pending',
  },
  etat: {
    type: String,
    enum: ['sold', 'unsold'],
    default: 'unsold', // Change default to 'unsold'
  },
  likedShop: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
 
}, { timestamps: true });

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
