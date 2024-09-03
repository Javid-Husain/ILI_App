import { UPDATE_PRETEST_INFO, UPDATE_POSTTEST_INFO, UPDATE_LECTURE_INFO } from '../actions/actionTypes';

const initialState = {
    preTest: {
        timeTaken: null,
        score: null,
        questionData: null
    },
    postTest: {
        timeTaken: null,
        score: null,
        questionData: null
    },
    lecture: {
        audioTimeTaken: null,
        textTimeTaken: null,
        timeTaken: null,
        audioData: null,
        pageAudio1: null,  
        pageAudio2: null, 
        pageAudio3: null, 
        pageAudio4: null, 
        pageAudio5: null, 
        pageText1: null, 
        pageText2: null, 
        pageText3: null, 
        pageText4: null,
        pageText5: null
    },
};

const testInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRETEST_INFO:
            return {
                ...state,
                preTest: { ...state.preTest, ...action.payload }
            };
        case UPDATE_POSTTEST_INFO:
            return {
                ...state,
                postTest: { ...state.postTest, ...action.payload }
            };
        case UPDATE_LECTURE_INFO:
            return {
                ...state,
                lecture: { ...state.lecture, ...action.payload }
            };
        default:
            return state;
    }
};

export default testInfoReducer;
