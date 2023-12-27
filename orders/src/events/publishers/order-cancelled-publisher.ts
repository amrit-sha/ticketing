import { Subjects, Publisher, OrderCancelledEvent } from "@amritorg/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
