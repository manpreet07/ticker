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

export function Ticker() {
  const TOKEN = process.env.REACT_APP_API_KEY!;
  const [btcPrice, setBTCPrice] = useState({});
  const [btcData, setBTCData] = useState([] as number[]);
  let [btcLabels, setBTCLabels] = useState([] as string[]);
  const [dogePrice, setDOGEPrice] = useState({});
  const [dogeData, setDogeData] = useState([] as number[]);
  let [dogeLabels, setDogeLabels] = useState([] as string[]);
  const [ethPrice, setETHPrice] = useState({});
  const [ethData, setETHData] = useState([] as number[]);
  let [ethLabels, setETHLabels] = useState([] as string[]);

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
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${TOKEN}`);

    socket.addEventListener("open", function (event) {
      console.log("connection established  ", event);
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
          const price = ticker.p.toFixed(3);
          const t = parseInt(ticker.t);
          const date = new Date(t);
          const hours = date.getHours();
          const min = date.getMinutes();
          const hr = hours % 12 || 12;
          const formatTime = hr.toString() + ":" + min.toString();
          if (ticker.s === "BINANCE:BTCUSDT") {
            if (btcLabels && btcLabels.length) {
              const lb = parseInt(btcLabels[0].split(":")[0]);
              if (hr - lb === 1) {
                btcLabels = [];
              }
            }
            btcData.push(price);
            btcLabels.push(formatTime);
            setBTCPrice(ticker);
            setBTCData(btcData);
            setBTCLabels(btcLabels);
          }

          if (ticker.s === "BINANCE:DOGEUSDT") {
            if (dogeLabels && dogeLabels.length) {
              const lb = parseInt(dogeLabels[0].split(":")[0]);
              if (hr - lb === 1) {
                dogeLabels = [];
              }
            }

            dogeData.push(price);
            dogeLabels.push(formatTime);
            setDOGEPrice(ticker);
            setDogeData(dogeData);
            setDogeLabels(dogeLabels);
          }

          if (ticker.s === "BINANCE:ETHUSDT") {
            if (ethLabels && ethLabels.length) {
              const lb = parseInt(ethLabels[0].split(":")[0]);
              if (hr - lb === 1) {
                ethLabels = [];
              }
            }

            ethData.push(price);
            ethLabels.push(formatTime);
            setETHPrice(ticker);
            setETHData(ethData);
            setETHLabels(ethLabels);
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
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
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
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
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
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
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
              borderColor: "white",
              display: "inline",
            }}
            options={{ elements: { point: { pointStyle: false } } }}
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
              borderColor: "white",
              display: "inline",
            }}
            options={{ elements: { point: { pointStyle: false } } }}
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
              borderColor: "white",
              display: "inline",
            }}
            options={{ elements: { point: { pointStyle: false } } }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
