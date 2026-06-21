const Opportunity = require('../models/Opportunity');
const mockStore = require('../utils/mockStore');

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private
const getOpportunities = async (req, res) => {
  try {
    if (process.env.RUNNING_MOCK === 'true') {
      const opportunities = await mockStore.getOpportunities();
      return res.json(opportunities);
    }

    const opportunities = await Opportunity.find({})
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Private
const getOpportunityById = async (req, res) => {
  try {
    if (process.env.RUNNING_MOCK === 'true') {
      const opportunity = await mockStore.getOpportunityById(req.params.id);
      if (!opportunity) {
        return res.status(404).json({ message: 'Opportunity not found' });
      }
      return res.json(opportunity);
    }

    const opportunity = await Opportunity.findById(req.params.id).populate('owner', 'name email');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create opportunity
// @route   POST /api/opportunities
// @access  Private
const createOpportunity = async (req, res) => {
  try {
    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirementSummary,
      estimatedDealValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;

    if (
      !customerName ||
      !contactName ||
      !contactEmail ||
      !requirementSummary ||
      !estimatedDealValue
    ) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (process.env.RUNNING_MOCK === 'true') {
      const opportunity = await mockStore.createOpportunity({
        customerName,
        contactName,
        contactEmail,
        contactPhone,
        requirementSummary,
        estimatedDealValue,
        stage,
        priority,
        nextFollowUpDate,
        notes,
      }, req.user._id);
      return res.status(201).json(opportunity);
    }

    const opportunity = await Opportunity.create({
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirementSummary,
      estimatedDealValue,
      stage: stage || 'New',
      priority: priority || 'Medium',
      nextFollowUpDate,
      notes,
      owner: req.user._id, // Set owner from decoded JWT, not request body
    });

    const populatedOpportunity = await Opportunity.findById(opportunity._id).populate('owner', 'name email');
    res.status(201).json(populatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update opportunity (Only owner can update)
// @route   PUT /api/opportunities/:id
// @access  Private
const updateOpportunity = async (req, res) => {
  try {
    if (process.env.RUNNING_MOCK === 'true') {
      try {
        const opportunity = await mockStore.updateOpportunity(req.params.id, req.body, req.user._id);
        if (!opportunity) {
          return res.status(404).json({ message: 'Opportunity not found' });
        }
        return res.json(opportunity);
      } catch (err) {
        if (err.message.includes('Not authorized')) {
          return res.status(403).json({ message: err.message });
        }
        throw err;
      }
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if logged-in user is the owner of the opportunity
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this opportunity' });
    }

    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirementSummary,
      estimatedDealValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;

    opportunity.customerName = customerName || opportunity.customerName;
    opportunity.contactName = contactName || opportunity.contactName;
    opportunity.contactEmail = contactEmail || opportunity.contactEmail;
    opportunity.contactPhone = contactPhone !== undefined ? contactPhone : opportunity.contactPhone;
    opportunity.requirementSummary = requirementSummary || opportunity.requirementSummary;
    opportunity.estimatedDealValue = estimatedDealValue !== undefined ? estimatedDealValue : opportunity.estimatedDealValue;
    opportunity.stage = stage || opportunity.stage;
    opportunity.priority = priority || opportunity.priority;
    opportunity.nextFollowUpDate = nextFollowUpDate !== undefined ? nextFollowUpDate : opportunity.nextFollowUpDate;
    opportunity.notes = notes !== undefined ? notes : opportunity.notes;

    const updatedOpportunity = await opportunity.save();
    const populatedOpportunity = await Opportunity.findById(updatedOpportunity._id).populate('owner', 'name email');

    res.json(populatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete opportunity (Only owner can delete)
// @route   DELETE /api/opportunities/:id
// @access  Private
const deleteOpportunity = async (req, res) => {
  try {
    if (process.env.RUNNING_MOCK === 'true') {
      try {
        const result = await mockStore.deleteOpportunity(req.params.id, req.user._id);
        if (!result) {
          return res.status(404).json({ message: 'Opportunity not found' });
        }
        return res.json(result);
      } catch (err) {
        if (err.message.includes('Not authorized')) {
          return res.status(403).json({ message: err.message });
        }
        throw err;
      }
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if logged-in user is the owner of the opportunity
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
    }

    await opportunity.deleteOne();

    res.json({ id: req.params.id, message: 'Opportunity removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
