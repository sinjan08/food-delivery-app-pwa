import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <motion.div
      className="w-full h-40 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex flex-col justify-between shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-xl font-bold">Get your food delivered</div>
      <div className="text-sm">Fast, fresh & crispy 🔥</div>
    </motion.div>
  );
}
