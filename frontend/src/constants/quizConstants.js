/* Qusetion Set constants used in in the question set reducer*/
export const QUIZ_QUESTION_SET_REQUEST = 'QUIZ_QUESTION_SET_REQUEST';
export const QUIZ_QUESTION_SET_SUCCESS = 'QUIZ_QUESTION_SET_SUCCESS';
export const QUIZ_QUESTION_SET_FAIL = 'QUIZ_QUESTION_SET_FAIL';

/* User Quiz Answers Constants for use in the user quiz answer reducer */
export const USER_ANSWER_CHANGE = 'USER_ANSWER_CHANGE';
export const USER_ANSWER_RESET = 'USER_ANSWER_RESET';

/* Constant that holds all the personality factors that are used in determining personality type*/
export const PERSONALITY_FACTORS = [
  'extraversion',
  'sensing',
  'thinking',
  'perceiving',
];

/* Constants for use in the quiz response action*/
export const QUIZ_SEND_RESULTS_REQUEST = 'QUIZ_SEND_RESULTS_REQUEST';
export const QUIZ_SEND_RESULTS_SUCCESS = 'QUIZ_SEND_RESULTS_SUCCESS';
export const QUIZ_SEND_RESULTS_FAIL = 'QUIZ_SEND_RESULTS_FAIL';

/* The allowed question answer values for user in the test */
export const ALLOWED_USER_ANSWER_VALUES = ['2', '1', '0', '-1', '-2'];
