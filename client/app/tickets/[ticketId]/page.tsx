import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTicketById } from "../../../api/getTicketById";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import PurchaseBtn from "./purchaseBtn";

interface TicketPageProps {
  params: {
    ticketId: string;
  };
  searchParams: any;
}
const TicketPage = async ({ params }: TicketPageProps) => {
  const { errors, ticket } = await getTicketById(params.ticketId);
  console.log(errors, ticket);
  if (errors?.length || !ticket) {
    return (
      <div>
        {errors.map((e) => (
          <p key={e.message}>{e.message}</p>
        ))}
      </div>
    );
  }

  return (
    <>
      <title>{ticket.title}</title>
      <Card key={ticket.id}>
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p>Price : ${ticket.price}</p>
        </CardContent>
        <CardContent>
          <p>Available : {!ticket.orderId ? "yes" : "no"}</p>
        </CardContent>

        <CardContent className="flex gap-4">
          <PurchaseBtn ticketId={ticket.id} disabled={!!ticket.orderId}>
            Purchase ticket
          </PurchaseBtn>
        </CardContent>
      </Card>
    </>
  );
};

export default TicketPage;
