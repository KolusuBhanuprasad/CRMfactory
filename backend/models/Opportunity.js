const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Please add a customer name'],
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, 'Please add a contact name'],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Please add a contact email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid contact email',
      ],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    requirementSummary: {
      type: String,
      required: [true, 'Please add a requirement summary'],
    },
    estimatedDealValue: {
      type: Number,
      required: [true, 'Please add an estimated deal value'],
      min: [0, 'Deal value cannot be negative'],
    },
    stage: {
      type: String,
      required: [true, 'Please specify the stage'],
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid stage',
      },
      default: 'New',
    },
    priority: {
      type: String,
      required: [true, 'Please specify the priority'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    nextFollowUpDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
