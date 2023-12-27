import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { type } from "os";
import { TicketCreatedListener } from "./events/ticket-created-listener";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http:localhost:4222",
});

const options = stan.subscriptionOptions().setManualAckMode(true);

stan.on("connect", () => {
  console.log("listener connectd to nats");

  stan.on("close", () => {
    console.log("nats connection closed");
    process.exit(1);
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
