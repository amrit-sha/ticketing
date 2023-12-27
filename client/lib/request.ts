import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { FieldValues, UseFormReturn, UseFormSetError } from "react-hook-form";
//   let [errors, setErrors] = useState([]);

export const makeRequest = async <T extends FieldValues>(
  { url, method, data }: AxiosRequestConfig,
  setError: UseFormSetError<T>,
  onSuccess: (data: {}) => {}
) => {
  let res = {};
  let errors = [];
  try {
    let res = await axios({
      url,
      method,
      data,
    });
    return onSuccess(res.data);
  } catch (err: AxiosError | any) {
    console.log(err);

    if (!err.response?.data?.error) {
      alert("unknown error");
      return;
    }

    err?.response?.data?.error?.map(
      (error: { message: string; field: any }) => {
        if (!error.field) {
          return;
        }

        setError(error.field, { message: error.message, type: "validate" });
      }
    );
  }
};
