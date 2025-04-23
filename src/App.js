import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Howl } from "howler";

//media
import clockMP3 from "../src/media/clock.mp3";
import bellMP3 from "../src/media/bell.mp3";
import birdsMP3 from "../src/media/birds.mp3";
//assets
let clockLoop = new Howl({
  src: [clockMP3],
  loop: true,
});
let bellSFX = new Howl({
  src: [bellMP3],
});
let birdsLoop = new Howl({
  src: [birdsMP3],
  loop: true,
});

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeMin, setTimeMin] = useState(25);
  const [timeSec, setTimeSec] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [workInterval, setWorkInterval] = useState(0);
  const [breakInterval, setBreakInterval] = useState(0);
  const [bgColor, setBgColor] = useState("#f7dcda");

  //useEffect
  useEffect(() => {
    if (isRunning) {
      const intervalPom = setInterval(() => {
        //Decrease Seconds
        if (timeSec > 0) {
          setTimeSec((timeSec) => timeSec - 1);
        }
        //Decrease Minutes
        if (timeSec === 0) {
          setTimeMin((timeMin) => timeMin - 1);
          setTimeSec(59);
        }
        //Check if time ends
        if (timeMin === 0 && timeSec === 0) {
          clockLoop.stop();
          bellSFX.play();
          setTimeMin(0);
          setTimeSec(0);
          //Keep track of intervals
          if (!onBreak) {
            if ((breakInterval + 1) % 4 === 0) {
              setWorkInterval((workInterval) => workInterval + 1);
              setBgColor("#daeaf7");
              setTimeMin(30);
              clockLoop.stop();
              birdsLoop.play();
              setOnBreak(true);
            } else {
              setWorkInterval((workInterval) => workInterval + 1);
              setBgColor("#daeaf7");
              setTimeMin(5);
              clockLoop.stop();
              birdsLoop.play();
              setOnBreak(true);
            }
          }
          if (onBreak) {
            setBreakInterval((breakInterval) => breakInterval + 1);
            setBgColor("#f7dcda");
            setTimeMin(25);
            birdsLoop.stop();
            clockLoop.play();
            setOnBreak(false);
          }
        }
      }, 1000);
      return () => clearInterval(intervalPom);
    }
  }, [isRunning, timeMin, timeSec, workInterval, breakInterval, onBreak]);

  //component functions
  const startTimer = () => {
    setIsRunning(true);
    if (onBreak) {
      birdsLoop.play();
    } else {
      clockLoop.play();
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    birdsLoop.pause();
    clockLoop.pause();
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (onBreak) {
      setTimeMin(5);
      birdsLoop.stop();
    } else {
      setTimeMin(25);
      clockLoop.stop();
    }
    setTimeSec(0);
  };

  const reduceTime = () => {
    if (timeMin > 0) {
      setTimeMin((timeMin) => timeMin - 1);
    }
  };

  const increaseTime = () => {
    if (timeMin < 60) {
      setTimeMin((timeMin) => timeMin + 1);
    }
  };

  //rendered JSX
  return (
    <div style={{ height: "100vh", background: bgColor }}>
      <div className="container">
        <div className="d-flex align-items-center flex-column">
          <div className="Lead">
            <h2 className="display-2">Pomodoro Timer</h2>
          </div>
          <div className="Time py-4 my-2">
            <h2 className="display-1 align-self-center">
              {timeMin}:{timeSec < 10 ? "0" + timeSec : timeSec}
            </h2>
            <div className="time-ctrl d-flex justify-content-center flex-row">
              <Button className="mx-1" size="lg" onClick={increaseTime}>
                <h1>+</h1>
              </Button>{" "}
              <Button className="mx-1" size="lg" onClick={reduceTime}>
                <h1>-</h1>
              </Button>{" "}
            </div>
            <div className="time-ctrl d-flex justify-content-center flex-row my-2">
              <h2 className="h2">
                <span>📝 {workInterval} </span>/ 🏖️ {breakInterval}
              </h2>
            </div>
          </div>
        </div>
        <div className="Ctrl py-8 my-2 d-grid gap-2 fixed-bottom">
          <Button variant="primary" size="lg" onClick={startTimer}>
            Start{" "}
          </Button>
          <Button variant="primary" size="lg" onClick={resetTimer}>
            Reset{" "}
          </Button>
          <Button variant="danger" size="lg" onClick={pauseTimer}>
            Pause{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;