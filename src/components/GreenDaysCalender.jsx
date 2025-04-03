import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function GreenDaysTracker() {
  const [isGreen, setIsGreen] = useState(false);
  const [totalGreenDays, setTotalGreenDays] = useState(0);
  const [consecutiveGreenDays, setConsecutiveGreenDays] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [greenDates, setGreenDates] = useState([]);

  useEffect(() => {
    const storedTotal = localStorage.getItem("totalGreenDays");
    const storedConsecutive = localStorage.getItem("consecutiveGreenDays");
    const storedGreenDates = localStorage.getItem("greenDates");

    if (storedTotal) setTotalGreenDays(parseInt(storedTotal));
    if (storedConsecutive) setConsecutiveGreenDays(parseInt(storedConsecutive));
    if (storedGreenDates) setGreenDates(JSON.parse(storedGreenDates));
  }, []);

  useEffect(() => {
    localStorage.setItem("totalGreenDays", totalGreenDays);
    localStorage.setItem("consecutiveGreenDays", consecutiveGreenDays);
    localStorage.setItem("greenDates", JSON.stringify(greenDates));
  }, [totalGreenDays, consecutiveGreenDays, greenDates]);

  const handleClick = () => {
    if (!isGreen) {
      setTotalGreenDays(totalGreenDays + 1);
      setConsecutiveGreenDays(consecutiveGreenDays + 1);
      setGreenDates([...greenDates, selectedDate.toDateString()]);
    } else {
      setConsecutiveGreenDays(0);
    }
    setIsGreen(!isGreen);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <button
        onClick={handleClick}
        className={`w-32 h-32 text-white font-bold text-xl rounded-full transition-all duration-300 ${
          isGreen ? "bg-green-500" : "bg-gray-500"
        }`}
      >
        {isGreen ? "Green" : "Click Me"}
      </button>
      <div className="mt-4 text-lg font-semibold text-gray-700">
        <p>Total Green Days: {totalGreenDays}</p>
        <p>Consecutive Green Days: {consecutiveGreenDays}</p>
      </div>
      <div className="mt-6">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={({ date }) =>
            greenDates.includes(date.toDateString()) ? "bg-green-300" : ""
          }
        />
      </div>
    </div>
  );
}
