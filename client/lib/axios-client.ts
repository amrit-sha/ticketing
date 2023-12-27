import axios from "axios";
import { headers } from "next/headers";

const axiosClient = () => {
  let h: { [key: string]: any } = {};
  headers().forEach((value, key) => {
    h[key] = value;
  });

  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: h,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default axiosClient;
