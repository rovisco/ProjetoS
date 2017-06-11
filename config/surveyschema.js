var mongoose = require('mongoose'),
    Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId,
    User = require('./dbschema').userModel;


// survey schema
var surveySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, required: true, default : false },
    _owner : { type: Number, ref: 'User' },
    surveyQuestions : [{ type: Schema.Types.ObjectId, ref: 'SurveyQuestion' }],
    surveySubmits : [{ type: Schema.Types.ObjectId, ref: 'SurveySubmit' }] 
    
});

// survey question schema
var surveyQuestionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String},
    type: { type: String, required: true },
    mandatory: { type: Boolean, required: true, default : false },
    position : { type: Number},
    answerOptions : [{ type: Schema.Types.ObjectId, ref: 'SurveyQuestionOption' }],
    _survey : { type: Number, ref: 'Survey' }
});

// survey question option schema
var surveyQuestionOptionSchema = new Schema({
    text: { type: String, required: true },
    imageUrl: { type: String}, 
    _surveyquestion : { type: Number, ref: 'SurveyQuestion' }

});


// survey submit schema
var surveySubmitSchema = new Schema({
    _user : { type: Number, ref: 'User' },
    submitTime : { type: Date, default : Date.now },   
    complete: { type: Boolean, required: true, default : false },
    location: {
        lat: Number,
        long:  Number
    },
    _survey : { type: Number, ref: 'Survey' },
    answers : [{ type: Schema.Types.ObjectId, ref: 'SurveyAnswer' }]
                  
});


// survey answer schema
var surveyAnswerSchema = new Schema({
    
    _selectedOption : { type: Number, ref: 'SurveyQuestionOption' },
    _surveyQuestion : { type: Number, ref: 'SurveyQuestion' },
    _surveySubmit : { type: Number, ref: 'SurveySubmit' },
    openAnswer: { type: String} 
  
});


// Export models
var surveyModel = mongoose.model('Survey', surveySchema);
var surveyQuestionModel = mongoose.model('SurveyQuestion', surveyQuestionSchema);
var surveyQuestionOptionModel = mongoose.model('SurveyQuestionOption', surveyQuestionOptionSchema);
var surveySubmitModel = mongoose.model('SurveySubmit', surveySubmitSchema);
var surveyAnswerModel = mongoose.model('SurveyAnswer', surveyAnswerSchema);

exports.surveyModel = surveyModel;
exports.surveyQuestionModel = surveyQuestionModel;
exports.surveyQuestionOptionModel = surveyQuestionOptionModel;
exports.surveySubmitModel = surveySubmitModel;
exports.surveyAnswerModel = surveyAnswerModel;