import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function RestaurantCard({ name, image }: { name: string; image: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
    >
      <Card className="rounded-xl overflow-hidden shadow-md">
        <img src={image} alt={name} className="h-32 w-full object-cover" />

        <CardContent className="p-3">
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500">⭐ 4.5 • 30-40 mins</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
