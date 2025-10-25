# User Profile Completion System

## Overview
This implementation provides a complete user profile verification system with KYC (Know Your Customer) requirements, including face liveness detection and document verification.

## Features Implemented

### 1. Database Schema (Prisma)
- **Profile Model** with the following fields:
  - Personal Information (firstName, lastName, middleName, suffix, dateOfBirth, civilStatus, gender, contactNumber)
  - KYC Documents (faceImageUrl, idProofUrl, documentType)
  - Minor Guardian Info (isMinor, guardianName, guardianRelation, guardianIdUrl)
  - Verification Status (PENDING, APPROVED, REJECTED)
  - Consent tracking (consentGiven, consentDate)
  
- **Enums** for:
  - Gender (MALE, FEMALE, OTHER)
  - CivilStatus (SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED)
  - Suffix (JR, SR, II, III, IV, V)
  - VerificationStatus (PENDING, APPROVED, REJECTED)

### 2. File Upload Integration (UploadThing)
Three upload endpoints configured:
- `faceImageUploader` - For face liveness detection images (max 4MB)
- `documentUploader` - For ID proof/birth certificates (max 8MB, supports images and PDFs)
- `guardianIdUploader` - For guardian ID documents for minors (max 8MB, supports images and PDFs)

### 3. Multi-Step Form Components

#### First Setup (Personal Information)
Located: `features/user/components/profile-first-setup.tsx`
- First Name (required)
- Last Name (required)
- Middle Name (optional)
- Suffix (optional, select dropdown)
- Date of Birth (date picker)
- Civil Status (select dropdown)
- Gender (select dropdown)
- Contact Number (validated format)

#### Second Setup (KYC Verification)
Located: `features/user/components/profile-second-setup.tsx`
- Face Image Upload (drag & drop or click to upload)
- Document Type Selection (National ID, Driver's License, Passport, etc.)
- ID Proof/Birth Certificate Upload
- **Auto-detection of minors** (based on date of birth)
- Guardian Information (conditional, only for minors):
  - Guardian Full Name
  - Relationship (Mother, Father, Legal Guardian)
  - Guardian ID Upload
- Privacy Policy & Terms of Use Consent Checkbox (required)

### 4. Verification Page
Located: `app/dashboard/user/verify-profile/page.tsx`

Features:
- Progress indicator showing current step
- Multi-step form navigation (Back/Next buttons)
- Three possible states:
  1. **Form Entry** - New users complete their profile
  2. **Pending Verification** - Profile submitted, awaiting admin approval
  3. **Rejected** - Profile rejected with reason displayed

### 5. Server Actions
Located: `actions/profile.ts`

- `submitProfile()` - Validates and saves profile data
- `getProfile()` - Retrieves user's profile and verification status

### 6. Middleware Protection
Located: `middleware.ts`

Enhanced with profile verification checks:
- Users without profiles are redirected to `/dashboard/user/verify-profile`
- Users with PENDING or REJECTED profiles cannot access protected dashboard routes
- Users with APPROVED profiles are redirected away from verify-profile page
- UploadThing routes are whitelisted for file uploads

### 7. Route Configuration
Located: `routes.ts`

Added:
- `protectedRoutes` - Routes requiring verified profile
- `profileVerificationRoute` - Profile verification page path

## User Flow

### New User Registration
1. User registers and logs in
2. Middleware detects no profile → redirects to `/dashboard/user/verify-profile`
3. User completes Step 1 (Personal Information)
4. User completes Step 2 (KYC Verification)
   - If under 18, guardian fields appear automatically
   - Uploads face image for liveness detection
   - Uploads ID proof or birth certificate
   - If minor, uploads guardian ID
   - Agrees to Privacy Policy and Terms
5. Profile submitted with status: PENDING
6. User sees "Pending Verification" message
7. User cannot access dashboard until admin approves

### Admin Verification (To be implemented)
- Admin reviews submitted profile
- Admin can APPROVE or REJECT with reason
- On approval, user can access dashboard
- On rejection, user sees rejection reason and can resubmit

### Minor Detection
The system automatically calculates age from the date of birth:
- If user is under 18, `isMinor` is set to true
- Guardian information fields become required
- Validation ensures guardian details are provided

## Security Features

1. **Authentication Required** - All profile operations require valid session
2. **File Upload Security** - UploadThing validates file types and sizes
3. **Validation** - Zod schemas validate all input data
4. **Database Constraints** - Prisma enforces data integrity
5. **Middleware Protection** - Prevents unauthorized access to dashboard

## Data Privacy Compliance

- Explicit consent checkbox required before submission
- Consent timestamp recorded
- Links to Privacy Policy and Terms of Use
- Personal data collection clearly explained

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (via Prisma)
- **File Upload**: UploadThing
- **Form Validation**: Zod + React Hook Form
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Database Migration

The profile table was created with:
```bash
npx prisma migrate dev --name add_profile_model
```

## Environment Variables Required

Ensure these are set in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `UPLOADTHING_SECRET` - UploadThing secret key
- `UPLOADTHING_APP_ID` - UploadThing app ID

## Next Steps for Admin Implementation

To complete the system, implement:
1. Admin dashboard to view pending profiles
2. Profile review interface with approve/reject actions
3. Notification system for verification status updates
4. Document viewer for uploaded files
5. Admin action logging and audit trail

## Testing Checklist

- [ ] Register new user
- [ ] Complete profile as adult (18+)
- [ ] Complete profile as minor (under 18)
- [ ] Upload face image
- [ ] Upload ID documents
- [ ] Upload guardian ID (for minors)
- [ ] Submit without consent (should fail)
- [ ] Verify middleware redirection
- [ ] Check pending status display
- [ ] Test file upload size limits
- [ ] Verify validation errors display correctly
