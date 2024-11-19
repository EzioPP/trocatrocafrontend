"use client";

import { redirect } from "next/navigation";

export async function logout() {
    const response = await fetch("http://localhost:5015/api/user/logout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    redirect("/login");
}
