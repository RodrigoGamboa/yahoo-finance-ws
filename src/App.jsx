import { useEffect } from "react";
import protobuf from "protobufjs";
import { Buffer } from "buffer";
import "./App.css";

function App() {
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
        console.log(Yaticker.decode(Buffer(message.data, "base64")));
      };
    });
  }, []);

  return (
    <div>
      <h1>Yahoo Finance</h1>
    </div>
  );
}

export default App;
