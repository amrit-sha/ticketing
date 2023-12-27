"use client";

import axios from "axios";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {}
const LogoutButton = ({}: LogoutButtonProps) => {
  const router = useRouter();
  let toast = useToast();
  const handleLogout = async () => {
    await axios.get("/api/users/signout");
    router.refresh();
    toast.toast({ title: "logged out", variant: "success" });
  };
  return (
    <div
      onClick={handleLogout}
      className="flex gap-2 cursor-pointer items-center justify-center"
    >
      logout <LogOut />
    </div>
  );
};

export default LogoutButton;
