import React, { useState, useEffect, useRef } from "react";
import beepAudio from "/beep.mp3";
import useSound from "use-sound";
import { FaMinus, FaPlus } from "react-icons/fa";
import "./App.css";
function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerType, setTimerType] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalID, setIntervalID] = useState(null);
  const [isDangerZone, setIsDangerZone] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);
  const audioRef = useRef(null);
  const [playSound, { stop }] = useSound(beepAudio);

  // Format time in "mm:ss" format

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle clicking on the start/stop button
  const handleStartStopClick = () => {
    if (!isInteracted) {
      setIsInteracted(true);
    }
    if (isRunning) {
      clearInterval(intervalID);
      setIsRunning(false);
      if (stop) {
        stop();
      }
    } else {
      const newIntervalID = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            if (timerType === "Session") {
              setTimerType("Break");
              return breakLength * 60;
            } else {
              setTimerType("Session");
              return sessionLength * 60;
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
      setIntervalID(newIntervalID);
      setIsRunning(true);
    }
  };

  // Handle clicking on the reset button
  const handleResetClick = () => {
    if (!isInteracted) {
      setIsInteracted(true);
    }
    if (isRunning) {
      clearInterval(intervalID);
      setIsRunning(false);
    }

    if (stop) {
      stop();
    }

    setBreakLength(5);
    setSessionLength(25);
    setTimerType("Session");
    setTimeLeft(25 * 60);
  };

  // Handle clicking on the increment and decrement buttons
  const handleIncrement = (type) => {
    if (!isInteracted) {
      setIsInteracted(true);
    }
    if (!isRunning) {
      if (type === "break" && breakLength < 60) {
        setBreakLength(breakLength + 1);
      } else if (type === "session" && sessionLength < 60) {
        setSessionLength(sessionLength + 1);
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const handleDecrement = (type) => {
    if (!isInteracted) {
      setIsInteracted(true);
    }
    if (!isRunning) {
      if (type === "break" && breakLength > 1) {
        setBreakLength(breakLength - 1);
      } else if (type === "session" && sessionLength > 1) {
        setSessionLength(sessionLength - 1);
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 15) {
      setIsDangerZone(true);
    }
    if (timeLeft === 3) {
      if (playSound) {
        playSound();
      }
    }
    if (timeLeft === 0) {
      if (timerType === "Session") {
        setIsDangerZone(false);
        setTimerType("Break");
        setTimeLeft(breakLength * 60);
      } else {
        setTimerType("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
  }, [timeLeft, timerType, sessionLength, breakLength]);

  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <div className="labels">
        <div id="break-label" className="break-label">
          <p>Break Length</p>
          <div>
            <button
              id="break-decrement"
              onClick={() => handleDecrement("break")}
            >
              <FaMinus />
            </button>
            <div id="break-length" className="break-length">
              <span>{breakLength}</span>
            </div>
            <button
              id="break-increment"
              onClick={() => handleIncrement("break")}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div id="session-label" className="session-label">
          <p>Session Length</p>
          <div>
            <button
              id="session-decrement"
              onClick={() => handleDecrement("session")}
            >
              <FaMinus />
            </button>
            <div className="session-length">
              <span id="session-length">{sessionLength}</span>
            </div>
            <button
              id="session-increment"
              onClick={() => handleIncrement("session")}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
      <div className="timer">
        <div id="timer-label">
          <p>{timerType}</p>
        </div>
        <div id="time-left">
          <p className={isDangerZone ? "heart-beat" : ""}>
            {formatTime(timeLeft)}
          </p>
        </div>
        <div className="buttons-div">
          <button id="start_stop" onClick={handleStartStopClick}>
            <span>Start/Stop</span>
          </button>
          <button id="reset" onClick={handleResetClick}>
            <span>Reset</span>
          </button>
        </div>
        {isInteracted && (
          <audio
            id="beep"
            controls
            ref={audioRef}
            src={beepAudio}
            type="audio/mpeg"
            preload="auto"
          ></audio>
        )}
      </div>
    </div>
  );
}

export default App;
