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
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/redux/user-slice";
import axiosInstance from "@/lib/axiosInstance";
import GoogleAuth from "@/components/GoogleAuth";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});

const SignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unexpected error occurred.');
      }
  
      const data = await response.json();
      dispatch(setCurrentUser(data));
      toast.success("User signed in successfully");
      router.push("/");
    } catch (error: any) {
      console.error("Signin error:", error.message);
      if (error.message === 'Failed to fetch') {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <section className="max-w-[400px] w-full h-fit bg-black-1 p-10 rounded-md flex flex-col gap-4">
      <h1 className="text-white-1 font-semibold text-lg text-center">
        Sign in to Trello
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
              "SIGN IN"
            )}
          </Button>
        </form>
      </Form>
      <GoogleAuth/>
      <span className="text-white-1 font-medium flex items-center gap-1 text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={"/sign-up"}
          className="text-orange-1 hover:text-gray-1 transition cursor-pointer"
        >
          Sign up
        </Link>
      </span>
    </section>
  );
};

export default SignIn;
