"use client";

import Link from "next/link";
import LogoutButton from "./signout";

interface HeaderProps {
  currentUser: { email: string; id: string; iat: number } | null;
}
const Header = ({ currentUser }: HeaderProps) => {
  return (
    <>
      <div className="w-full  flex items-center justify-center p-2 px-4 h-[80px] shadow-sm">
        <Link href={"/"} className="text-lg uppercase font-bold">
          Git Tix
        </Link>
        <div className="ml-auto flex gap-3">
          {currentUser ? (
            <>
              <p className="text-sm"> {currentUser.email} </p>
              <Link href={"/tickets/new"}>Sell tickets</Link>
              <Link href={"/orders"}>My orders</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href={"/auth/signup"}>signup</Link>
              <Link href={"/auth/signin"}>signin</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
