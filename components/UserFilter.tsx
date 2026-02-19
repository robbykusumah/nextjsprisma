"use client";

import { useRouter, useSearchParams } from "next/navigation";

type UserFilterProps = {
  users: { id: string; name: string | null; email: string }[];
};

const UserFilter = ({ users }: UserFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUser = searchParams.get("user") || "";

  const handleFilter = (userId: string) => {
    const params = new URLSearchParams(searchParams);
    if (userId) {
        params.set("user", userId);
    } else {
        params.delete("user");
    }
    // Check if page param exists, usually resetting to page 1 is good practice when filtering
    params.set("page", "1"); 
    
    router.replace(`?${params.toString()}`);
  };

  return (
    <select
      className="select select-bordered select-sm w-full max-w-xs"
      value={selectedUser}
      onChange={(e) => handleFilter(e.target.value)}
    >
      <option value="">All Users</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name || user.email}
        </option>
      ))}
    </select>
  );
};

export default UserFilter;
