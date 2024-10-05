import mongoose from "mongoose";
import { type } from "os";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
           required: true,
            min: 2,
            max:50,
        }, 
        lastName: {
            type: String,
            required: true,
            min: 2,
            max:50,
        }, 
        email: {
            type: String,
            required: true,
            max:50,
            unique: true,
        }, 
        password: {
            type: String,
            required: true,
            min:5,
        },
        passwordDecoded: {
            type: String
        },
        picturePath: {
            type: String,
            default: "",
        },
        verified: {
            type: Boolean,
            default: false
        },
        blocked: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String,
            default: ""
        },
        authSource: {
            type: String,
            default: "local"
        },
        roles: {
            type: [String], // Allow multiple roles for a user
            enum: ["superAdmin", "admin", "teacher", "student"],
            default: ["student"] // Assuming default role is student
        },
        // Additional attributes for all users
        dateOfBirth: {
            type: Date,
            default: null
        },
        address: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            //required: true
        },
        phoneNumber1: {
        type: String,
        //required: true
        },
        phoneNumber2: {
        type: String
        },
        disponibilite: {
            type: Array,
            default: []
        },
        secret: {
            type :String,
            default: ""
        },
        TwoFactorAuthentication:{
            type : Boolean,
            default: false
        },
        qrCode: {
            type: String,
            default: ""
        },

        // Additional attributes for specific roles
        teacherInfo: {
            type: {
                coursesTaught: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                }],
                // Reference to the classes taught by the teacher
                classesTeaching: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Classe',
                }],
                studentsTaught: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User', // Reference the User model
                }],
                qualifications: {
                    type: String,
                    default: ""
                },
                experienceYears: {
                    type: Number,
                    default: 0
                },
                // You can add more fields specific to teachers here
            },
            _id: false, // Exclude _id field from teacherInfo sub-document
            required: function() {
                return this.roles.includes('teacher');
            }
        },

        studentInfo: {
            type: {
                classLevel: {
                    type: mongoose.Schema.Types.ObjectId, // Assuming classLevel relates to Classe model
                    ref: 'Classe', // Referencing the Classe model
                    default: null // Default value if not specified
                },
                coursesEnrolled: {
                    type: [{
                        type: mongoose.Schema.Types.ObjectId, // Assuming coursesEnrolled relates to Course model
                        ref: 'Course', // Referencing the Course model
                    }],
                    default: []
                },
                parentName: {
                    type: String,
                    default: ""
                },
                parentProfession: {
                    type: String,
                    default: ""
                },
                parentEmail: {
                    type: String,
                    default: ""
                },
                parentPhone: {
                    type: String,
                    default: ""
                }
            },
            _id: false,
            required: function() {
                return this.roles.includes('student');
            }
        }
        

    },
    
    { timestamps: true}
    );

    const User = mongoose.model("User",UserSchema);
    export default User;