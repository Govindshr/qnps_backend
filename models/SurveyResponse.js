const mongoose = require('mongoose');
const optionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    text: { type: String, required: true },
    value: { type: String, default: '' },
    requires_explanation: {
      type: mongoose.Schema.Types.Mixed, 
      default: false
    }
       
  }, { _id: false });
  
  const answerOptionSchema = new mongoose.Schema({
    optionId: { type: String, required: true },
    value: { type: String, default: '' },
    answerExplanation:{type:String ,default:''},
  }, { _id: false });
  
  const formfieldsSchema = new mongoose.Schema({   
    label: { type: String,default: ''  },
    placeholder: { type: String, default: '' },  
    type: { type: String, default: '' },  
    value:{type:String,default:''},  
    question_field_id:{type:String,defalut:''},
    required_validation:{type:Boolean,default:false} 
  });

  const answeredQuestionSchema = new mongoose.Schema({
    _id: { type: String, required: true }, 
    text: { type: String, required: true },
    question_type: { type: String, required: true ,default:'single' },
    options: [optionSchema],
    answer: [answerOptionSchema],
    form_fields:[formfieldsSchema]
    
  }, { _id: false });
  
  const surveyResponseSchema = new mongoose.Schema({
    surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
    questions: [answeredQuestionSchema],
    submittedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
  