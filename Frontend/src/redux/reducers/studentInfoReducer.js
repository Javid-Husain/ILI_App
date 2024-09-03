import { SET_STUDENT_NAME } from '../actions/actionTypes';

const initialState = {
    name: ''
};

const studentInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STUDENT_NAME:
            return { ...state, name: action.payload };
        default:
            return state;
    }
};

export default studentInfoReducer;
