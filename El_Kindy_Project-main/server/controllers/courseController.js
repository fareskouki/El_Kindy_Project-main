import Course from '../models/Course.js';
import Categorie from './../models/Categorie.js';

export const getAll = async (req, res) => {
    try {
        let data = await Course.find().populate('courseCategory');
        if (!data || !data.length) throw 'No courses found!';
        return res.status(200).json({success: true, data });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

export const getAllCoursesGroupedByCategory = async (req, res) => {
    try {
        // Aggregate courses by courseCategory field
        const coursesByCategory = await Course.aggregate([
            {
                $lookup: {
                    from: 'categories', // Name of the category collection
                    localField: 'courseCategory',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $group: {
                    _id: '$courseCategory',
                    categoryName: { $first: '$category.name' }, // Get the name of the category
                    courses: { $push: '$$ROOT' }
                }
            }
        ]);

        // If no courses are found or the result is empty, return an error
        if (!coursesByCategory || !coursesByCategory.length) {
            throw new Error('No courses found!');
        }

        // Return the grouped courses
        return res.status(200).json({ success: true, data: coursesByCategory });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};



export const addNewCourse = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const {
            title,
            description,
            fullDescription,
            picturePath,
            courseCategory,
            courseLevel,
            courseTime,
            coursePrice
        } = req.body;

        const newCourse = new Course({
            title,
            description,
            fullDescription,
            picturePath,
            courseCategory,
            courseLevel,
            courseTime,
            coursePrice
        });

        const savedCourse = await newCourse.save();

        // Find the category to which the course belongs
        const category = await Categorie.findById(courseCategory);
        //console.log("Category : ",category);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        // Add the newly created course's ID to the courses array of the category
        category.courses.push(savedCourse._id);

        // Save the updated category
        await category.save();

        return res.status(201).json({
            success: true,
            id: savedCourse._id,
            message: "The course has been created and added to the category!"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
};


export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
 
        const updatedCourse = await Course.findByIdAndUpdate(id, { $set: req.body }, { new: true });
 
        if (!updatedCourse) {
            return res.status(404).json({ success: false, error: "Course not found." });
        }
 
        return res.status(200).json({ success: true, data: updatedCourse});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
 };

 export const removeCourse = async (req, res) => {
    try {
        const { id } = req.params;
 
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ success: false, error: "Course not found." });
        }
 
        return res.status(200).json({ success: true, message: "Course deleted successfully." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err.message });
    }
 }
 
 export const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id).populate('courseCategory');;
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({course});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};