"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        variant="outline"
        className="flex-1 h-10 sm:h-11"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="flex-1 h-10 sm:h-11"
        onClick={() => onClick("facebook")}
      >
        <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};
