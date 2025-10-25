"use server";

import { db } from "@/lib/db";

export async function getUserProfileStatus(userId: string) {
  try {
    const profile = await db.profile.findUnique({
      where: { userId },
      select: {
        verificationStatus: true,
        id: true,
      },
    });

    return profile;
  } catch {
    return null;
  }
}
