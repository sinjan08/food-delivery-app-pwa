import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
