"use client";

import Link from "next/link";

const UserPage = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome to the user dashboard page.</p>
      <Link className="text-secondary-foreground" href="/dashboard/user/settings">Go to Settings</Link>
    </div>
  );
}

export default UserPage;