import { useConfigurator } from './components/Configurator'
import { useState } from 'react'

export default function UI({ }) {
    const { movementTime, height, setHeight, vacuum, setVacuum, setStartSimulation, planet, setPlanet } = useConfigurator();

    const handleInputChange = (e) => {
        const value = e.target.value;

        const numericValue = value.replace(' m', '');

        if (/^\d*\.?\d*$/.test(numericValue)) {
            setHeight(numericValue);
        }
    };

    return (
        <>
            <div className="absolute top-0 left-0 flex flex-col text-white w-full h-full">
                <div className="flex items-center justify-between mt-10 mx-10">
                    <select
                        className="bg-gray-700 border border-gray-600 p-2 rounded"
                        value={planet || "earth"}
                        onChange={(e) => setPlanet(e.target.value)}
                    >
                        <option value="earth">Earth</option>
                        <option value="moon">Moon</option>
                        <option value="mars">Mars</option>
                    </select>
                </div>

                <div className="flex items-center justify-between my-5 mx-10 space-x-2">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={height ? `${height} m` : ''}
                            onChange={handleInputChange}
                            className="bg-gray-700 border border-gray-600 p-2 rounded w-32"
                            placeholder="Enter height"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mx-10">
                    <button
                        className="bg-gray-700 border border-gray-600 p-2 rounded"
                        onClick={() => setVacuum(!vacuum)}
                    >
                        {vacuum ? "Vacuum ON" : "Vacuum OFF"}
                    </button>
                </div>
                <div className="flex items-center justify-between mx-10 mt-5">
                    <button
                        className="bg-green-500 text-white p-2 rounded"
                        onClick={() => setStartSimulation(true)}
                    >
                        Play Simulation
                    </button>
                </div>
                <div className="flex items-center justify-between mx-10 mt-5">
                    <button
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Time: {movementTime.toFixed(2)}
                    </button>
                </div>
            </div>
        </>
    )
}