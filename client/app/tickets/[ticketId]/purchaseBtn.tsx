"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRequest } from "@/hooks/useRequest";
import { useRouter } from "next/navigation";

interface purchaseBtnProps {
  ticketId: string;
  disabled: boolean;
  children: React.ReactNode;
}
const PurchaseBtn = ({ ticketId, disabled, children }: purchaseBtnProps) => {
  const { toast } = useToast();
  const [makeRequest] = useRequest();
  const router = useRouter();
  const onClick = () => {
    makeRequest(
      { url: "/api/orders", method: "POST", data: { ticketId } },
      (data: any) => {
        router.push(`/orders/${data.id}`);
        toast({ title: "order successful" });
      }
    );
  };

  return (
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};

export default PurchaseBtn;
