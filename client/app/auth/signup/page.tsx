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

interface SignupPageProps {}

// export const metadata: Metadata = {
//   title: "Signup",
//   description: "create new account",
// };

const formSchema = z.object({
  email: z.string().email().min(5),
  password: z.string().max(20).min(5, "password must contain 5 characters"),
});

type schemaType = z.infer<typeof formSchema>;

const SignupPage = ({}: SignupPageProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [makeRequest] = useRequest();
  // 1. Define your form.
  const form = useForm<schemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: schemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await makeRequest(
      { url: "/api/users/signup", method: "POST", data },

      (data) => {
        toast({ description: "signup successful", variant: "success" });
        router.push("/");
        router.refresh();
      },
      form.setError
    );
  }

  return (
    <>
      <title>Signup</title>
      <div className="rounded-sm m-2  flex flex-col items-center  p-4 justify-start">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[400px]  p-4 ring-1 ring-rose-200 bg-rose-100 "
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="email"
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
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={form.formState.isSubmitting}
                      placeholder="Password"
                      {...field}
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
    </>
  );
};

export default SignupPage;
