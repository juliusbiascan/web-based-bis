"use client";

import Link from "next/link";

const AdminPage = () => {

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard page.</p>
      <Link className="text-secondary-foreground" href="/dashboard/admin/settings">Go to Settings</Link>
    </div>
  );
}

export default AdminPage;