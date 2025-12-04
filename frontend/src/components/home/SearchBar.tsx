import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Mic, Search } from "lucide-react";

export default function SearchBar() {
  return (
    <motion.div
      className="relative mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Input
        placeholder="Search for food or restaurants"
        className="pl-10 pr-10 py-3 rounded-full border-gray-300"
      />

      <Search className="absolute left-3 top-3 text-gray-500" size={20} />
      <Mic className="absolute right-3 top-3 text-gray-500" size={20} />
    </motion.div>
  );
}
