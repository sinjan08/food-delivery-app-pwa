import navItems from "@/data/bottom-navbar";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";


export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 border-t bg-white shadow-md flex items-center justify-around z-50">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            "flex flex-col items-center gap-1 text-xs " +
            (isActive ? "text-blue-600" : "text-gray-500")
          }
        >
          {({ isActive }) => (
            <>
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon size={22} />
              </motion.div>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
