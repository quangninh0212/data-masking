"use client";

import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import EmployeePage from "./pages/EmployeePage";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <LoginPage onLogin={setUser} />;

  return <EmployeePage user={user} />;
}