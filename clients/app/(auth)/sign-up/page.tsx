"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import GoogleAuth from "@/components/GoogleAuth";

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "full name must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/api/auth/signup`, values);
      toast.success("User signed up successfully");
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Signup error:", error.response.data);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-[400px] w-full h-fit bg-black-1 p-10 rounded-md flex flex-col gap-4">
      <h1 className="text-white-1 font-semibold text-lg text-center">
        Sign up to Trello
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white-2">Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-black-3 text-gray-1 placeholder:text-gray-1 ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white-2">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="bg-black-3 text-gray-1 placeholder:text-gray-1 ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white-2">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-black-3 text-gray-1 placeholder:text-gray-1 ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-orange-1 hover:bg-orange-1/80 transition text-white-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="text-white-1 size-4 mx-auto" />
            ) : (
              "SIGN UP"
            )}
          </Button>
        </form>
      </Form>
      <GoogleAuth/>
      <span className="text-white-1 font-medium flex items-center gap-1 text-sm">
        Already have an account?{" "}
        <Link
          href={"/sign-in"}
          className="text-orange-1 hover:text-gray-1 transition cursor-pointer"
        >
          Sign in
        </Link>
      </span>
    </section>
  );
};

export default SignUp;