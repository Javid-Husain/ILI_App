import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateLectureInfo } from "../../redux/actions";
import "./lecture.css"; // Import CSS file

export default function Lecture({ onCompletion }) {
  const [lectureStarted, setLectureStarted] = useState(false);
  // const [speed, setSpeed] = useState(1); // Default speed set to 1x

  const [currentPage, setCurrentPage] = useState(0);
  const [audioTimer, setAudioTimer] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [textTimer, setTextTimer] = useState(0);
  const [paragraphs, setParagraphs] = useState([]);
  const [mode, setMode] = useState("audio"); // State to track the current mode (audio or text)
  const dispatch = useDispatch();
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const playButtonRef = useRef(null);
  const audioRef = useRef(null);
  const nextButtonRef = useRef(null);
  const replayButtonRef = useRef(null);
  const endLectureButtonRef = useRef(null);
  const [audioPlayEvents, setAudioPlayEvents] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pageAudio, setPageAudio] = useState([
    { id: 0, val: 0 },
    { id: 1, val: 0 },
    { id: 2, val: 0 },
    { id: 3, val: 0 },
    { id: 4, val: 0 },
  ]);
  const [pageText, setPageText] = useState([
    { id: 0, val: 0 },
    { id: 1, val: 0 },
    { id: 2, val: 0 },
    { id: 3, val: 0 },
    { id: 4, val: 0 },
  ]);

  const isSpeechSynthesisSupported = 'speechSynthesis' in window;

  useEffect(() => {
    handleFetchParagraphs();
  }, []);
  useEffect(() => {
    console.log(isSpeaking);
  }, [isSpeaking]);
  // useEffect(() => {
  //   console.log(speechSynthesisRef.current.speaking);
  // }, [speechSynthesisRef.current.speaking]);

  useEffect(() => {
    let interval;
    
    if (mode === "audio" && isSpeaking) {
      interval = setInterval(() => {
        setPageAudio((prevPageAudio) =>
          prevPageAudio.map((curAudio) =>
            curAudio.id === currentPage
              ? { ...curAudio, val: curAudio.val + 1000 }
              : curAudio
          )
        );
        setAudioTimer((prev) => prev + 1000);
        setTotalTimer((prev) => prev + 1000);
      }, 1000);
    } else if (mode === "text") {
      interval = setInterval(() => {
        setPageText((prevPageText) =>
          prevPageText.map((curText) =>
            curText.id === currentPage
              ? { ...curText, val: curText.val + 1000 }
              : curText
          )
        );
        setTextTimer((prev) => prev + 1000);
        setTotalTimer((prev) => prev + 1000);
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [mode, isSpeaking, currentPage]);
  

  const handleFetchParagraphs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fetchParagraphs');
      const data = await response.json();
      const listOfParagraphs = data.data.map((item) => ({
        para: item[0]
      }));
      setParagraphs(listOfParagraphs);
    } catch (error) {
      console.error('Failed to fetch Paragraphs:', error);
    }
  };

  const speakText = async (text, speed) => {
    console.log("inSpeakText");
    if (!isSpeechSynthesisSupported) {
      console.error("SpeechSynthesis API is not supported.");
      return;
    }

    if (speechSynthesisRef.current.speaking || speechSynthesisRef.current.paused) {
      speechSynthesisRef.current.cancel();
    }

    const utterance = await new SpeechSynthesisUtterance(text);
    // utterance.rate = speed; // Apply the current speed
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      // setAudioTimer((prev) => prev + text.length * 50); // Approximate speech time
      setIsSpeaking(false);
    };
    utterance.onpause = () => {
      setIsSpeaking(false);
    }
   
      speechSynthesisRef.current.speak(utterance);
    
  };

  const handlePlayButtonClick = () => {
    if (!isSpeechSynthesisSupported) {
      console.error("SpeechSynthesis API is not supported.");
      return;
    }

    const currentText = paragraphs[currentPage]?.para;

    if (isSpeaking) {
      speechSynthesisRef.current.pause();
      console.log("1");
      setIsSpeaking(false);
    } else if (speechSynthesisRef.current.paused) {
      speechSynthesisRef.current.resume();
      console.log("resume");
      setIsSpeaking(true);
    } else {
      console.log("2");
      speakText(currentText);
    }
  };
  // const handleSpeedChange = (newSpeed) => {
  //   setSpeed(newSpeed);
  //   if (speechSynthesisRef.current.speaking || speechSynthesisRef.current.paused) {
  //     speechSynthesisRef.current.cancel(); // Stop the current speech
  //     speakText(paragraphs[currentPage]?.para, newSpeed); // Restart with new speed
  //   }
  // };
  

  const handleReplay = () => {
    if (!isSpeechSynthesisSupported) {
      console.error("SpeechSynthesis API is not supported.");
      return;
    }

    const currentText = paragraphs[currentPage]?.para;

    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }
    speakText(currentText);
  };

  const toggleMode = () => {
    if (mode === "audio") {
      if (speechSynthesisRef.current.speaking) {
        speechSynthesisRef.current.cancel();
      }
    } 
    if(mode === "text"){
      speakText(paragraphs[currentPage]?.para);
    }
    setMode(mode === "audio" ? "text" : "audio");
  };

  const handleNextPage = () => {
    // First, stop the timer for the current paragraph
    if (mode === "audio" && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  
    // Move to the next page
    setCurrentPage((prevPage) => {
      const nextPage = Math.min(prevPage + 1, paragraphs.length - 1);
  
      // Reset or start the timer for the new paragraph
      if (mode === "text") {
        setPageText((prevPageText) =>
          prevPageText.map((curPage) =>
            curPage.id === nextPage ? { ...curPage, val: 0 } : curPage
          )
        );
      } else if (mode === "audio") {
        setPageAudio((prevPageAudio) =>
          prevPageAudio.map((curPage) =>
            curPage.id === nextPage ? { ...curPage, val: 0 } : curPage
          )
        );
        speakText(paragraphs[nextPage]?.para); // Restart audio for the new paragraph
      }
  
      return nextPage;
    });
  };
  

  const handlePreviousPage = () => {
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const startLecture = () => {
    setLectureStarted(true);
    handlePlayButtonClick();
    handlePlayButtonClick();
    // if (mode === "audio") {
    //   const currentText = paragraphs[currentPage]?.para;
    //   handlePlayButtonClick();
    // }
  };

  const startTextLecture = () => {
    setLectureStarted(true);
    setMode("text");
  };

  const endLecture = () => {
    const totalTimeTaken = totalTimer / 1000;

    dispatch(
      updateLectureInfo(
        audioTimer / 1000,
        textTimer / 1000,
        totalTimeTaken,
        audioPlayEvents,
        pageAudio[0].val / 1000,
        pageAudio[1].val / 1000,
        pageAudio[2].val / 1000,
        pageAudio[3].val / 1000,
        pageAudio[4].val / 1000,
        pageText[0].val / 1000,
        pageText[1].val / 1000,
        pageText[2].val / 1000,
        pageText[3].val / 1000,
        pageText[4].val / 1000
      )
    );
    onCompletion(totalTimeTaken);
    setLectureStarted(false);
    setAudioTimer(0);
    setTextTimer(0);
    setTotalTimer(0);

        // Cancel any ongoing speech synthesis
        if (speechSynthesisRef.current.speaking || speechSynthesisRef.current.paused) {
          speechSynthesisRef.current.cancel();
      }
  
      // If you're using an HTML audio element, pause it as well
      if (audioRef.current) {
          audioRef.current.pause();
      }
  };

  return (
    <div className="mx-auto py-4 px-8">
      <h2 className="text-2xl font-semibold">Lecture</h2>
      <div className="mt-4">
        {!lectureStarted ? (
          <div>
            <h3>Please choose your preferred mode to start the lecture:</h3>
            <button
              onClick={startLecture}
              className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300 mr-2"
            >
              Start with Audio
            </button>
            <button
              onClick={startTextLecture}
              className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300"
            >
              Start with Text
            </button>
          </div>
        ) : (
          <div>
            {mode === "audio" ? (
              <div>
                <div className="audio-container">
                  <button
                    ref={playButtonRef}
                    onClick={handlePlayButtonClick}
                    className="play-pause-button"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "5px",
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                      fontSize: "16px",
                      cursor: "pointer",
                      marginRight: "16px"
                    }}
                  >
                    {(!isSpeaking)
                      ? "▶"
                      : "⏸"}
                  </button>
                  <button className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300"
                    ref={replayButtonRef}
                    onClick={handleReplay}
                    aria-label="Replay Audio"
                  >
                    Replay
                  </button>
                  {/* <div className="speed-control mt-2">
                    <label htmlFor="speedSelect">Speed: </label>
                    <select
                    id="speedSelect"

                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    defaultValue={1} // Default value set to 1x speed
                    className="border border-black rounded px-2 py-1"
                    >
                    <option onClick={() => handleSpeedChange(0.5)}>0.5x</option>
                    <option onClick={() => handleSpeedChange(1)}>1x</option>
                    <option onClick={() => handleSpeedChange(1.5)}>1.5x</option>
                    <option onClick={() => handleSpeedChange(2)}>2x</option>

                    </select>

                    </div> */}
                  
                </div>
                
                <div>
                  
                  <div>
                    {pageAudio.map(
                      (curPage) =>
                        curPage.id === currentPage && (
                          <div
                            key={curPage.id} // Add a unique key when iterating over arrays in React
                            style={{
                              position: "absolute",
                              top: "4rem",
                              right: 0,
                              padding: "0.5rem",
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              borderRadius: "0 0 0.25rem 0.25rem",
                            }}
                          >
                            Audio {currentPage+1} Time: {Math.floor(curPage.val / 1000)}s
                          </div>
                        )
                    )}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: "0.5rem",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "0 0 0.25rem 0.25rem",
                    }}
                  >
                    Audio Time: {Math.floor(audioTimer / 1000)}s
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    onClick={toggleMode}
                    className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300"
                  >
                    Text Mode
                  </button>
                </div>
                
              </div>
            ) : (
              <div>
                <button className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300 mt-2">
                  Paragraph - {currentPage + 1}
                </button>
                <br />
                <p>{paragraphs[currentPage]?.para}</p>
                <div className="mt-2">
                  {pageText.map(
                    (curPage) =>
                      curPage.id === currentPage && (
                        <div
                          key={curPage.id} // Add a unique key when iterating over arrays in React
                          style={{
                            position: "absolute",
                            top: "4rem",
                            right: 0,
                            padding: "0.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: "0 0 0.25rem 0.25rem",
                          }}
                        >
                          Paragraph {currentPage+1} Time: {Math.floor(curPage.val / 1000)}s
                        </div>
                      )
                  )}
                  <div
                        className="text-time-container"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          padding: "0.5rem",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "0 0 0.25rem 0.25rem",
                        }}
                      >
                        Text Time: {Math.floor(textTimer / 1000)}s
                  </div>
                  <button
                    onClick={toggleMode}
                    className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300"
                  >
                    Audio Mode
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {lectureStarted && (
        <div className="mt-2">
          {currentPage !== 0 && (
            <button
              onClick={handlePreviousPage}
              className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300 mr-2"
            >
              Back
            </button>
          )}
          {currentPage !== paragraphs.length - 1 && (
            <button
              ref={nextButtonRef}
              onClick={handleNextPage}
              className="bg-white text-black py-2 px-4 rounded hover:bg-gray-400 border-[1px] border-black transition duration-300 mr-5"
            >
              Next
            </button>
          )}
          <button
            ref={endLectureButtonRef}
            onClick={endLecture}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 border-[1px] border-red-700 transition duration-300"
          >
            End Lecture
          </button>
        </div>
      )}
    </div>
  );
}
