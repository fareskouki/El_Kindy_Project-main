import Contact from "../models/ContactModel.js";


// Get All contacts
export async function list(req, res) {
  try {
    let contacts = await Contact.find({});
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "Could not retrieve contacts",
      });
  }
}


export const update = async (req, res) => {
  try {
      const { id } = req.params;
      let updateData = req.body; // Assuming req.body contains the fields to update


      // Update the category with the given ID
      const updatedClasse = await Contact.findByIdAndUpdate(id, updateData, { new: true });
     
      if (!updatedClasse) {
          return res.status(404).json({ success: false, error: "Class not found." });
      }

      return res.status(200).json({ success: true, data: updatedClasse });
  } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete salle
export async function remove(req, res) {
  const contactId = req.params.id;
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "contact not found with this id" });
    }
    res.status(204).send(); 
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "Could not delete Contact",
      });
  }
}

export const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
      const contact = await Contact.findById(id);
      if (!contact) {
          return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { fullName, email, message } = req.body;

    const newContact = new Contact({
        fullName,
        email,
        message,
    });

    const savedContact = await newContact.save();

    return res.status(201).json({
      success: true,
      id: savedContact._id,
      message: "The Contact has been created!",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
