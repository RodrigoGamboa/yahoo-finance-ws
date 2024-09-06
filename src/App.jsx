import { useEffect, useState } from "react";
import protobuf from "protobufjs";
import { Buffer } from "buffer";
import "./App.css";

function formatPrice(price) {
  return price ? `$${price.toFixed(2)}` : "";
}

function App() {
  const [current, setCurrent] = useState(null);
  const [stockUp, setStockUp] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("wss://streamer.finance.yahoo.com");
    const root = protobuf.load("./YPricingData.proto", (error, root) => {
      if (error) {
        return console.log(error.message);
      }
      const Yaticker = root.lookupType("yaticker");

      ws.onopen = function open() {
        console.log("connected");
        ws.send(
          JSON.stringify({
            subscribe: ["MSFT"],
          })
        );
      };

      ws.onclose = function close() {
        console.log("disconnected");
      };

      ws.onmessage = function incoming(message) {
        const next = Yaticker.decode(Buffer(message.data, "base64"));
        // console.log(next?.price, current?.price);
        setStockUp(next?.price > current?.price);
        setCurrent(next);
      };
    });
  }, []);

  return (
    <div>
      <h1>Yahoo Finance</h1>
      <p>
        Price: {formatPrice(current?.price)}
        <span
          style={{
            color: stockUp ? "green" : "red",
          }}
        >
          {stockUp ? "↑" : "↓"}
        </span>
      </p>
    </div>
  );
}

export default App;
