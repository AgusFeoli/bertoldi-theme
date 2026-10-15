import { useEffect, useState } from "react";
import { getTimeLeft } from "../helpers/getTimeLeft";

export const useCountdown = (endDate?: Date) => {

  const [timeLeft, setTimeLeft] = useState<any>();

  useEffect(() => {

    if (!endDate) return;

    const timer = setInterval(() => {

      setTimeLeft(getTimeLeft(endDate));

    }, 1000);

    return () => clearInterval(timer);

  }, [endDate]);

  return timeLeft;
  
};