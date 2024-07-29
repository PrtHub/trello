"use client";

import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { RootState } from "@/redux/store";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { clearCurrentUser } from "@/redux/user-slice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await axiosInstance.post(`/api/auth/signout`);
      dispatch(clearCurrentUser());
      toast.success("User signed out successfully");
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Signout error:", error.response?.data || error.message);
      toast.error("Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="flex justify-between items-center py-4 bg-black-1 px-5">
      <h1 className="text-white-1 text-2xl font-bold">Trello</h1>
      <span className="flex items-center gap-5">
        <Button
          onClick={handleSignout}
          className="bg-orange-1 hover:bg-orange-1/80 transition font-medium"
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="text-white-1 size-3 mx-auto" />
          ) : (
            "Sign out"
          )}
        </Button>
        {currentUser.avatar ===
        "https://img.icons8.com/tiny-color/32/000000/test-account.png" ? (
          <span className="flex items-center justify-center w-8 h-8 bg-gray-1 text-white-1 rounded-full">
            {currentUser?.fullname?.charAt(0).toUpperCase()}
          </span>
        ) : (
          <Image
            src={currentUser.avatar}
            width={35}
            height={35}
            alt="avatar"
            className="rounded-full"
          />
        )}
      </span>
    </header>
  );
};

export default Header;
