import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { FieldValues, UseFormReturn, UseFormSetError } from "react-hook-form";
//   let [errors, setErrors] = useState([]);

export const useRequest = () => {
  let { toast } = useToast();
  let makeRequest = async <T extends FieldValues>(
    { url, method, data }: AxiosRequestConfig,
    onSuccess: (data: {}) => void,
    setError?: UseFormSetError<T>
  ) => {
    try {
      let res = await axios({
        url,
        method,
        data,
      });
      return onSuccess(res.data);
    } catch (err: AxiosError | any) {
      if (!setError) {
        toast({
          title: err.response.data?.error[0],
          variant: "destructive",
        });

        return;
      }

      if (!err.response?.data?.error) {
        toast({
          title: "Something went wrong",
          description: "please try again later",
          variant: "destructive",
        });
        return;
      }

      err?.response?.data?.error?.map(
        (error: { message: string; field?: any }) => {
          if (!error.field) {
            toast({
              title: "Request failed",
              description: error.message,
              variant: "destructive",
            });
            return;
          }

          setError(error.field, { message: error.message, type: "validate" });
        }
      );
    }
  };

  return [makeRequest];
};
