import axiosClient from "@/lib/axios-client";
import { AxiosError } from "axios";

export const getTicketById = async (id: string) => {
  try {
    const res = await axiosClient().get(`/api/tickets/${id}`);

    const ticket = res.data as {
      id: string;
      title: string;
      price: string;
      orderId?: string;
    };

    return { errors: null, ticket };
  } catch (err: any) {
    console.log(err.response.data);
    if (err.response?.data) {
      return {
        ticket: null,
        errors: err.response.data.error as {
          message: string;
          [K: string]: string;
        }[],
      };
    }

    return { errors: [{ message: "something went wrong" }], ticket: null };
  }
};
