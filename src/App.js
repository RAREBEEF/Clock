import React, { useCallback, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./App.module.scss";
import gsap from "gsap";

export default function App() {
  const [time, setTime] = useState(["00", "00", "00", "0000", "00", "00", "0"]);
  const [show, setShow] = useState("date");
  const [select, setSelect] = useState(3);
  const [alarm, setAlarm] = useState({
    h:
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : new Date().getHours(),
    m:
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : new Date().getMinutes(),
    s: "",
    active: true,
    ring: true,
  });

  const focusRef = useRef();

  React.useEffect(() => {
    const timeUpdate = setInterval(() => {
      const date = new Date();

      setTime([
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds(),
        date.getFullYear(),
        date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
        date.getDay(),
      ]);

      if (alarm.active) {
        if (alarm.h == time[0] && alarm.m == time[1] && alarm.s == time[2]) {
          setAlarm((prevAlarm) => ({ ...prevAlarm, ring: true }));
        }
      }
    }, 100);
    return () => {
      clearInterval(timeUpdate);
    };
  });

  const clickAnimation = useCallback((e) => {
    gsap.to(e.target, 0.1, {
      repeat: 1,
      yoyo: true,
      translateY: "10vmin",
    });
  }, []);

  const rightClick = useCallback(
    (e) => {
      clickAnimation(e);

      setSelect(select === 3 ? 0 : select + 1);

      if (
        (parseInt(alarm.h) >= 24) |
        (parseInt(alarm.m) >= 60) |
        (parseInt(alarm.s) >= 60)
      ) {
        setAlarm((prevAlarm) => ({ ...prevAlarm, h: "", m: "", s: "" }));
      }
    },
    [select, alarm.h, alarm.m, alarm.s, clickAnimation]
  );

  const leftClick = useCallback(
    (e) => {
      clickAnimation(e);

      setSelect(select === 0 ? 3 : select - 1);

      if (
        (parseInt(alarm.h) >= 24) |
        (parseInt(alarm.m) >= 60) |
        (parseInt(alarm.s) >= 60)
      ) {
        setAlarm((prevAlarm) => ({ ...prevAlarm, h: "", m: "", s: "" }));
      }
    },
    [select, alarm.h, alarm.m, alarm.s, clickAnimation]
  );

  const selectClick = useCallback(
    (e) => {
      clickAnimation(e);
      if (select === 3) {
        setAlarm((prevAlarm) => ({ ...prevAlarm, active: !prevAlarm.active }));
      } else {
        focusRef.current.focus();
        select === 0 && setAlarm((prevAlarm) => ({ ...prevAlarm, h: "" }));
        select === 1 && setAlarm((prevAlarm) => ({ ...prevAlarm, m: "" }));
        select === 2 && setAlarm((prevAlarm) => ({ ...prevAlarm, s: "" }));
      }
    },
    [select, clickAnimation]
  );

  const dateClick = useCallback((e) => {
    setShow("date");
  }, []);

  const alarmClick = useCallback(() => {
    setShow("alarm");
  }, []);

  const hourInput = useCallback((e) => {
    if (isNaN(parseInt(e.target.value))) {
      setAlarm((prevAlarm) => ({ ...prevAlarm, h: "" }));
    } else {
      setAlarm((prevAlarm) => ({ ...prevAlarm, h: e.target.value }));
    }
  }, []);

  const minuteInput = useCallback((e) => {
    if (isNaN(parseInt(e.target.value))) {
      setAlarm((prevAlarm) => ({ ...prevAlarm, m: "" }));
    } else {
      setAlarm((prevAlarm) => ({ ...prevAlarm, m: e.target.value }));
    }
  }, []);

  const secondInput = useCallback((e) => {
    if (isNaN(parseInt(e.target.value))) {
      setAlarm((prevAlarm) => ({ ...prevAlarm, s: "" }));
    } else {
      setAlarm((prevAlarm) => ({ ...prevAlarm, s: e.target.value }));
    }
  }, []);

  const stopRinging = useCallback(() => {
    setAlarm((prevAlarm) => ({ ...prevAlarm, ring: false }));
  }, []);

  return (
    <div className={classNames(styles["container"])}>
      <div
        className={classNames(
          styles["btn-wrapper"],
          alarm.ring && styles["ring"]
        )}
      >
        <div
          className={classNames(
            styles["btn"],
            styles["btn--date"],
            show === "date" && styles["active"]
          )}
          onClick={dateClick}
        >
          Date
        </div>
        <div
          className={classNames(
            styles["btn"],
            styles["btn--alarm"],
            show === "alarm" && styles["active"]
          )}
          onClick={alarmClick}
        >
          Alarm
        </div>
        <div
          className={classNames(
            styles["btn"],
            styles["btn--alarm-off"],
            alarm.ring && styles["active"]
          )}
          onClick={stopRinging}
        >
          STOP
        </div>
        <div
          className={classNames(
            styles["btn"],
            styles["btn--left"],
            !(show === "alarm") && styles["active"]
          )}
          onClick={leftClick}
        >
          PREV
        </div>
        <div
          className={classNames(
            styles["btn"],
            styles["btn--select"],
            !(show === "alarm") && styles["active"]
          )}
          onClick={selectClick}
        >
          SELECT
        </div>
        <div
          className={classNames(
            styles["btn"],
            styles["btn--right"],
            !(show === "alarm") && styles["active"]
          )}
          onClick={rightClick}
        >
          NEXT
        </div>
      </div>
      <div
        className={classNames(styles["clock"], alarm.ring && styles["ring"])}
      >
        <div className={classNames(styles["day"])}>
          <div
            className={classNames(
              time[6] === 0 && show === "date" && styles["active"]
            )}
          >
            SUN
          </div>
          <div
            className={classNames(
              time[6] === 1 && show === "date" && styles["active"]
            )}
          >
            MON
          </div>
          <div
            className={classNames(
              time[6] === 2 && show === "date" && styles["active"]
            )}
          >
            TUE
          </div>
          <div
            className={classNames(
              time[6] === 3 && show === "date" && styles["active"]
            )}
          >
            WED
          </div>
          <div
            className={classNames(
              time[6] === 4 && show === "date" && styles["active"]
            )}
          >
            THU
          </div>
          <div
            className={classNames(
              time[6] === 5 && show === "date" && styles["active"]
            )}
          >
            FRI
          </div>
          <div
            className={classNames(
              time[6] === 6 && show === "date" && styles["active"]
            )}
          >
            SAT
          </div>
        </div>
        <div className={classNames(styles["date-time-wrapper"])}>
          <div
            className={classNames(
              styles["date"],
              show === "alarm" && styles["alarm"]
            )}
          >
            <span
              className={classNames(
                styles["toggle-alarm"],
                alarm.active && styles["active"],
                show === "alarm" && select === 3 && styles["select"]
              )}
            >
              ON
            </span>
            {show === "date" && ` ${time[3]} / ${time[4]} / ${time[5]}`}
            {show === "alarm" && " 0000 / 00 / 00"}
          </div>
          {show === "date" ? (
            <div
              className={classNames(
                styles["time"],
                show === "alarm" && styles["active"]
              )}
            >
              {show === "date" && `${time[0]}:${time[1]}:${time[2]}`}
            </div>
          ) : (
            <div className={styles["alarm__timer"]}>
              <input
                className={classNames(select === 0 && styles["select"])}
                type="text"
                placeholder="00"
                maxLength={2}
                ref={select === 0 ? focusRef : null}
                value={alarm.h}
                onChange={hourInput}
              ></input>
              :
              <input
                className={classNames(select === 1 && styles["select"])}
                type="text"
                placeholder="00"
                maxLength={2}
                ref={select === 1 ? focusRef : null}
                value={alarm.m}
                onChange={minuteInput}
              ></input>
              :
              <input
                className={classNames(select === 2 && styles["select"])}
                type="text"
                placeholder="00"
                maxLength={2}
                ref={select === 2 ? focusRef : null}
                value={alarm.s}
                onChange={secondInput}
              ></input>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
