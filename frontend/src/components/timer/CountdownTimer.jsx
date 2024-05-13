import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startDay, endDay }) => {
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function calculateRemainingTime() {
    const currentTime = new Date().getTime();
    const targetTime = new Date(endDay).getTime();
    const timeDifference = targetTime - currentTime;

    if (timeDifference <= 0) {
      // Đã hết thời gian đếm ngược
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds
    };
  }

  return (
    <div className='flex justify-end'>
      <h1>Discount in: {remainingTime.days} Days {remainingTime.hours}:{remainingTime.minutes}:{remainingTime.seconds}</h1>
    </div>
  );
};

export default CountdownTimer;