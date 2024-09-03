import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Navbar from "../Navbar/Navbar";
import BeatLoader from 'react-spinners/BeatLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Results() {
    const navigate = useNavigate();
    const studentInfo = useSelector(state => state.studentInfo);
    const preTestInfo = useSelector(state => state.testInfo.preTest);
    const lectureInfo = useSelector(state => state.testInfo.lecture);
    const postTestInfo = useSelector(state => state.testInfo.postTest);
    const [chart, setChart] = useState(null);
    const [loading, setLoading] = useState(false);
    const audioData = lectureInfo.audioData;

    useEffect(() => {
        if (!audioData || audioData.length === 0) return;

        const canvas1 = document.getElementById('audio-chart1');
        const canvas2 = document.getElementById('audio-chart2');

        if (canvas1 && canvas2) {
            const ctx1 = canvas1.getContext('2d');
            const ctx2 = canvas2.getContext('2d');

            var playVals = audioData.filter(item => item.split('-')[0].includes('play'));
            var pauseVals = audioData.filter(item => item.split('-')[0].includes('pause'));

            const sliderData1 = playVals.map(item => parseInt(item.split('-')[1]));
            const dataPoints1 = sliderData1.map((value, index) => ({ x: index, y: value }));

            const sliderData2 = pauseVals.map(item => parseInt(item.split('-')[1]));
            const dataPoints2 = sliderData2.map((value, index) => ({ x: index, y: value }));

            const lineChart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Time',
                        data: dataPoints1,
                        borderColor: 'black',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Instance'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Timestamp in Audio (s)'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            enabled: false
                        }
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                    legend: {
                        display: true,
                    }
                }
            });

            const lineChart2 = new Chart(ctx2, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Time',
                        data: dataPoints2,
                        borderColor: 'black',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Instance'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Timestamp in Audio (s)'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            enabled: false
                        }
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                    legend: {
                        display: true,
                    }
                }
            });
        } else {
            console.error('Canvas elements not found');
        }
    }, [audioData]);

    const formatTime = (seconds) => {
        if (seconds === undefined || seconds === null) {
            return 'N/A';
        }
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min} min ${sec} sec`;
    };

    const [heartRateData, setHeartRateData] = useState({
        'Before Pre Test': { amount: '', display: false },
        // 'Pre Test': { amount: '', display: false },
        'After Pre Test': { amount: '', display: false },
        'Before Lecture': { amount: '', display: false },
        'After Lecture': { amount: '', display: false },
        'Before Post Test': { amount: '', display: false },

        
        'After Post Test': { amount: '', display: false },
    });

    const handleSubmit = (type) => {
        setHeartRateData({
            ...heartRateData,
            [type]: { ...heartRateData[type], display: true },
        });
    };

    const navigateHome = () => {
        navigate('/');
    };

    const handleSaveResults = () => {  
        setLoading(true);
        console.log(loading);
        var rawAudioData = '';
        for (var i in lectureInfo.audioData) {
            rawAudioData += `|${lectureInfo.audioData[i]}|`;
        }
        const data = {
            studentInfo: studentInfo, 
            preTestInfo: preTestInfo, 
            lectureInfo: lectureInfo, 
            postTestInfo: postTestInfo, 
            beforePreTestHeart: heartRateData["Before Pre Test"]["amount"],
            // preTestHeart: heartRateData["Pre Test"]["amount"], 
            afterPreTestHeart: heartRateData["After Pre Test"]["amount"],
            beforeLectureHeart: heartRateData["Before Lecture"]["amount"],
            afterLectureHeart: heartRateData["After Lecture"]["amount"],
            beforePostTestHeart: heartRateData["Before Post Test"]["amount"],
            // postTestHeart: heartRateData["Post Test"]["amount"],
            afterPostTestHeart: heartRateData["After Post Test"]["amount"],
            audioRawData: rawAudioData,
            audioTimes: [
                lectureInfo?.pageAudio1,
                lectureInfo?.pageAudio2,
                lectureInfo?.pageAudio3,
                lectureInfo?.pageAudio4,
                lectureInfo?.pageAudio5
            ],
            textTimes: [
                lectureInfo?.pageText1,
                lectureInfo?.pageText2,
                lectureInfo?.pageText3,
                lectureInfo?.pageText4,
                lectureInfo?.pageText5
            ]
        };
        fetch('http://localhost:5000/api/addToSheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            toast.success("Results have been saved successfully!");
        })
        .catch((error) => {
            console.error('Error:', error);
            toast.error("An error occurred while saving the results.");
        });
        setLoading(false);
    };

    return (
        <div>
            <Navbar/>
            <ToastContainer />
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <BeatLoader color={"#123abc"} loading={loading} size={15} />
                </div>
            ) : (
                <div className='py-4 px-8'>
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold">Test Results</h1>
                        <p className="text-xl mt-2">Student: {studentInfo?.name || 'N/A'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Timings</h2>
                            <ul className="list-disc list-inside">
                                <li className="text-lg mb-2">PreTest Time: {formatTime(preTestInfo?.timeTaken)}</li>
                                <li className="text-lg mb-2">Lecture Time: {formatTime(lectureInfo?.timeTaken)}</li>
                                <li className="text-lg mb-2">Lecture Audio Time: {formatTime(lectureInfo?.audioTimeTaken)}</li>
                                <li className="text-lg mb-2">Lecture Text Time: {formatTime(lectureInfo?.textTimeTaken)}</li>
                                <li className="text-lg">PostTest Time: {formatTime(postTestInfo?.timeTaken)}</li>
                            </ul>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Scores</h2>
                            <ul className="list-disc list-inside">
                                <li className="text-lg mb-2">PreTest Score: {preTestInfo.score !== null ? `${preTestInfo.score}/10` : 'N/A'}</li>
                                <li className="text-lg">PostTest Score: {postTestInfo.score !== null ? `${postTestInfo.score}/10` : 'N/A'}</li>
                            </ul>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Audio Timings</h2>
                            <ul className="list-disc list-inside">
                                <li className="text-lg mb-2">Audio 1 Time: {formatTime(lectureInfo?.pageAudio1)}</li>
                                <li className="text-lg mb-2">Audio 2 Time: {formatTime(lectureInfo?.pageAudio2)}</li>
                                <li className="text-lg mb-2">Audio 3 Time: {formatTime(lectureInfo?.pageAudio3)}</li>
                                <li className="text-lg mb-2">Audio 4 Time: {formatTime(lectureInfo?.pageAudio4)}</li>
                                <li className="text-lg mb-2">Audio 5 Time: {formatTime(lectureInfo?.pageAudio5)}</li>
                            </ul>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Text Timings</h2>
                            <ul className="list-disc list-inside">
                                <li className="text-lg mb-2">Paragraph 1 Time: {formatTime(lectureInfo?.pageText1)}</li>
                                <li className="text-lg mb-2">Paragraph 2 Time: {formatTime(lectureInfo?.pageText2)}</li>
                                <li className="text-lg mb-2">Paragraph 3 Time: {formatTime(lectureInfo?.pageText3)}</li>
                                <li className="text-lg mb-2">Paragraph 4 Time: {formatTime(lectureInfo?.pageText4)}</li>
                                <li className="text-lg mb-2">Paragraph 5 Time: {formatTime(lectureInfo?.pageText5)}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Heart Rate Monitor</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(heartRateData).map((type, index) => (
                                <div key={index} className="flex gap-5 bg-white shadow-lg rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-2 pt-1">{type} -</h3>
                                    {heartRateData[type].display ? (
                                        <p className="text-lg pt-1">{heartRateData[type].amount} BPM</p>
                                    ) : (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmit(type);
                                            }}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="text"
                                                value={heartRateData[type].amount}
                                                onChange={(e) =>
                                                    setHeartRateData({
                                                        ...heartRateData,
                                                        [type]: { ...heartRateData[type], amount: e.target.value },
                                                    })
                                                }
                                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                                            />
                                            <button
                                                type="submit"
                                                className="ml-4 bg-white text-black py-2 px-4 border-[1px] border-black rounded hover:bg-gray-400 transition duration-300"
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-5">
                        <button
                            onClick={handleSaveResults}
                            className="bg-white text-black py-2 px-4 mt-2 border-[1px] border-black rounded hover:bg-gray-400 transition duration-300"
                        >
                            Save Results
                        </button>
                        <button
                            onClick={navigateHome}
                            className="bg-white text-black py-2 px-4 mt-2 border-[1px] border-black rounded hover:bg-gray-400 transition duration-300"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
