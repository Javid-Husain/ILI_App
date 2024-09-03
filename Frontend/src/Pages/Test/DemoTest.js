import React, { useState, useEffect, useRef } from 'react';
import BeatLoader from "react-spinners/BeatLoader";

const DemoTest = ({ onCompletion, title }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [showQuestions, setShowQuestions] = useState(false);
    const [startTimes, setStartTimes] = useState([]);
    const [elapsedTimes, setElapsedTimes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const [totalTimeElapsed, setTotalTimeElapsed] = useState(0); // State to track total time elapsed
    const [showLecture, setShowLecture] = useState(false); // State to track if the lecture should be shown

    const questionButtonRef = useRef(null); // Create a ref for the "Question" button

    useEffect(() => {
        handleFetchQuestions();
    }, []);

    const handleFetchQuestions = async () => {
        setLoadingState(true);
        try {
            // Hardcoding questions
            const hardcodedQuestions = [
                {
                    question: "What is the capital of India?",
                    options: ["Mumbai", "New Delhi", "Chennai", "Kolkata", "Next"],
                    correct: "New Delhi"
                },
                {
                    question: "Who is the Prime Minister of India?",
                    options: ["Rahul Gandhi", "Narendra Modi", "Amit Shah", "Manmohan Singh", "Next"],
                    correct: "Narendra Modi"
                }
            ];
            setQuestions(hardcodedQuestions);
            setStartTimes(Array(hardcodedQuestions.length).fill(null));
            setElapsedTimes(Array(hardcodedQuestions.length).fill(0));
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

    useEffect(() => {
        if (questionButtonRef.current) {
            questionButtonRef.current.focus(); // Focus the "Question" button when the question changes
        }
    }, [currentQuestionIndex]);

    const startQuestions = () => {
        setShowQuestions(true);
        const updatedStartTimes = startTimes.map((time, index) =>
            index === currentQuestionIndex ? new Date().getTime() : time
        );
        setStartTimes(updatedStartTimes);
    };

    const finishQuestions = () => {
        const timeTaken = Math.round(totalTimeElapsed / 1000);
        onCompletion(timeTaken, score);
        setShowQuestions(false);
        setShowLecture(true); // Show the lecture after finishing questions
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
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption('');
            const updatedStartTimes = startTimes.map((time, index) =>
                index === currentQuestionIndex - 1 ? new Date().getTime() : time
            );
            setStartTimes(updatedStartTimes);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showQuestions, currentQuestionIndex]);

    return (
        <div className="mx-auto py-4 px-8 relative">
            {loadingState ? 
                <div className='flex justify-center items-center h-screen'>
                    <BeatLoader color={"#123abc"} loading={loadingState} size={15} />
                </div>
            : 
            <div>
                <h2 className="text-2xl font-semibold my-6">{title || 'Demo Test'}</h2>
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
                            Question
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
                        <button
                            id="nextButton"
                            onClick={handleNextQuestion}
                            className="bg-white text-black py-2 px-4 mt-2 border-[1px] border-black rounded hover:bg-gray-400 transition duration-300"
                        >
                            Next
                        </button>
                    </div>
                )}
                {showLecture && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold">Lecture on India</h3>
                        <p className="mt-4">
                            India, located in South Asia, is known for its rich cultural heritage and diverse history. It is the world's most populous democracy and has a rapidly growing economy. The country is famous for its historical landmarks such as the Taj Mahal, vibrant festivals, and varied cuisine. India's landscape ranges from the Himalayan mountains in the north to the coastal regions in the south, offering a wealth of natural beauty and biodiversity.
                        </p>
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

export default DemoTest;
