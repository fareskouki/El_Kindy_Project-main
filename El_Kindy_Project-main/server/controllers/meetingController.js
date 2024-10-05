import Meeting from "../models/Meeting.js";
import cron from 'node-cron';

const deleteExpiredMeetings = async () => {
  try {
   // console.log('Suppression des réunions expirées...');
    const currentDate = new Date();

    const result = await Meeting.deleteMany({
      // Date expirée avec heure de fin non expirée
      $and: [
        { date: { $lt: currentDate } }, // Date expirée
        { endTime: currentDate } // Heure de fin expirée ou égale à l'heure actuelle
      ]
    });

    //console.log('Résultat de la suppression des réunions :', result);
    //console.log('Réunions expirées supprimées avec succès.');
  } catch (error) {
   // console.error('Erreur lors de la suppression des réunions expirées :', error.message);
  }
};


// Tâche cron
cron.schedule('* * * * *', async () => {
  try {
   // console.log('Tâche cron démarrée à :', new Date());
    
    // Appeler la fonction pour supprimer les réunions expirées
    await deleteExpiredMeetings();

   // console.log('Tâche cron terminée avec succès.');
  } catch (error) {
  //  console.error('Erreur dans la tâche cron :', error.message);
  }
});
// Ajouter une nouvelle réunion
export const addMeeting = async (req, res) => {
  try {
    const { startTime, endTime, date, meetingLink, students } = req.body;

    // Créer une nouvelle instance de la réunion
    const newMeeting = new Meeting({
      startTime,
      endTime,
      date,
      meetingLink,
      students
    });

    // Enregistrer la réunion dans la base de données
    const savedMeeting = await newMeeting.save();

    // Répondre avec la nouvelle réunion ajoutée
    res.status(201).json(savedMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la réunion', error: error.message });
  }
};

// Fetch all meetings
export const getAllMeetings = async (req, res) => {
  try {
    // Query the database to get all meetings
    const meetings = await Meeting.find();

    // Respond with the list of meetings
    res.status(200).json({ data: meetings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réunions', error: error.message });
  }
};
