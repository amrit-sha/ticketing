import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@amritorg/common";
import Ticket from "../../models/ticket";
import { queueGroupname } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupname;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price, id, version } = data;
    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      throw new Error("ticket nwo found");
    }

    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
