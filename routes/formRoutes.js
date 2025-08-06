

const express = require('express');
const router = express.Router();
const formSubmissionSchema = require('../controllers/formController');


router.post('/:panel',formSubmissionSchema.createFormSubmission);


module.exports = router;

