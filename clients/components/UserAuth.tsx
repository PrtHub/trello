"use client";

import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

const UserAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/get-user");

        if (!response.data) {
          router.push("/sign-in");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/sign-in");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
};

export default UserAuth;
