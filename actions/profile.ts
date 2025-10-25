"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CompleteProfileSchema } from "@/schemas";

export const submitProfile = async (
  values: z.infer<typeof CompleteProfileSchema>
) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CompleteProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    firstName,
    lastName,
    middleName,
    suffix,
    dateOfBirth,
    civilStatus,
    gender,
    contactNumber,
    faceImageUrl,
    idProofUrl,
    idFrontUrl,
    idBackUrl,
    documentType,
    isMinor,
    guardianName,
    guardianRelation,
    guardianIdUrl,
    consentGiven,
  } = validatedFields.data;

  try {
    // Check if profile already exists
    const existingProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return { error: "Profile already exists" };
    }

    // Create new profile
    await db.profile.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        middleName: middleName || null,
        suffix: suffix || null,
        dateOfBirth,
        civilStatus,
        gender,
        contactNumber,
        faceImageUrl,
        idProofUrl: documentType === "birth_certificate" ? (idProofUrl || null) : null,
        idFrontUrl: documentType === "birth_certificate" ? null : (idFrontUrl || null),
        idBackUrl: documentType === "birth_certificate" ? null : (idBackUrl || null),
        documentType,
        isMinor,
        guardianName: guardianName || null,
        guardianRelation: guardianRelation || null,
        guardianIdUrl: guardianIdUrl || null,
        consentGiven,
        consentDate: consentGiven ? new Date() : null,
        verificationStatus: "PENDING",
      },
    });

    return { success: "Profile submitted successfully! Awaiting admin verification." };
  } catch (error) {
    console.error("Profile submission error:", error);
    return { error: "Something went wrong!" };
  }
};

export const getProfile = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    return profile;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
};
