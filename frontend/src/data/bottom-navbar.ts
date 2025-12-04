import { Home, Search, ShoppingBag, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
];

export default navItems;