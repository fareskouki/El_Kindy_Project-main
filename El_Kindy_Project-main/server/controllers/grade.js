import Grade from '../models/Grade.js';

export const affectGrade = async (req, res) => {
  try {
    // Extract data from the request body
    const { studentId, courseId, grade, classId } = req.body;

    // Validate input data
    if (!studentId || !courseId || !grade || !classId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the grade already exists for the student and course
    let existingGrade = await Grade.findOne({ student: studentId, course: courseId, classId: classId });

    // If the grade exists, update it
    if (existingGrade) {
      existingGrade.grade = grade;
      await existingGrade.save();
      return res.status(200).json({ message: 'Grade updated successfully' });
    } else {
      // If the grade doesn't exist, create a new one
      const newGrade = new Grade({
        student: studentId,
        course: courseId,
        grade: grade,
        classId: classId // Changed from 'class' to 'classId'
      });
      await newGrade.save();
      return res.status(201).json({ message: 'Grade created successfully' });
    }
  } catch (error) {
    console.error('Error affecting grade:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//methode to get the grades
export const getGrades = async (req, res) => {
  try {
    const grades = await Grade.find();
    return res.status(200).json(grades);
  } catch (error) {
    console.error('Error getting grades:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//methhode to get grades by class and course so pass theme in header
export const getGradesByCourseAndClass = async (req, res) => {
  try {
    const { courseId, classId } = req.params;
    const grades = await Grade.find({ course: courseId, classId: classId });
    return res.status(200).json(grades);
  } catch (error) {
    console.error('Error getting grades:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//get grades by student and course
export const getGradesByStudentAndCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const grades = await Grade.find({ student: studentId, course: courseId });
    return res.status(200).json(grades);
  } catch (error) {
    console.error('Error getting grades:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGradeById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.find({ student: studentId }).populate('student');
    return res.status(200).json(grades);
  } catch (error) {
    console.error('Error getting grades:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const getGradeByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.find({ student: studentId }).populate('student');
    return res.status(200).json(grades);
  } catch (error) {
    console.error('Error getting grades:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//affect grade without class attribut 
export const affectGradeWithoutClass = async (req, res) => {
  try {
    // Extract data from the request body
    const { studentId, courseId, grade } = req.body;

    // Validate input data
    if (!studentId || !courseId || !grade) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the grade already exists for the student and course
    let existingGrade = await Grade.findOne({ student: studentId, course: courseId });

    // If the grade exists, update it
    if (existingGrade) {
      existingGrade.grade = grade;
      await existingGrade.save();
      return res.status(200).json({ message: 'Grade updated successfully' });
    } else {
      // If the grade doesn't exist, create a new one
      const newGrade = new Grade({
        student: studentId,
        course: courseId,
        grade: grade
      });
      await newGrade.save();
      return res.status(201).json({ message: 'Grade created successfully' });
    }
  } catch (error) {
    console.error('Error affecting grade:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

