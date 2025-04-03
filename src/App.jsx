import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function GreenDaysTracker() {
  const [totalGreenDays, setTotalGreenDays] = useState(0);
  const [consecutiveGreenDays, setConsecutiveGreenDays] = useState(0);
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

  const handleDateClick = (date) => {
    const dateString = date.toDateString();
    let updatedGreenDates = [...greenDates];

    if (!greenDates.includes(dateString)) {
      updatedGreenDates.push(dateString);
      setTotalGreenDays(totalGreenDays + 1);
    } else {
      updatedGreenDates = updatedGreenDates.filter((d) => d !== dateString);
      setTotalGreenDays(totalGreenDays - 1);
    }
    setGreenDates(updatedGreenDates);
    calculateConsecutiveDays(updatedGreenDates);
  };

  const calculateConsecutiveDays = (dates) => {
    const sortedDates = dates
      .map((date) => new Date(date))
      .sort((a, b) => a - b);
    let maxStreak = 0,
      currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diff =
        (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }
    setConsecutiveGreenDays(maxStreak);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 to-green-300 p-6 rounded-lg shadow-lg">
      <div className="mt-4 text-xl font-semibold text-gray-800 bg-white p-4 rounded-lg shadow-md w-full max-w-md text-center">
        <p className="text-green-700">
          Total Green Days: <span className="font-bold">{totalGreenDays}</span>
        </p>
        <p className="text-green-700">
          Consecutive Green Days:{" "}
          <span className="font-bold">{consecutiveGreenDays}</span>
        </p>
      </div>
      <div
        className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-md relative"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/600x400/?nature,green')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={({ date }) =>
            greenDates.includes(date.toDateString()) ? "highlight" : ""
          }
        />
      </div>
      <style>
        {`.highlight { background-color: #34D399 !important; color: white !important; border-radius: 50%; font-weight: bold; }`}
      </style>
    </div>
  );
}
