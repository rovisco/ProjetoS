#Survey Schema
_________________
OBJECTS

##Survey

*name
*description
*status - Active or Inactive
*owner - User than owns the survey
*surveyQuestions - List of _SurveyQuestion_
*surveySubmits - List of _SurveySubmits_ fo this survey

##SurveyQuestion
*title - Title of the question
*description - Description for the question
*type - Type of question
*mandatory - True or False
*position - Order in the survey
*possibleOptions - List of _SurveyQuestionOptions_ List of possible values to answer.Used for specific question types
*survey - survey the question belongs to

##SurveyQuestionOption
*text
*image
*surveyQuestion - survey question the options belongs to

##SurveySubmit
*user - user submitting the survey
*time - Date an hour of submit
*complete - true or false
*lat - geographic coordinates - latitude
*lng - geographic coordinates -longitude
*answers - List of _SurveyAnswer_
*survey - _Survey_ this submission belongs to

##SurveyAnswer
*surveySubmit - _SurveySubmit_ the answer belongs to 
*surveyQuestion - _SurveySubmit_ being answered
*selectedOption - _SurveyQuestionOption_ selected 
*openAnswer - Text with answer, in case of open question.


