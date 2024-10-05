import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    ordre: {
      type: Number,
      required: [true, 'Order is required.'],
      unique: true, // Ensure ordre is unique
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
  },
  {
    strictPopulate: false, // Allow populating fields not defined in the schema
  }
);

classSchema.virtual('students', {
  ref: 'User', // Reference the User model
  localField: '_id',
  foreignField: 'studentInfo.classLevel',
  justOne: false, // Allow multiple students to be populated
});

const Classe = mongoose.model('Classe', classSchema);

export default Classe;