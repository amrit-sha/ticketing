import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@amritorg/common";
import Ticket from "../../models/ticket";
import { queueGroupname } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupname;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;
    const ticket = Ticket.build({ title, price, id });
    await ticket.save();
    msg.ack();
  }
}
