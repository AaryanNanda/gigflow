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

    // Seed User Archetypes
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@gigflow.com',
      password: 'adminpassword123',
      role: 'Admin',
    });

    const managerUser = new User({
      name: 'Operations Manager',
      email: 'manager@gigflow.com',
      password: 'managerpassword123',
      role: 'Manager',
    });

    await adminUser.save();
    await managerUser.save();

    console.log('👤 Authorization profile models seeded successfully.');

    // Seed Operational Data Leads Matrices
    const mockLeads = [
      { name: 'Acme Corp Integration', email: 'procurement@acme.com', status: 'New', source: 'Website' },
      { name: 'Globex Cloud Migration', email: 'tech@globex.io', status: 'Contacted', source: 'LinkedIn' },
      { name: 'Initech Core Refactor', email: 'lumbergh@initech.com', status: 'Qualified', source: 'Referral' },
      { name: 'Umbrella Security Audit', email: 'wesker@umbrella.com', status: 'Proposal Sent', source: 'Cold Email' },
      { name: 'Stark Industries API Sync', email: 'jarvis@stark.com', status: 'Closed Won', source: 'Website' }
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