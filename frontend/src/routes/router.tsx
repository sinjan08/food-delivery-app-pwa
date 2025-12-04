import AppShell from "@/layout/AppShell";
import Home from "@/pages/Home";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "orders", element: <Orders /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

export default router;
