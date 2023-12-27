import Ticket from "../ticket";

test("implements optimistic concurrency control", async () => {
  // create an instance of a ticket

  const ticket = Ticket.build({ title: "asd", price: 5, userId: "323" });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 10 });
  firstInstance?.set({ price: 15 });

  await firstInstance?.save();

  await expect(secondInstance?.save()).rejects.toThrow();
});
