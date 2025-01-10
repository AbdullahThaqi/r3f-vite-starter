import { createContext, useContext, useEffect, useState } from "react";

const ConfiguratorContext = createContext();

export const ConfiguratorProvider = ({ children }) => {
  const [gravity, setGravity] = useState(9.81);
  const [planet, setPlanet] = useState('earth');
  const [movementTime, setMovementTime] = useState(0);
  const [movementTime2, setMovementTime2] = useState(0);
  const [radius, setRadius] = useState(6371000);
  useEffect(() => {
    if (planet === 'earth') {
      setGravity(9.81);
      setRadius(6371000);
    } else if (planet === 'moon') {
      setGravity(1.62);
      setRadius(1737000);
    } else if (planet === 'mars') {
      setGravity(3.71);
      setRadius(3390000);
    }
  }, [planet]);

  const [height, setHeight] = useState(0);
  const [vacuum, setVacuum] = useState(false);
  const [startSimulation, setStartSimulation] = useState(false);
  return (
    <ConfiguratorContext.Provider
      value={{
        planet,
        setPlanet,
        gravity,
        setGravity,
        height,
        setHeight,
        vacuum, 
        setVacuum,
        startSimulation,
        setStartSimulation,
        movementTime,
        setMovementTime,
        movementTime2,
        setMovementTime2,
        radius,
        setRadius
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  return useContext(ConfiguratorContext);
};