import { getProfile } from "@/actions/profile";
import { VerifyProfileClient } from "@/features/user/components";
import { redirect } from "next/navigation";

export default async function VerifyProfilePage() {
  const profile = await getProfile();

  // If user has an approved profile, redirect to dashboard
  if (profile && profile.verificationStatus === "APPROVED") {
    redirect("/dashboard/user");
  }

  return <VerifyProfileClient initialProfile={profile} />;
}
