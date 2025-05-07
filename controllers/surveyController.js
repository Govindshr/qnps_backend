const Survey = require('../models/Survey');
const SurveyResponse = require('../models/SurveyResponse'); // ✅ new import

const createSurvey = async (req, res) => {
  const { questions  , createdBy ,name ,type } = req.body;

  if (!questions || !Array.isArray(questions) || questions.length === 0 || !name ) {
    return res.status(400).json({ message: 'Questions array is required.' });
  }

  try {
    const cleanQuestions = questions.map(q => ({
        _id: q._id,
        text: q.text,
        question_type: q.question_type,
        options: q?.options?.map(opt => ({
          _id: opt._id,
          text: opt.text,
          value: opt.value || '',
          requires_explanation: typeof opt.requires_explanation === 'object'
            ? {
                type: opt.requires_explanation.type || 'text',
                required: !!opt.requires_explanation.required,
                placeholder:opt.requires_explanation.placeholder || '',
                minLength: opt.requires_explanation.minLength ?? undefined,
                maxLength: opt.requires_explanation.maxLength ?? undefined
              }
            : false
        })),
        
        form_fields: q?.form_fields?.map(fil => ({
          label: fil.label || '',
          placeholder: fil.placeholder || '',
          type:fil.type || '',
          value:'',
          required_validation:fil.required_validation || false,
         
        })),

      }));
      
      const survey = new Survey({ questions: cleanQuestions, createdBy ,name ,type });

    await survey.save();

    res.status(201).json({
      status: 201,
      error: false,
      message: 'Survey created successfully',
      data: survey
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 500,
      error: true,
      message: 'Failed to create survey',
      data: null
    });
  }
};



const getAllSurveys = async (req, res) => {
    const { createdBy, page = 1, limit = 10 } = req.body;
  
    try {
      const filter = {};
      if (createdBy) {
        filter.createdBy = createdBy; // should be a valid ObjectId string
      }
      
    
   
      const skip = (parseInt(page) - 1) * parseInt(limit);
  
      const totalSurveys = await Survey.countDocuments(filter);
      
      const surveys = await Survey.find(filter)
        .skip(skip)
        .limit(limit)
        .populate("createdBy", ["name","_id"])

      res.status(200).json({
        status: 200,
        error: false,
        message: "Surveys fetched successfully",
        total: totalSurveys,
        page: parseInt(page),
        limit: parseInt(limit),
        data: surveys,
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({
        status: 500,
        error: true,
        message: "Failed to fetch Surveys",
        data: [],
      });
    }
  };

  const getSurveyById = async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res
        .status(400)
        .json({ message: "Survey ID is required in request body" });
    }
  
    try {
      const surveys = await Survey.findById(id)
        .populate("createdBy", ["name","_id"])
        
  
      if (!surveys) {
        return res.status(404).json({ message: "Survey not found" });
      }
  
      const surveyToReturn = {
        ...surveys._doc,
      };
  
     
      res.status(200).json({
        status: 200,
        error: false,
        message: "Survey Details fetched successfully",
        data: surveyToReturn,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: true,
        message: "Failed to fetch Survey",
        data: null,
      });
    }
  };

  const deleteSurveyById = async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ message: "Survey ID is required in request body" });
    }
  
    try {
      const deletedSurvey = await Survey.findByIdAndDelete(id);
  
      if (!deletedSurvey) {
        return res.status(404).json({ message: "Survey not found or already deleted" });
      }
  
      res.status(200).json({
        status: 200,
        error: false,
        message: "Survey deleted successfully",
        data: {
          id: deletedSurvey._id,
          title: deletedSurvey.title || null // optional if title exists
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: true,
        message: "Failed to delete survey",
        data: null
      });
    }
  };
  

  const submitSurveyResponse = async (req, res) => {
    const { surveyId, questions } = req.body;
  
    if (!surveyId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'surveyId and questions are required.' });
    }
  
    try {
      const response = new SurveyResponse({
        surveyId,
        questions: questions.map(q => ({
          _id: q._id,
          text: q.text,
          question_type:q.question_type,
          options: q?.options?.map(opt => ({
            _id: opt._id,
            text: opt.text,
            value: opt.value || '',
            requires_explanation:
              typeof opt.requires_explanation === 'object'
                ? {
                    type: opt.requires_explanation.type || 'text',
                    required: !!opt.requires_explanation.required
                  }
                : false
          })),          
          answer: q.answer.map(a => ({
            optionId: a.optionId,
            value: a.value,
            answerExplanation:a.answerExplanation || '',
          })),
          form_fields: q?.form_fields?.map(fil => ({
            label: fil.label || '',
            placeholder: fil.placeholder || '',
            type:fil.type || '',
            value:fil.value || '',
            question_field_id: fil.question_field_id || '',
            required_validation:fil.required_validation || false,
           
          })),
  
        })),
        submittedAt: new Date()
      });
  
      await response.save();
  
      res.status(200).json({
        status: 200,
        error: false,
        message: 'Survey response submitted successfully',
        data: response
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({
        status: 500,
        error: true,
        message: 'Failed to submit survey response',
        data: null
      });
    }
  };
  
  

module.exports = { createSurvey , getAllSurveys , getSurveyById ,deleteSurveyById, submitSurveyResponse};
