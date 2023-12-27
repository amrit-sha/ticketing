import axiosClient from "@/lib/axios-client";

export const getOrderById = async (id: string) => {
  try {
    const res = await axiosClient().get(`/api/orders/${id}`);

    const order = res.data as {
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

    return { errors: null, order };
  } catch (err: any) {
    console.log(err.response.data);
    if (err.response?.data) {
      return {
        order: null,
        errors: err.response.data.error as {
          message: string;
          [K: string]: string;
        }[],
      };
    }

    return { errors: [{ message: "something went wrong" }], order: null };
  }
};
