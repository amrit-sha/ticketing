import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
import { resolve } from "path";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  private client: Stan;
  abstract subject: T["subject"];

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("event published to subject", this.subject);
        resolve();
      });
    });
  }
}
