import { useState, useEffect } from "react";

const Clock = () => {
  const [clock, setClock] = useState(new Date().toLocaleString("id"));

  useEffect(() => {
    setInterval(() => {
      setClock(new Date().toLocaleString("id"));
    }, 1000);
  }, [clock]);

  return (
    <div className="clock flex">
      <span>{clock}</span>
    </div>
  );
};

export default Clock;
