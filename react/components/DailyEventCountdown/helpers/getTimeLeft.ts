// INTERFACES
import { TimeLeft } from "../interfaces"

export const getTimeLeft = (endDate: Date): TimeLeft | null => {
  
  // const diff = endDate - Date.now();
  const diff = endDate.getTime() - Date.now();
  
  if (diff <= 0) {
    return null
  }
  
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const timeLeft: TimeLeft = { days, hours, minutes, seconds };

  return timeLeft;

}
