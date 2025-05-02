const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  _id: { type: String, required: true },     
  text: { type: String, required: true },
  value: { type: String, default: '' },  
  requires_explanation: { type: Boolean, default: false },     
}, { _id: false });     

const formfieldsSchema = new mongoose.Schema({   
  label: { type: String,default: ''  },
  placeholder: { type: String, default: '' },  
  type: { type: String, default: '' },  
  value:{type:String,default:''},   
  required_validation:{type:Boolean,default:false}
});  

const questionSchema = new mongoose.Schema({
  _id: { type: String, required: true },    
  text: { type: String, required: true },
  question_type: { type: String, required: true ,default:'single' },
  options: [optionSchema],
  form_fields:[formfieldsSchema]
}, { _id: false });

const surveySchema = new mongoose.Schema({
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required:true },
  type: { type: String,  },
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Survey', surveySchema);
