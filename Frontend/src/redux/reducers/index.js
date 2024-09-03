import { combineReducers } from 'redux';
import studentInfoReducer from './studentInfoReducer';
import testInfoReducer from './testInfoReducer';

const rootReducer = combineReducers({
    studentInfo: studentInfoReducer,
    testInfo: testInfoReducer
});

export default rootReducer;
