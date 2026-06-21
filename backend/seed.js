const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');

// Load environment variables
dotenv.config();

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@crm.com',
    password: 'password123', // Will be hashed by pre-save hooks
  },
  {
    name: 'Bob Smith',
    email: 'bob@crm.com',
    password: 'password123', // Will be hashed by pre-save hooks
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm_opportunity_tracker');
    console.log('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Opportunity.deleteMany();
    console.log('Cleared existing data...');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} seed users:`);
    createdUsers.forEach((u) => console.log(` - ${u.name} (${u.email})`));

    const userAlice = createdUsers[0]._id;
    const userBob = createdUsers[1]._id;

    // Opportunities template list
    const opportunities = [
      {
        customerName: 'Stark Industries',
        contactName: 'Pepper Potts',
        contactEmail: 'pepper@stark.com',
        contactPhone: '+1 (555) 012-3456',
        requirementSummary: 'Supply of advanced high-yield energy cells and grid control software contract.',
        estimatedDealValue: 450000,
        stage: 'Won',
        priority: 'High',
        nextFollowUpDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days in future
        notes: 'Negotiations finalized. Contract signed by Tony and Pepper.',
        owner: userAlice,
      },
      {
        customerName: 'Wayne Enterprises',
        contactName: 'Lucius Fox',
        contactEmail: 'lucius@wayne.com',
        contactPhone: '+1 (555) 987-6543',
        requirementSummary: 'Procurement of satellite communication transceivers and telemetry arrays.',
        estimatedDealValue: 280000,
        stage: 'Proposal Sent',
        priority: 'High',
        nextFollowUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days in PAST (overdue!)
        notes: 'Sent formal pricing spreadsheet. Waiting for board approval.',
        owner: userAlice,
      },
      {
        customerName: 'Acme Corp',
        contactName: 'Wile E. Coyote',
        contactEmail: 'wile@acme.com',
        contactPhone: '+1 (555) 444-2222',
        requirementSummary: 'Purchase order of custom explosive devices, magnetic bearings, and giant magnets.',
        estimatedDealValue: 12000,
        stage: 'Qualified',
        priority: 'Medium',
        nextFollowUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Verified budget. Client requires custom delivery options.',
        owner: userBob,
      },
      {
        customerName: 'Tyrell Corporation',
        contactName: 'Rachael Tyrell',
        contactEmail: 'rachael@tyrell.com',
        contactPhone: '+1 (555) 111-9999',
        requirementSummary: 'Cloud storage expansion for database hosting of genetic records and organic schemas.',
        estimatedDealValue: 1250000,
        stage: 'Contacted',
        priority: 'High',
        nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        notes: 'Brief call. Showed interest in demo. Scheduled webinar.',
        owner: userBob,
      },
      {
        customerName: 'Oscorp Industries',
        contactName: 'Harry Osborn',
        contactEmail: 'harry@oscorp.com',
        contactPhone: '+1 (555) 888-7777',
        requirementSummary: 'Trial licenses for telemetry analysis engine and predictive models.',
        estimatedDealValue: 45000,
        stage: 'New',
        priority: 'Low',
        nextFollowUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        notes: 'Inbound web lead. Assigned to sales representative.',
        owner: userAlice,
      },
      {
        customerName: 'Umbrella Corporation',
        contactName: 'Albert Wesker',
        contactEmail: 'wesker@umbrella.com',
        contactPhone: '+1 (555) 666-6666',
        requirementSummary: 'Biometric security database synchronization licenses.',
        estimatedDealValue: 95000,
        stage: 'Lost',
        priority: 'Medium',
        nextFollowUpDate: null,
        notes: 'Lost deal to competitor due to custom pricing differences.',
        owner: userBob,
      },
    ];

    // Save opportunities
    const createdOpps = await Opportunity.create(opportunities);
    console.log(`Successfully seeded ${createdOpps.length} opportunities!`);
    console.log('Seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
