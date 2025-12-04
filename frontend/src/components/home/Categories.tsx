import { motion } from "framer-motion";

const categories = [
  { name: "Pizza", emoji: "🍕" },
  { name: "Biryani", emoji: "🍛" },
  { name: "Burgers", emoji: "🍔" },
  { name: "Chinese", emoji: "🥡" },
  { name: "Rolls", emoji: "🌯" },
  { name: "Desserts", emoji: "🍰" },
];

export default function Categories() {
  return (
    <motion.div
      className="mt-5 flex gap-4 overflow-x-auto no-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {categories.map((cat, idx) => (
        <motion.div
          key={idx}
          className="min-w-[80px] h-24 bg-gray-100 rounded-xl flex flex-col items-center justify-center shadow-sm"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl">{cat.emoji}</div>
          <div className="text-sm font-medium">{cat.name}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
