import { ExpirationCompleteEvent, Publisher, Subjects } from "@amritorg/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
