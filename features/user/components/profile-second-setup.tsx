"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProfileSecondSetupSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaceLivenessCapture } from "@/features/user/components/face-liveness-capture";
import { DocumentRecognition } from "@/features/user/components/document-recognition";

interface ProfileSecondSetupProps {
  onSubmit: (data: z.infer<typeof ProfileSecondSetupSchema>) => void;
  onBack: () => void;
  initialData?: Partial<z.infer<typeof ProfileSecondSetupSchema>>;
  dateOfBirth?: Date;
}

export const ProfileSecondSetup = ({
  onSubmit,
  onBack,
  initialData,
  dateOfBirth,
}: ProfileSecondSetupProps) => {
  const [guardianIdUrl, setGuardianIdUrl] = useState(initialData?.guardianIdUrl || "");
  const [isMinor, setIsMinor] = useState(false);

  // Calculate if user is a minor (under 18)
  useEffect(() => {
    if (dateOfBirth) {
      const today = new Date();
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      const monthDiff = today.getMonth() - dateOfBirth.getMonth();
      const isUnder18 =
        age < 18 || (age === 18 && monthDiff < 0) ||
        (age === 18 && monthDiff === 0 && today.getDate() < dateOfBirth.getDate());
      setIsMinor(isUnder18);
    }
  }, [dateOfBirth]);

  const form = useForm<z.infer<typeof ProfileSecondSetupSchema>>({
    resolver: zodResolver(ProfileSecondSetupSchema),
    defaultValues: {
      faceImageUrl: initialData?.faceImageUrl || "",
      idProofUrl: initialData?.idProofUrl || "",
      idFrontUrl: initialData?.idFrontUrl || "",
      idBackUrl: initialData?.idBackUrl || "",
      documentType: initialData?.documentType || "",
      isMinor: isMinor,
      guardianName: initialData?.guardianName || "",
      guardianRelation: initialData?.guardianRelation || "",
      guardianIdUrl: initialData?.guardianIdUrl || "",
      consentGiven: initialData?.consentGiven || false,
    },
  });

  const documentTypeValue = form.watch("documentType");
  const idBackUrl = form.watch("idBackUrl");
  const requiresDocumentRecognition = documentTypeValue
    ? documentTypeValue !== "birth_certificate"
    : false;

  useEffect(() => {
    form.setValue("isMinor", isMinor);
  }, [isMinor, form]);

  useEffect(() => {
    form.setValue("guardianIdUrl", guardianIdUrl);
  }, [guardianIdUrl, form]);

  const handleSubmit = (values: z.infer<typeof ProfileSecondSetupSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">KYC Verification</h2>
          <p className="text-muted-foreground">
            Please upload the required documents for verification.
          </p>

          {isMinor && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                As a minor (under 18 years old), you will need to provide guardian
                information and their ID proof.
              </AlertDescription>
            </Alert>
          )}

          {/* Face Liveness Detection */}
          <FormField
            control={form.control}
            name="faceImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Face Liveness Detection</FormLabel>
                <FormDescription>
                  Follow the instructions to complete the liveness check: turn your head LEFT, then RIGHT, and finally look at the CENTER to verify you're a real person.
                </FormDescription>
                <FaceLivenessCapture
                  value={(field.value as string) || undefined}
                  onChange={(url) => {
                    field.onChange(url ?? "");
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Document Type Selection */}
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "birth_certificate") {
                      form.setValue("idFrontUrl", "");
                      form.setValue("idBackUrl", "");
                      void form.trigger(["idFrontUrl", "idBackUrl"]);
                    } else {
                      form.setValue("idProofUrl", "");
                      void form.trigger("idProofUrl");
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="postal_id">Postal ID</SelectItem>
                    <SelectItem value="voters_id">Voter's ID</SelectItem>
                    <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Document Verification */}
          {requiresDocumentRecognition ? (
            <FormField
              control={form.control}
              name="idFrontUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Government ID Recognition</FormLabel>
                  <FormDescription>
                    Scan both the front and back sides of your government-issued ID. Keep the card within the guide and avoid glare.
                  </FormDescription>
                  <DocumentRecognition
                    documentType={documentTypeValue}
                    frontValue={field.value as string}
                    backValue={idBackUrl}
                    onFrontChange={(url) => {
                      field.onChange(url ?? "");
                      void form.trigger("idFrontUrl");
                    }}
                    onBackChange={(url) => {
                      form.setValue("idBackUrl", url ?? "");
                      void form.trigger("idBackUrl");
                    }}
                  />
                  <FormMessage />
                  {form.formState.errors.idBackUrl && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.idBackUrl.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="idProofUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Proof or Birth Certificate</FormLabel>
                  <FormDescription>
                    Upload a clear photo or PDF of your identification document
                  </FormDescription>
                  {!field.value ? (
                    <UploadDropzone
                      endpoint="documentUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          field.onChange(res[0].url);
                          void form.trigger("idProofUrl");
                          toast.success("Document uploaded successfully!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                      className="border-2 border-dashed"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-4 border rounded-lg bg-green-50">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">Document uploaded</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          field.onChange("");
                          void form.trigger("idProofUrl");
                        }}
                        className="ml-auto"
                      >
                        Change
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Guardian Information - Only for minors */}
          {isMinor && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold">Guardian Information</h3>

              <FormField
                control={form.control}
                name="guardianName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter guardian's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guardianRelation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Guardian's ID Proof</FormLabel>
                <FormDescription>
                  Upload a clear photo or PDF of guardian's identification
                </FormDescription>
                {!guardianIdUrl ? (
                  <UploadDropzone
                    endpoint="guardianIdUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setGuardianIdUrl(res[0].url);
                        toast.success("Guardian ID uploaded successfully!");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                    className="border-2 border-dashed"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-4 border rounded-lg bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700">
                      Guardian ID uploaded
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setGuardianIdUrl("")}
                      className="ml-auto"
                    >
                      Change
                    </Button>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="guardianIdUrl"
                  render={() => <FormMessage />}
                />
              </div>
            </div>
          )}

          {/* Consent Checkbox */}
          <FormField
            control={form.control}
            name="consentGiven"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="text-sm font-normal leading-normal cursor-pointer">
                      I agree with the Macatiw | eBarangay{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-bold underline underline-offset-2"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      {" / "}
                      <Link
                        href="/terms-of-use"
                        className="font-bold underline underline-offset-2"
                        target="_blank"
                      >
                        Terms of Use
                      </Link>{" "}
                      and consent to the collection and processing of my personal data in accordance thereto.
                    </FormLabel>
                    <FormMessage className="mt-2" />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Submit Profile</Button>
        </div>
      </form>
    </Form>
  );
};
