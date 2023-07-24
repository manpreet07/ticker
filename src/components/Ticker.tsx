import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const backgroundColor = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 205, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(201, 203, 207, 0.2)",
];
const borderColor = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
];

export function Ticker() {
  const [btcPrice, setBTCPrice] = useState({});
  const [btcData, setBTCData] = useState([] as number[]);
  const [btcLabels, setBTCLabels] = useState([] as string[]);

  const [dogePrice, setDOGEPrice] = useState({});
  const [dogeData, setDogeData] = useState([] as number[]);
  const [dogeLabels, setDogeLabels] = useState([] as string[]);
  const [ethPrice, setETHPrice] = useState({});
  const [ethData, setETHData] = useState([] as number[]);
  const [ethLabels, setETHLabels] = useState([] as string[]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  useEffect(() => {
    let bitcoinData: number[] = [];
    let dgData: number[] = [];
    let etData: number[] = [];
    let bitcoinLabels: string[] = [];
    let dgLabels: string[] = [];
    let etLabels: string[] = [];

    const socket = new WebSocket(
      `${process.env.REACT_APP_URL!}?token=${process.env.REACT_APP_API_KEY!}`
    );

    socket.addEventListener("error", function (error) {
      console.log("websocket error: ", error);
    });

    socket.addEventListener("open", function (event) {
      socket.send(
        JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
      );
      socket.send(
        JSON.stringify({ type: "subscribe", symbol: "BINANCE:DOGEUSDT" })
      );
      socket.send(
        JSON.stringify({ type: "subscribe", symbol: "BINANCE:ETHUSDT" })
      );
    });

    socket.addEventListener("message", function (event) {
      const data = JSON.parse(event.data);
      const tickers = data.data;
      if (tickers && tickers.length) {
        for (let ticker of tickers) {
          const price = ticker.p.toFixed(6);
          const t = parseInt(ticker.t);
          const date = new Date(t);
          const hours = date.getHours();
          const min = date.getMinutes();
          const hr = hours % 12 || 12;
          const formatTime = hr.toString() + ":" + min.toString();
          if (ticker.s === "BINANCE:BTCUSDT") {
            bitcoinData.push(price);
            bitcoinLabels.push(formatTime);
            setBTCPrice(ticker);
            setBTCData(bitcoinData);
            setBTCLabels(bitcoinLabels);
          }

          if (ticker.s === "BINANCE:DOGEUSDT") {
            dgData.push(price);
            dgLabels.push(formatTime);
            setDOGEPrice(ticker);
            setDogeData(dgData);
            setDogeLabels(dgLabels);
          }

          if (ticker.s === "BINANCE:ETHUSDT") {
            etData.push(price);
            etLabels.push(formatTime);
            setETHPrice(ticker);
            setETHData(etData);
            setETHLabels(etLabels);
          }
        }
      }
    });

    // // Unsubscribe
    // const unsubscribe = function (symbol: string) {
    //   socket.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
    // };
  }, []);

  const btcLineData = {
    labels: btcLabels,
    datasets: [
      {
        label: "BTC-USD Price",
        data: btcData,
        fill: false,
        borderWidth: 1,
        backgroundColor,
        borderColor,
      },
    ],
    point: {
      pointStyle: false,
    },
  };

  const dogeLineData = {
    labels: dogeLabels,
    datasets: [
      {
        label: "DOGE-USD Price",
        data: dogeData,
        fill: false,
        borderWidth: 1,
        backgroundColor,
        borderColor,
      },
    ],
    point: {
      pointStyle: false,
    },
  };

  const ethLineData = {
    labels: ethLabels,
    datasets: [
      {
        label: "ETH-USD Price",
        data: ethData,
        fill: false,
        borderWidth: 1,
        backgroundColor,
        borderColor,
      },
    ],
    point: {
      pointStyle: false,
    },
  };

  return (
    <div>
      <div style={{ height: "400px" }}>
        <h3>BTC-USD (Bitcoin)</h3>
        <h5>Price - {(btcPrice as any).p}</h5>
        {btcPrice ? (
          <Line
            data={btcLineData}
            style={{
              backgroundColor: "black",
              display: "inline",
            }}
            options={{
              elements: { point: { pointStyle: false } },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div style={{ height: "400px" }}>
        <h3>DOGE-USD (Dogecoin)</h3>
        <h5>Price - {(dogePrice as any).p}</h5>
        {dogePrice ? (
          <Line
            data={dogeLineData}
            style={{
              backgroundColor: "black",
              display: "inline",
            }}
            options={{
              elements: { point: { pointStyle: false } },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div style={{ height: "400px" }}>
        <h3>ETH-USD (Ethereum)</h3>
        <h5>Price - {(ethPrice as any).p}</h5>
        {ethPrice ? (
          <Line
            data={ethLineData}
            style={{
              backgroundColor: "black",
              display: "inline",
            }}
            options={{
              elements: { point: { pointStyle: false } },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
