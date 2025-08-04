import mongoose from 'mongoose';

export interface IExperience extends mongoose.Document {
  title: string;
  company: string;
  location?: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface IEducation extends mongoose.Document {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  grade?: string;
  description?: string;
}

export interface ISkill extends mongoose.Document {
  name: string;
  endorsements: number;
}

const experienceSchema = new mongoose.Schema<IExperience>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  }
});

const educationSchema = new mongoose.Schema<IEducation>({
  school: {
    type: String,
    required: [true, 'School name is required'],
    trim: true
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  fieldOfStudy: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  grade: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  }
});

const skillSchema = new mongoose.Schema<ISkill>({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  endorsements: {
    type: Number,
    default: 0
  }
});

export { experienceSchema, educationSchema, skillSchema };
