import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";

interface DataFetcherProps {
  // No necesitas props adicionales aquí, ya que todo se manejará internamente
}

const DataFetcher: React.FC<DataFetcherProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [joystickX, setJoystickX] = useState(0);
  const [joystickY, setJoystickY] = useState(0);
  const [light, setLight] = useState(0);
  const [slider, setSlider] = useState(0);
  const [color1, setColor1] = useState("#000000"); // Color por defecto
  const [color2, setColor2] = useState("#FFFFFF"); // Color por defecto

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/serial-data");
      const data = response.data.data.split(",");
      const joystickX = parseInt(data[0], 10);
      const joystickY = parseInt(data[1], 10);
      const light = Math.min(Math.max(parseInt(data[2], 10), 0), 1024);
      const slider = parseInt(data[4], 10);
      const color1 = data[10]; // Color del data[10]
      const color2 = data[12]; // Color del data[12]

      // Actualiza el estado
      setJoystickX(joystickX);
      setJoystickY(joystickY);
      setLight(light);
      setSlider(slider);
      setColor1(color1);
      setColor2(color2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        ctx.fillStyle = color1; // Usar color1 para el círculo
        ctx.beginPath();
        ctx.arc(joystickX, joystickY, 20, 0, Math.PI * 2); // Dibujar un círculo
        ctx.fill();
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000); // Repetir la obtención de datos cada segundo
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [joystickX, joystickY, color1]); // Redibujar cuando cambien estas propiedades

  return (
    <div>
      <div className="tiempo">
        <button>ANTERIOR</button>
        <button>SIGUIENTE</button>
      </div>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default DataFetcher;
