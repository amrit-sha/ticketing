import { getAllOrders } from "@/api/getAllOrders";
import ShowOrderClient from "./[orderId]/client";

interface OrdersPageProps {}
const OrdersPage = async ({}: OrdersPageProps) => {
  const { order: orders, errors } = (await getAllOrders()) || [];

  return (
    <div>
      Orders page
      {orders?.map((order) => (
        <ShowOrderClient key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrdersPage;
