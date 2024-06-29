"use client";
import { useState, useEffect } from "react";

const CountdownTimer = ({ answer, quizDetails }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const createdAt = new Date(answer?.created_at || "");
    const diff = now.getTime() - createdAt.getTime(); // time passed

    const limitInMinutes = quizDetails?.timer || 0; // quiz timer in minutes
    const limitInMilliseconds = limitInMinutes * 60 * 1000;

    const remainingMilliseconds = limitInMilliseconds - diff;
    if (remainingMilliseconds <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const remainingSeconds = Math.floor((remainingMilliseconds / 1000) % 60);
    const remainingMinutes = Math.floor(
      (remainingMilliseconds / (1000 * 60)) % 60
    );
    const remainingHours = Math.floor(
      (remainingMilliseconds / (1000 * 60 * 60)) % 24
    );

    return {
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [answer, quizDetails]);

  useEffect(() => {
    const span = document.querySelector('.countdown-hours');
    (span as HTMLElement).style.setProperty('--value', `${(span as HTMLElement).dataset.value}`);
  }, [timeLeft.hours]);

  useEffect(() => {
    const span = document.querySelector('.countdown-minutes');
    (span as HTMLElement).style.setProperty('--value', `${(span as HTMLElement).dataset.value}`);
  }, [timeLeft.minutes]);

  useEffect(() => {
    const span = document.querySelector('.countdown-seconds');
    (span as HTMLElement).style.setProperty('--value', `${(span as HTMLElement).dataset.value}`);
  }, [timeLeft.seconds]);

  return (
    <div className="absolute mt-1 top-[10svh] right-[3svw] md:right-[12svw]">
      <span className="text-md mr-2">Time left:</span>
      <span className="countdown font-mono text-xl">
        <span data-value={timeLeft.hours} className="countdown-hours"></span>:
        <span data-value={timeLeft.minutes} className="countdown-minutes"></span>:
        <span data-value={timeLeft.seconds} className="countdown-seconds"></span>
      </span>
    </div>
  );
  
};

export default CountdownTimer;
