import { getProfile } from "@/actions/profile";
import { ProfileGuard } from "@/features/user/components/profile-guard";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <div>
      <ProfileGuard profile={profile}>
        {children}
      </ProfileGuard>
    </div>
  );
}