"use client";

import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if(!currentUser) {
   return router.push("/sign-in")
  }

  return <div>{children}</div> 
};

export default PrivateRoute;
