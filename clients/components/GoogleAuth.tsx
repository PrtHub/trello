"use client";

import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { app } from "@/lib/firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import axiosInstance from "@/lib/axiosInstance";
import { setCurrentUser } from "@/redux/user-slice";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axiosInstance.post("/api/auth/google", {
        email: user.email,
        fullname: user.displayName,
        photo: user.photoURL,
      });
      if (response.status === 200) {
        dispatch(setCurrentUser(response.data));
        router.push("/");
        toast.success("Signed in!");
      }
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      className="bg-white-1 hover:bg-white-1/90 rounded-lg px-5 py-4 text-black-1 font-semibold w-full"
    >
      Continue With Google
    </Button>
  );
};

export default GoogleAuth;
