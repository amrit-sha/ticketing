import { Publisher, Subjects, TicketUpdatedEvent } from "@amritorg/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
