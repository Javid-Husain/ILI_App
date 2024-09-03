import { SET_STUDENT_NAME, SET_TEST_INFO } from './actionTypes';
import { UPDATE_PRETEST_INFO, UPDATE_POSTTEST_INFO, UPDATE_LECTURE_INFO } from './actionTypes';

export const setStudentName = (name) => ({
    type: SET_STUDENT_NAME,
    payload: name
});

export const setTestInfo = (testInfo) => ({
    type: SET_TEST_INFO,
    payload: testInfo
});

export const updatePreTestInfo = (timeTaken, score, questionData) => ({
    type: UPDATE_PRETEST_INFO,
    payload: { timeTaken, score, questionData }
});

export const updatePostTestInfo = (timeTaken, score, questionData) => ({
    type: UPDATE_POSTTEST_INFO,
    payload: { timeTaken, score, questionData }
});

export const updateLectureInfo = (audioTimeTaken, textTimeTaken, timeTaken, audioData, pageAudio1, pageAudio2, pageAudio3, pageAudio4, pageAudio5, pageText1, pageText2, pageText3, pageText4, pageText5) => ({
    type: UPDATE_LECTURE_INFO,
    payload: { audioTimeTaken, textTimeTaken, timeTaken, audioData, pageAudio1,  pageAudio2, pageAudio3, pageAudio4, pageAudio5, pageText1, pageText2, pageText3, pageText4, pageText5}
});

