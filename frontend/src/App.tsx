import React, { useState } from "react";
import axios from "axios";
import CanvasComponent from "./CanvasComponent";
import Footer from "./Footer";
import DataFetcher from "./DataFetcher";

const sensorNames = [
  "Joystick X",
  "Joystick Y",
  "Light",
  "Temperature",
  "Slider",
  "Microphone",
  "Accel X",
  "Accel Y",
  "Accel Z",
  "Button 1",
  "Button 2",
  "Button 3",
  "Button 4",
];

const App: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/serial-data");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const parsedData = data ? data.split(",") : [];
  const joystickX = parsedData.length > 0 ? parseInt(parsedData[0], 10) : 0;
  const joystickY = parsedData.length > 1 ? parseInt(parsedData[1], 10) : 0;
  const slider = parsedData.length > 4 ? parseInt(parsedData[4], 10) : 0;
  const light = parsedData.length > 2 ? parseInt(parsedData[2], 10) : 0;

  return (
    <div className="container mx-auto max-w-3xl p-4 mt-8">
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          {parsedData.length > 0 && (
            <div>
              {parsedData.map((value, index) => (
                <div key={index} className="mb-2">
                  <strong>{sensorNames[index]}:</strong>{" "}
                  <span className="text-pink-600">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <CanvasComponent
            joystickX={joystickX}
            joystickY={joystickY}
            slider={slider}
            light={light}
          />
          <DataFetcher onDataFetched={fetchData} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
