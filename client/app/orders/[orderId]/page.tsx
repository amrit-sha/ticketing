import { getOrderById } from "@/api/getOrderById";
import ShowOrderClient from "./client";

interface OrderShowProps {
  params: { orderId: string };
}
const OrderShow = async ({ params }: OrderShowProps) => {
  const { errors, order } = await getOrderById(params.orderId);

  if (errors || !order) {
    return (
      <div>
        {errors?.map((e) => (
          <p key={e.message}>{e.message}</p>
        ))}
      </div>
    );
  }

  return <ShowOrderClient order={order} />;
};

export default OrderShow;
