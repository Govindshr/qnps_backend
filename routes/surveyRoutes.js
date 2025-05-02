const express = require('express');
const router = express.Router();
const { createSurvey , getAllSurveys  , getSurveyById ,deleteSurveyById, submitSurveyResponse} = require('../controllers/surveyController');

router.post('/createSurvey', createSurvey);
router.post('/getAllSurveys', getAllSurveys);
router.post('/getSurveyById',getSurveyById);
router.post('/deleteSurveyById',deleteSurveyById);
router.post('/submitSurveyResponse',submitSurveyResponse);

module.exports = router;
