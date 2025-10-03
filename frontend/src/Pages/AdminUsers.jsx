// AdminUsers.jsx
import React, { useEffect } from 'react';
import UserTable from '../Components/UserTable';
import useAuth from '../Hooks/useAuth';



export default function AdminUsers() {
  const {user} = useAuth()
  console.log(user)
  return (
    <div className="w-full mx-auto">
      <UserTable />
    </div>
  );
}
