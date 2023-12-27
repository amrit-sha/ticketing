import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http:localhost:4222",
});

stan.on("connect", async () => {
  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish({
    id: "32",
    title: "cons",
    price: 20,
  });

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   print: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
