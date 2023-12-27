import { Publisher, OrderCreatedEvent, Subjects } from "@amritorg/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
