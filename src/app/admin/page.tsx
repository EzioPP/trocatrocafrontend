'use client';
import { useState, useCallback } from "react";
import AddUserView from "./components/User/AddUserView";
import { logout } from "../user-handler";
export default function AdminDashboard() {
    const [showComponent, setShowComponent] = useState<string | null>("none");

    const sendShowComponent = useCallback((show: string) => {
        console.log(show);
        setShowComponent(show);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Dashboard Administrador</h1>
            {showComponent === "none" && <input type="button" value="Adicionar Usuário" onClick={() => sendShowComponent("addUser")} />}
            {showComponent === "addUser" && <AddUserView sendShowComponent={sendShowComponent} />}
            <input type="button" value="Logout" onClick={logout} />

        </div>
    );
}
