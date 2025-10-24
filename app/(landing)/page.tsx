"use client";

import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})
export default function Home() {
  return (
    <div className="space-y-6 text-center">
      <h1 className={cn(
        "text-6xl font-semibolddrop-shadow-md",
        font.className,
      )}>
        🔐 Auth
      </h1>
      <p className="text-white text-lg">
        A simple authentication service
      </p>
      <div>
        <LoginButton asChild>
          <Button variant="secondary" size="lg">
            Sign in
          </Button>
        </LoginButton>
      </div>
    </div>
  );
}
