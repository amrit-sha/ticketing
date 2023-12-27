import { PaymentCreatedEvent, Publisher, Subjects } from "@amritorg/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
