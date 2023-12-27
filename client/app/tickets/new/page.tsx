"use client";
"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useRequest } from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Metadata } from "next";
import Head from "next/head";

const formSchema = z.object({
  title: z.string().min(3),
  price: z.string(),
});

type schemaType = z.infer<typeof formSchema>;

interface NewTicketProps {}
const NewTicket = ({}: NewTicketProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [makeRequest] = useRequest();

  const form = useForm<schemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: schemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await makeRequest(
      { url: "/api/tickets", method: "POST", data },

      () => {
        toast({
          description: "Successfully created a ticket",
          variant: "success",
        });
        router.push("/");
        router.refresh();
      },
      form.setError
    );
  }

  const onBluri = () => {
    const value = parseFloat(form.getValues("price"));

    if (isNaN(value)) {
      return;
    }
    form.setValue("price", value.toFixed(2));
  };

  return (
    <div>
      <title>Create a ticket</title>
      <div className="rounded-sm m-2  flex flex-col items-center  p-4 justify-start">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[400px]  p-4 ring-1 ring-rose-200 bg-rose-100 "
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="title"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>Please enter your email.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={form.formState.isSubmitting}
                      placeholder="Price"
                      {...field}
                      onBlur={onBluri}
                    />
                  </FormControl>
                  {/* <FormDescription>
                Password should be at least 4 chars long.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewTicket;
