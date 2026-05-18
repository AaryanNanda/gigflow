import mongoose from 'mongoose';
import { LeadModel } from './models/Lead'; // Adjust path if your file name is pluralized like Lead.model or leads

const MONGO_URI = 'mongodb://127.0.0.1:27017/gigflow';

const dummyLeads = [
  { name: "Rahul Sharma", email: "rahul.sharma@gmail.com", status: "New", source: "Website" },
  { name: "Priya Patel", email: "priya.patel@outlook.com", status: "Contacted", source: "Instagram" },
  { name: "Aman Verma", email: "aman.v@techcorp.in", status: "Qualified", source: "Referral" },
  { name: "Sneha Reddy", email: "sneha.reddy@yahoo.com", status: "Lost", source: "Website" },
  { name: "Vikram Malhotra", email: "v.malhotra@financehub.com", status: "Qualified", source: "Referral" },
  { name: "Ananya Nair", email: "ananya.nair@designstudio.com", status: "Contacted", source: "Instagram" },
  { name: "Rohan Das", email: "rohan.das@coders.dev", status: "New", source: "Website" }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB for seeding...');
    
    // Clear out any old existing test data to keep it pristine
    await LeadModel.deleteMany({});
    
    // Inject the rich dummy datasets
    await LeadModel.insertMany(dummyLeads);
    console.log('🚀 Successfully seeded 7 diverse sales records into GigFlow!');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('⚠️ Seeding failed:', error);
  }
}

seedDatabase();