import axiosClient from "@/lib/axios-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  // http://<service-name>.<namespace>.svc.<cluster-domain>

  const res = await axiosClient().get("/api/tickets");
  // console.log(res);
  const tickets = res.data as {
    id: string;
    title: string;
    price: string;
    orderId?: string;
  }[];

  return (
    <div>
      <h1>Tickets list </h1>
      {tickets.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p>Price : ${item.price}</p>
          </CardContent>
          <CardContent>
            <p>Available : {!item.orderId ? "yes" : "no"}</p>
          </CardContent>

          <CardContent className="flex gap-4">
            <Link key={item.id} href={`/tickets/${item.id}`}>
              View ticket
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
