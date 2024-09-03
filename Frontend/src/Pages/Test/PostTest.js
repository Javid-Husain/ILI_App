import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updatePostTestInfo } from '../../redux/actions'; // Update this import path as per your project structure
import BeatLoader from "react-spinners/BeatLoader";

const PostTest = ({ onCompletion, title }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [showQuestions, setShowQuestions] = useState(false);
    const [startTimes, setStartTimes] = useState([]);
    const [elapsedTimes, setElapsedTimes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [totalTimeElapsed, setTotalTimeElapsed] = useState(0); // State to track total time elapsed
    const [score, setScore] = useState(0);

    const questionButtonRef = useRef(null); // Create a ref for the "Question" button
    const dispatch = useDispatch();

    useEffect(() => {
        handleFetchQuestions();
    }, []);

    const handleFetchQuestions = async () => {
        setLoadingState(true);
        try {
            const response = await fetch('http://localhost:5000/api/fetchQuestions');
            const data = await response.json();
            const listOfQuestions = data.data.map((item) => ({
                question: item[0],
                options: item[1].split(',').concat('Next'),
                correct: item[2]
            }));
            setQuestions(listOfQuestions);
            setStartTimes(Array(listOfQuestions.length).fill(null));
            setElapsedTimes(Array(listOfQuestions.length).fill(0));
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoadingState(false);
        }
    };

    useEffect(() => {
        let interval;
        if (showQuestions) {
            interval = setInterval(() => {
                setElapsedTimes((prevElapsedTimes) => {
                    const updatedElapsedTimes = prevElapsedTimes.map((time, index) =>
                        currentQuestionIndex === index ? time + 1000 : time
                    );
                    const total = updatedElapsedTimes.reduce((acc, cur) => acc + cur, 0);
                    setTotalTimeElapsed(total);
                    return updatedElapsedTimes;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showQuestions, currentQuestionIndex]);

    const startQuestions = () => {
        setShowQuestions(true);
        const updatedStartTimes = startTimes.map((time, index) =>
            index === currentQuestionIndex ? new Date().getTime() : time
        );
        setStartTimes(updatedStartTimes);
    };

    const finishQuestions = () => {
        // Calculate total time taken
        const timeTaken = Math.round(totalTimeElapsed / 1000); // Convert to seconds and round off
        // Dispatch total time elapsed along with other data
        dispatch(updatePostTestInfo(timeTaken, score, generateTextContent()));
        // Invoke the completion callback
        onCompletion(timeTaken, score);
        setShowQuestions(false);
    };

    const generateTextContent = () => {
        return questions.map((question, index) =>
            `Question ${index + 1}: ${formatTime(elapsedTimes[index])}||`
        ).join('');
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (selectedOption === questions[currentQuestionIndex].correct) {
            setScore((prevScore) => prevScore + 1);
        }
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption('');
            const updatedStartTimes = startTimes.map((time, index) =>
                index === nextIndex ? new Date().getTime() : time
            );
            setStartTimes(updatedStartTimes);
        } else {
            finishQuestions();
        }
    };

    const handlePreviousQuestion = () => {
        const prevIndex = currentQuestionIndex - 1;
        if (prevIndex >= 0) {
            setCurrentQuestionIndex(prevIndex);
            setSelectedOption('');
            const updatedStartTimes = startTimes.map((time, index) =>
                index === prevIndex ? new Date().getTime() : time
            );
            setStartTimes(updatedStartTimes);
        }
    };

    const handleOptionSelect = (option) => {
        if (option === "Next") {
            handleNextQuestion();
        } else {
            setSelectedOption(option);
            const nextButton = document.getElementById("nextButton");
            if (nextButton) {
                nextButton.focus();
            }
        }
    };

    const formatTime = (time) => {
        const seconds = Math.floor(time / 1000) % 60;
        const minutes = Math.floor(time / 60000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Tab' && showQuestions) {
            event.preventDefault();
            handleNextQuestion();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            handleNextQuestion();
        } else if (event.key === 'ArrowLeft' && currentQuestionIndex > 0) {
            event.preventDefault();
            handlePreviousQuestion();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showQuestions, currentQuestionIndex]);

    useEffect(() => {
        if (questionButtonRef.current) {
            questionButtonRef.current.focus(); // Focus the "Question" button when the question changes
        }
    }, [currentQuestionIndex]);

    return (
        <div className="mx-auto py-4 px-8 relative">
            {loadingState ? 
                <div className='flex justify-center items-center h-screen'>
                    <BeatLoader color={"#123abc"} loading={loadingState} size={15} />
                </div>
            : 
            <div>
                <h2 className="text-2xl font-semibold my-6">{title || 'Post Test'}</h2>
                {!showQuestions ? (
                    <button
                        onClick={startQuestions}
                        className="bg-white text-black py-2 px-4 mt-2 border-[1px] border-black rounded hover:bg-gray-400 transition duration-300"
                    >
                        Start Questions
                    </button>
                ) : (
                    <div className="mb-8">
                        {/* Button named "Question" */}
                        <button
                            ref={questionButtonRef}
                            className="bg-gray-200 text-black py-2 px-4 mt-2 border-[1px] border-black rounded"
                        >
                            Question {currentQuestionIndex + 1}
                        </button>
                        <p className="font-semibold text-lg mb-2">{questions[currentQuestionIndex].question}</p>
                        <div className="flex flex-col">
                            {questions[currentQuestionIndex].options.map((option, idx) => (
                                <label key={idx} className="inline-flex items-center mt-2">
                                    {option === "Next" ? (
                                        null
                                    ) : (
                                        <>
                                            <input
                                                type="checkbox"
                                                name="selectedOption"
                                                value={option}
                                                onChange={() => handleOptionSelect(option)}
                                                checked={selectedOption === option}
                                                className="form-checkbox h-6 w-6 text-blue-600"
                                            />
                                            <span className="ml-2">{option}</span>
                                        </>
                                    )}
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                                {/* Previous button */}
                                {currentQuestionIndex > 0 && (
                                    <button
                                        onClick={handlePreviousQuestion}
                                        className="bg-white text-black py-2 px-4 border-[1px] border-black rounded hover:bg-gray-400 transition duration-300"
                                        style={{ marginRight: '8px' }} // Adding margin-right for space
                                    >
                                        Previous
                                    </button>
                                )}
                                {/* Next button */}
                            <button
                                id="nextButton"
                                onClick={handleNextQuestion}
                                className="bg-white text-black py-2 px-4 border-[1px] border-black rounded hover:bg-gray-400 transition duration-300"
                                style={{ marginRight: '8px' }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
            }
            <div className="absolute top-0 right-0 mt-4 mr-4">
                <p className="text-gray-600">Time Elapsed: {formatTime(elapsedTimes[currentQuestionIndex])}</p>
            </div>
        </div>
    );
};

export default PostTest;
