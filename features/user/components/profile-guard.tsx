"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProfileGuardProps {
  profile: {
    id: string;
    verificationStatus: string;
  } | null;
  children: React.ReactNode;
}

export function ProfileGuard({ profile, children }: ProfileGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't apply guard to verify-profile page itself
  const isVerifyProfilePage = pathname === "/dashboard/user/verify-profile";

  useEffect(() => {
    // Skip redirect if already on verify-profile page
    if (isVerifyProfilePage) {
      return;
    }

    // If no profile exists, redirect to verify-profile
    if (!profile) {
      router.push("/dashboard/user/verify-profile");
      return;
    }

    // If profile exists but not approved, redirect to verify-profile
    if (profile.verificationStatus !== "APPROVED") {
      router.push("/dashboard/user/verify-profile");
      return;
    }
  }, [profile, router, isVerifyProfilePage]);

  // If on verify-profile page, always render children
  if (isVerifyProfilePage) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  if (!profile || profile.verificationStatus !== "APPROVED") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
