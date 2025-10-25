"use client";

import { useState, useTransition } from "react";
import { ProfileFirstSetup } from "@/features/user/components/profile-first-setup";
import { ProfileSecondSetup } from "@/features/user/components/profile-second-setup";
import { submitProfile } from "@/actions/profile";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, XCircle } from "lucide-react";
import * as z from "zod";
import { ProfileFirstSetupSchema, ProfileSecondSetupSchema } from "@/schemas";

interface VerifyProfileClientProps {
  initialProfile: {
    id: string;
    verificationStatus: string;
    rejectionReason: string | null;
  } | null;
}

export function VerifyProfileClient({ initialProfile }: VerifyProfileClientProps) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [profileStatus, setProfileStatus] = useState(initialProfile?.verificationStatus || null);
  const [firstSetupData, setFirstSetupData] =
    useState<z.infer<typeof ProfileFirstSetupSchema> | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFirstSetupNext = (data: z.infer<typeof ProfileFirstSetupSchema>) => {
    setFirstSetupData(data);
    setStep(2);
  };

  const handleSecondSetupBack = () => {
    setStep(1);
  };

  const handleFinalSubmit = (data: z.infer<typeof ProfileSecondSetupSchema>) => {
    if (!firstSetupData) {
      toast.error("Please complete the first step first");
      setStep(1);
      return;
    }

    startTransition(() => {
      const completeData = {
        ...firstSetupData,
        ...data,
      };

      submitProfile(completeData).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          setIsSubmitted(true);
          setProfileStatus("PENDING");
        }
      });
    });
  };

  // Show pending verification status
  if (isSubmitted || profileStatus === "PENDING") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Clock className="h-16 w-16 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Profile Verification Pending</CardTitle>
            <CardDescription>
              Your profile is currently under review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <p className="mb-2">
                  Thank you for completing your profile! Your information is currently
                  being reviewed by our admin team.
                </p>
                <p className="mb-2">
                  <strong>What happens next?</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Our team will verify your submitted documents</li>
                  <li>You will receive a notification once verification is complete</li>
                  <li>
                    Until verification is approved, you won't be able to access the
                    dashboard
                  </li>
                  <li>This process typically takes 1-3 business days</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show rejection status with option to resubmit
  if (profileStatus === "REJECTED") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Profile Verification Rejected</CardTitle>
            <CardDescription>
              Your profile submission was not approved
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                <p className="mb-2">
                  <strong>Reason for rejection:</strong>
                </p>
                <p>{initialProfile?.rejectionReason || "No reason provided"}</p>
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <p>
                  Please review the rejection reason and make necessary corrections
                  before resubmitting your profile. Contact support if you need
                  assistance.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = (step / 2) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Step {step} of 2 - {step === 1 ? "Personal Information" : "KYC Verification"}
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <ProfileFirstSetup
              onNext={handleFirstSetupNext}
              initialData={firstSetupData || undefined}
            />
          )}
          {step === 2 && (
            <ProfileSecondSetup
              onSubmit={handleFinalSubmit}
              onBack={handleSecondSetupBack}
              dateOfBirth={firstSetupData?.dateOfBirth}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
