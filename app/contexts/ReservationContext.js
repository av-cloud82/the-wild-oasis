"use client";

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

function ReservationProvider({ children }) {
  // Состояние пикера
  const [range, setRange] = useState({ from: undefined, to: undefined });
  // Кнопка Clear
  const resetRange = () => setRange({ from: undefined, to: undefined });

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (context === undefined)
    throw Error("Context was used ourside context provider");

  return context;
}

export { useReservation, ReservationProvider };
