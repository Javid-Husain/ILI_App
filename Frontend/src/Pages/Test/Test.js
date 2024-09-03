import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoTest from './DemoTest'
import PreTest from './PreTest';
import Lecture from './Lecture';
import PostTest from './PostTest';
import Navbar from "../Navbar/Navbar";

export default function Test() {
    const [isRecording, setIsRecording] = useState(false);
    const [showPreTest, setShowPreTest] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const videoRef = useRef(null);
    const recordedChunks = useRef([]);
    const dragItem = useRef(null);
    const dragItemPosition = useRef({ x: 0, y: 0 });
    const [currentPhase, setCurrentPhase] = useState('PreTest');
    const [timings, setTimings] = useState({ PreTest: null, Lecture: null, PostTest: null });
    const navigate = useNavigate();

    useEffect(() => {
        const handleDragStart = (e) => {
            dragItemPosition.current = {
                x: dragItem.current.offsetLeft - e.clientX,
                y: dragItem.current.offsetTop - e.clientY,
            };
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleMouseUp);
        };

        const handleDrag = (e) => {
            e.preventDefault();
            dragItem.current.style.left = `${e.clientX + dragItemPosition.current.x}px`;
            dragItem.current.style.top = `${e.clientY + dragItemPosition.current.y}px`;
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        if (dragItem.current) {
            dragItem.current.addEventListener('mousedown', handleDragStart);
        }

        return () => {
            if (dragItem.current) {
                dragItem.current.removeEventListener('mousedown', handleDragStart);
            }
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.muted = true;  // Mute the video element to prevent echo
                videoRef.current.play();
                setIsRecording(true);

                let options = { mimeType: 'video/webm' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.warn(`${options.mimeType} is not supported, using default MIME type.`);
                    delete options.mimeType;
                }

                const recorder = new MediaRecorder(stream, options);
                recorder.ondataavailable = event => {
                    if (event.data && event.data.size > 0) {
                        recordedChunks.current.push(event.data);
                    }
                };

                recorder.onstart = () => {
                    console.log("Recording started");
                };

                recorder.onerror = (event) => {
                    console.error("Recording error:", event.error);
                };

                recorder.start();
                setMediaRecorder(recorder);
                setShowPreTest(true);
            })
            .catch(err => {
                console.error("Error accessing media devices:", err);
            });
    };
    const startDemo = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsRecording(true);
                setCurrentPhase("DemoTest");

                let options = { mimeType: 'video/webm' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.warn(`${options.mimeType} is not supported, using default MIME type.`);
                    delete options.mimeType;
                }

                const recorder = new MediaRecorder(stream, options);
                recorder.ondataavailable = event => {
                    if (event.data && event.data.size > 0) {
                        recordedChunks.current.push(event.data);
                    }
                };

                recorder.onstart = () => {
                    console.log("Recording started");
                };

                recorder.onerror = (event) => {
                    console.error("Recording error:", event.error);
                };

                recorder.start();
                setMediaRecorder(recorder);
                setShowPreTest(true);
            })
            .catch(err => {
                console.error("Error accessing media devices:", err);
            });
    };

    const stopRecording = () => {
        mediaRecorder.stop();
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;

        if(currentPhase !== 'DemoTest') mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks.current, { type: "video/webm" });
            if (blob.size > 0) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "test-recording.webm";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.warn("No data was recorded.");
            }

            setIsRecording(false);
            setMediaRecorder(null);
            recordedChunks.current = [];
            navigate('/results');
        };
        setIsRecording(false);
        setMediaRecorder(null);
    };

    const handlePhaseCompletion = (phase, timeTaken, score = null) => {
        if(phase === 'DemoTest'){
            stopRecording();
            setCurrentPhase('PreTest');
            setShowPreTest(false);
            return;
        }
        setTimings(prev => ({ ...prev, [phase]: { timeTaken, score } }));
        const nextPhase = phase === 'PreTest' ? 'Lecture' : (phase === 'Lecture' ? 'PostTest' : 'Results');
        setCurrentPhase(nextPhase);
        if (nextPhase === 'Results') {
            stopRecording();
        }
    };
    const openLink = () => {
        window.open('https://forms.gle/9mrnrRrHBxqs7tzL9', '_blank');
    };
    

    return (
        <div className="mx-auto min-h-screen">
            <Navbar/>
            <div ref={dragItem} className="absolute cursor-move" style={{ right: '1rem', bottom: '1rem' }}>
                <div className={`w-48 h-32 rounded-lg border border-gray-300 shadow-lg overflow-hidden relative ${!isRecording ? 'bg-black' : ''}`}>
                    <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover"></video>
                    {!isRecording && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                            <span>Not Recording</span>
                        </div>
                    )}
                </div>
            </div>
            {!showPreTest && (
                <div>
                <div className="flex flex-col py-10 px-5">
                    <p className='text-3xl font-bold mb-6'>Welcome to Independent Learning Insights</p>
                    <p className='text-xl pb-2'>Instructions: </p>
                    <p>1. You need to give permission for the webcam and microphone for the test to start. It is required to get the test footage.</p>
                    <p>2. There are 3 Components to this test, Pre Test, Lecture and Post Test.</p>
                    <p>3. After instructions, Pre Test will Begin then Lecture and at last the Post Test. </p>
                    <p>4. In Both Pre Test and Post Test ,there will be 10 question .</p>
                    <p>5. There will be question and  corresponding three options given below , u have to select one of them and after selecting it focus will go to next button .</p>
                    <p>6. To move to next question press enter on the next button u will land on next question . the process will be similar for  both Pre test and Post test.</p>
    
                    <p>7. Lectures is divided into Five parts ,each part has its audio and text mode, u can toggle between the modes .  </p>
                    <p>8. During Audio mode , if u want to switch to their text mode just press  key "b"  then it will take u to the button 'Text mode' for the text mode and then press enter . Hence u will land  in text mode for that lecture part. </p>
                    <p>9. During Text mode , if u want to jump to audio mode then press key "b"  then it will take u to the button 'Audio mode'and hit enter u will land in audio mode for that lecture part  .  </p>
                    <p>10. U can go back to previous lecture during any mode by pressing key "b" then focus will land u to the back button and hit enter   .</p>
                    <p>11. During lecture ,You can play audio by pressing Enter Key and pause it by pressing Enter Key again .  </p>
                    <p>12. Also During lecture ,You can switch between different lecture parts by pressing next button provided there. </p>
                    <p>13. You MUST click on "Save Results" at the end of the test to store the data.</p>
                    <p>14. The test footage will be downloaded in your system.</p>
                </div>
                <div className='userButton'>
                <button
                    onClick={openLink}
                    className="border-[1px] border-black mt-5 mx-5 px-4 py-2 bg-white text-black rounded hover:bg-gray-400 transition duration-300"
                >
                    User Details

                </button>
                </div>

            
                
                {!isRecording && (

                    <button
                        onClick={startDemo}
                        className="border-[1px] border-black mt-5 mx-5 px-4 py-2 bg-white text-black rounded hover:bg-gray-400 transition duration-300"
                    >
                        Demo Test
                </button>
                )}
                <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className="border-[1px] border-black mt-5 mx-5 px-4 py-2 bg-white text-black rounded hover:bg-gray-400 transition duration-300"
                    >
                        {isRecording ? "End Test" : "Begin Test"}
                </button>
                {/* {!isRecording && (
                    <button
                        onClick={startDemo}
                        className="border-[1px] border-black mt-5 mx-5 px-4 py-2 bg-white text-black rounded hover:bg-gray-400 transition duration-300"
                    >
                        Demo Test
                </button>
                )} */}
                </div>
            )}

            {showPreTest && (
                <div>
                    {currentPhase === 'DemoTest' && (
                        <DemoTest onCompletion={(time, score) => handlePhaseCompletion('DemoTest', time, score)} />
                    )}
                    {currentPhase === 'PreTest' && (
                        <PreTest onCompletion={(time, score) => handlePhaseCompletion('PreTest', time, score)} />
                    )}
                    
                    {currentPhase === 'Lecture' && (
                        <Lecture onCompletion={(time) => handlePhaseCompletion('Lecture', time)} />
                    )}
                    {currentPhase === 'PostTest' && (
                        <PostTest onCompletion={(time, score) => handlePhaseCompletion('PostTest', time, score)} />
                    )}
                </div>
            )}
        </div>
    );
}
