"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StripeCheckout from "react-stripe-checkout";
import { useContext, useEffect, useState } from "react";
import { userContext } from "@/providers/auth-provider";
import { useRequest } from "@/hooks/useRequest";
import { useToast } from "@/components/ui/use-toast";
interface ShowOrderClientProps {
  order: {
    id: string;
    expiresAt: string;
    status: string;
    ticket: {
      id: string;
      price: number;
      title: string;
    };
    userId: string;
    price: number;
  };
}
const ShowOrderClient = ({ order }: ShowOrderClientProps) => {
  const [timeLeft, setTimeLeft] = useState(1);
  const [makeRequest] = useRequest();
  const { toast } = useToast();
  const isExpired = 0 >= timeLeft;
  const currentUser = useContext(userContext);
  console.log(order);
  useEffect(() => {
    console.log("usee");
    const timerId = setInterval(() => {
      console.log("interval is still running");
      const msl = new Date(order.expiresAt).getTime() - Date.now();
      setTimeLeft(Math.round(msl / 1000));
    }, 1000);

    if (isExpired) {
      clearInterval(timerId);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [order, isExpired]);

  return (
    <>
      <Card key={order.id}>
        <CardHeader>
          <CardTitle>Purchasing {order.ticket.title}</CardTitle>
          <CardContent>Price : ${order.ticket.price}</CardContent>
        </CardHeader>

        <CardContent>
          {isExpired ? (
            <p>Order has expired</p>
          ) : (
            <p>
              You have {timeLeft} seconds to pay for this ticket.
              <StripeCheckout
                token={(token) => {
                  makeRequest(
                    {
                      url: "/api/payments",
                      method: "POST",
                      data: {
                        orderId: order.id,
                        token: token.id,
                      },
                    },
                    () => {
                      toast({ title: "Payment successful" });
                    }
                  );
                }}
                stripeKey="pk_test_51OKEtaGqOcIpMUcAoNbMMh8i1baguhS9zg548bVSt2iSb4VSjFyeRJerqBHSqLh5KrPGiVY0epHHJjXhdBBHqXyh00s1PYU76s"
                amount={order.ticket.price * 100}
                email={currentUser?.email}
              />
            </p>
          )}
        </CardContent>
        {/* <CardContent>
        <p>Available : {!ticket.orderId ? "yes" : "no"}</p>
      </CardContent> */}

        <CardContent className="flex gap-4">
          {/* <PurchaseBtn ticketId={ticket.id} disabled={!!ticket.orderId}>
          Purchase ticket
        </PurchaseBtn> */}
        </CardContent>
      </Card>
    </>
  );
};

export default ShowOrderClient;
