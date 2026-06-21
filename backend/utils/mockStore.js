const bcrypt = require('bcryptjs');

let users = [];
let opportunities = [];

// Initialize seed data
const initMockData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const alicePasswordHash = await bcrypt.hash('password123', salt);
    const bobPasswordHash = await bcrypt.hash('password123', salt);

    users = [
      {
        _id: 'user_alice_12345',
        id: 'user_alice_12345',
        name: 'Alice Johnson',
        email: 'alice@crm.com',
        password: alicePasswordHash,
      },
      {
        _id: 'user_bob_67890',
        id: 'user_bob_67890',
        name: 'Bob Smith',
        email: 'bob@crm.com',
        password: bobPasswordHash,
      },
    ];

    opportunities = [
      {
        _id: 'opp_stark_1',
        id: 'opp_stark_1',
        customerName: 'Stark Industries',
        contactName: 'Pepper Potts',
        contactEmail: 'pepper@stark.com',
        contactPhone: '+1 (555) 012-3456',
        requirementSummary: 'Supply of advanced high-yield energy cells and grid control software contract.',
        estimatedDealValue: 450000,
        stage: 'Won',
        priority: 'High',
        nextFollowUpDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        notes: 'Negotiations finalized. Contract signed by Tony and Pepper.',
        owner: 'user_alice_12345',
        createdAt: new Date(Date.now() - 100000),
        updatedAt: new Date(Date.now() - 100000),
      },
      {
        _id: 'opp_wayne_2',
        id: 'opp_wayne_2',
        customerName: 'Wayne Enterprises',
        contactName: 'Lucius Fox',
        contactEmail: 'lucius@wayne.com',
        contactPhone: '+1 (555) 987-6543',
        requirementSummary: 'Procurement of satellite communication transceivers and telemetry arrays.',
        estimatedDealValue: 280000,
        stage: 'Proposal Sent',
        priority: 'High',
        nextFollowUpDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: 'Sent formal pricing spreadsheet. Waiting for board approval.',
        owner: 'user_alice_12345',
        createdAt: new Date(Date.now() - 200000),
        updatedAt: new Date(Date.now() - 200000),
      },
      {
        _id: 'opp_acme_3',
        id: 'opp_acme_3',
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
        owner: 'user_bob_67890',
        createdAt: new Date(Date.now() - 300000),
        updatedAt: new Date(Date.now() - 300000),
      },
      {
        _id: 'opp_tyrell_4',
        id: 'opp_tyrell_4',
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
        owner: 'user_bob_67890',
        createdAt: new Date(Date.now() - 400000),
        updatedAt: new Date(Date.now() - 400000),
      },
      {
        _id: 'opp_oscorp_5',
        id: 'opp_oscorp_5',
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
        owner: 'user_alice_12345',
        createdAt: new Date(Date.now() - 500000),
        updatedAt: new Date(Date.now() - 500000),
      },
      {
        _id: 'opp_umbrella_6',
        id: 'opp_umbrella_6',
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
        owner: 'user_bob_67890',
        createdAt: new Date(Date.now() - 600000),
        updatedAt: new Date(Date.now() - 600000),
      },
    ];
  } catch (error) {
    console.error('Failed to initialize mock data:', error);
  }
};

initMockData();

const findUserByEmail = async (email) => {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = async (id) => {
  return users.find((u) => u._id === id);
};

const createUser = async (name, email, password) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const id = 'user_' + Math.random().toString(36).substr(2, 9);
  const newUser = {
    _id: id,
    id,
    name,
    email: email.toLowerCase(),
    password: passwordHash,
  };
  users.push(newUser);
  return newUser;
};

const verifyPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

const getOpportunities = async () => {
  return opportunities
    .map((opp) => {
      const ownerUser = users.find((u) => u._id === opp.owner);
      return {
        ...opp,
        owner: ownerUser
          ? { _id: ownerUser._id, name: ownerUser.name, email: ownerUser.email }
          : null,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
};

const getOpportunityById = async (id) => {
  const opp = opportunities.find((o) => o._id === id);
  if (!opp) return null;
  const ownerUser = users.find((u) => u._id === opp.owner);
  return {
    ...opp,
    owner: ownerUser
      ? { _id: ownerUser._id, name: ownerUser.name, email: ownerUser.email }
      : null,
  };
};

const createOpportunity = async (data, ownerId) => {
  const id = 'opp_' + Math.random().toString(36).substr(2, 9);
  const newOpp = {
    _id: id,
    id,
    ...data,
    estimatedDealValue: Number(data.estimatedDealValue),
    owner: ownerId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  opportunities.push(newOpp);

  const ownerUser = users.find((u) => u._id === ownerId);
  return {
    ...newOpp,
    owner: ownerUser
      ? { _id: ownerUser._id, name: ownerUser.name, email: ownerUser.email }
      : null,
  };
};

const updateOpportunity = async (id, data, ownerId) => {
  const idx = opportunities.findIndex((o) => o._id === id);
  if (idx === -1) return null;

  const opp = opportunities[idx];
  if (opp.owner !== ownerId) {
    throw new Error('Not authorized to update this opportunity');
  }

  const updatedOpp = {
    ...opp,
    ...data,
    estimatedDealValue:
      data.estimatedDealValue !== undefined
        ? Number(data.estimatedDealValue)
        : opp.estimatedDealValue,
    updatedAt: new Date(),
  };

  opportunities[idx] = updatedOpp;

  const ownerUser = users.find((u) => u._id === ownerId);
  return {
    ...updatedOpp,
    owner: ownerUser
      ? { _id: ownerUser._id, name: ownerUser.name, email: ownerUser.email }
      : null,
  };
};

const deleteOpportunity = async (id, ownerId) => {
  const idx = opportunities.findIndex((o) => o._id === id);
  if (idx === -1) return null;

  const opp = opportunities[idx];
  if (opp.owner !== ownerId) {
    throw new Error('Not authorized to delete this opportunity');
  }

  opportunities.splice(idx, 1);
  return { id };
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
