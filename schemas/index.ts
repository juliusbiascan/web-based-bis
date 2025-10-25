import * as z from "zod";
import { UserRole } from "@/lib/generated/prisma";

export const ProfileFirstSetupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().optional(),
  suffix: z.enum(["JR", "SR", "II", "III", "IV", "V"]).optional(),
  dateOfBirth: z.date({ message: "Date of birth is required" }),
  civilStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"], {
    message: "Civil status is required",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender is required",
  }),
  contactNumber: z.string()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .regex(/^[0-9+()-\s]+$/, { message: "Invalid contact number format" }),
});

export const ProfileSecondSetupSchema = z.object({
  faceImageUrl: z.string().min(1, { message: "Face image is required for verification" }),
  documentType: z.string().min(1, { message: "Document type is required" }),
  idProofUrl: z.string().optional(),
  idFrontUrl: z.string().optional(),
  idBackUrl: z.string().optional(),
  isMinor: z.boolean(),
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianIdUrl: z.string().optional(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy and Terms of Use",
  }),
}).superRefine((data, ctx) => {
  if (data.documentType === "birth_certificate") {
    if (!data.idProofUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["idProofUrl"],
        message: "Birth certificate upload is required",
      });
    }
  } else if (data.documentType) {
    if (!data.idFrontUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["idFrontUrl"],
        message: "Front side scan of your ID is required",
      });
    }
    if (!data.idBackUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["idBackUrl"],
        message: "Back side scan of your ID is required",
      });
    }
  }

  if (data.isMinor) {
    if (!data.guardianName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardianName"],
        message: "Guardian information is required for minors",
      });
    }

    if (!data.guardianRelation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardianRelation"],
        message: "Guardian relationship is required for minors",
      });
    }

    if (!data.guardianIdUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardianIdUrl"],
        message: "Guardian ID upload is required for minors",
      });
    }
  }
});

export const CompleteProfileSchema = ProfileFirstSetupSchema.merge(ProfileSecondSetupSchema);

export const SettingsSchema = z.object({
  name: z.optional(z.string().min(1, {
    message: "Name is required",
  })),
  username: z.optional(z.string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(20, {
      message: "Username must be at most 20 characters",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    })),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  });

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  username: z.string()
    .min(3, {
      message: "Username must be at least 3 characters",
    })
    .max(20, {
      message: "Username must be at most 20 characters",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});
