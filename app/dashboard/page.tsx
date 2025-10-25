import { UserRole } from "@/lib/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/login');
  } else {
    if (session.user.role === UserRole.ADMIN) {
      redirect('/dashboard/admin');
    }
    redirect('/dashboard/user');
  }
}

export default DashboardPage;