import Salle from "../models/Salle.js";


// Get All salles
export async function list(req, res) {
  try {
    let salles = await Salle.find({});
    res.json(salles);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "Could not retrieve salles",
      });
  }
}



// Edit salle
/*export async function update(req, res) {
  const salleId = req.params.id;
  try {
    const updatedSalle = await Salle.findByIdAndUpdate(salleId, req.body, {
      new: true,
    });
    if (!updatedSalle) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "salle not found" });
    }
    res.json(updatedSalle);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "Could not update salle",
      });
  }
}*/

export const update = async (req, res) => {
  try {
      const { id } = req.params;
      let updateData = req.body; // Assuming req.body contains the fields to update


      // Update the category with the given ID
      const updatedClasse = await Salle.findByIdAndUpdate(id, updateData, { new: true });
     
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
  const salleId = req.params.id;
  try {
    const deletedSalle = await Salle.findByIdAndDelete(salleId);
    if (!deletedSalle) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "salle not found with this id" });
    }
    res.status(204).send(); 
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: "Could not delete salle",
      });
  }
}

export const getClasseById = async (req, res) => {
  const { id } = req.params;

  try {
      const salle = await Salle.findById(id);
      if (!salle) {
          return res.status(404).json({ message: "Class not found" });
      }
      res.status(200).json(salle);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { name, capacity, status } = req.body;

    const newSalle = new Salle({
      name,
      capacity,
      status,
    });

    const savedSalle = await newSalle.save();

    return res.status(201).json({
      success: true,
      id: savedSalle._id,
      message: "The class has been created!",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
