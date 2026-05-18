import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'Admin' | 'Sales User';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long'] 
  },
  role: { 
    type: String, 
    enum: ['Admin', 'Sales User'],
    default: 'Sales User'
  }
}, { timestamps: true });

// Corrected Async Pre-Save Middleware Hook
UserSchema.pre('save', async function (this: any) {
  // Only hash the password if it has been modified or is completely new
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error; // Throwing inside an async hook correctly passes the error to Mongoose
  }
});

// Password Comparison Instance Method
UserSchema.methods.comparePassword = async function (this: any, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', UserSchema);