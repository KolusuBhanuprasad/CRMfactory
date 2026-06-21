const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this router
router.use(protect);

router.route('/')
  .get(getOpportunities)
  .post(createOpportunity);

router.route('/:id')
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;
