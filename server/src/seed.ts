import { User } from './models/User';
import { Lead } from './models/Lead';
import { connectDatabase } from './config/db';
import dotenv from 'dotenv';

// Load environmental parameters into active processing memory
dotenv.config();

const seedDataPipeline = async (): Promise<void> => {
  try {
    await connectDatabase();

    // Clear existing collection states to prevent duplicate key constraint crashes
    await User.deleteMany({});
    await Lead.deleteMany({});

    console.log('🗑️ Existing collection historical baselines purged.');

    // Seed User Archetypes matching your explicit schema enums
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@gigflow.com',
      password: 'adminpassword123',
      role: 'Admin', 
    });

    const salesUser = new User({
      name: 'Sales Executive',
      email: 'manager@gigflow.com', 
      password: 'managerpassword123', 
      role: 'Sales User', 
    });

    await adminUser.save();
    await salesUser.save();

    console.log('👤 Authorization profile models seeded successfully.');

    // Setting all sources to 'Website' to safely clear the Lead schema enum constraint
    const mockLeads = [
      { name: 'Acme Corp Integration', email: 'procurement@acme.com', status: 'New', source: 'Website' },
      { name: 'Globex Cloud Migration', email: 'tech@globex.io', status: 'New', source: 'Website' },
      { name: 'Initech Core Refactor', email: 'lumbergh@initech.com', status: 'New', source: 'Website' },
      { name: 'Umbrella Security Audit', email: 'wesker@umbrella.com', status: 'New', source: 'Website' },
      { name: 'Stark Industries API Sync', email: 'jarvis@stark.com', status: 'New', source: 'Website' }
    ];

    await Lead.insertMany(mockLeads);
    console.log('📈 Operational tracking leads pipeline loaded into core.');

    console.log('✅ Seeding transaction process terminated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding pipeline execution runtime exception encountered:', error);
    process.exit(1);
  }
};

seedDataPipeline();