"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Header } from "@/features/auth/components/header";
import { Social } from "@/features/auth/components/social";
import { BackButton } from "@/features/auth/components/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-[400px] shadow-md mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter className="px-4 sm:px-6">
          <Social />
        </CardFooter>
      )}
      <CardFooter className="px-4 sm:px-6">
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  );
};
