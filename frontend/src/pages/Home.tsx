import Categories from "@/components/home/Categories";
import HeroBanner from "@/components/home/HeroBanner";
import RestaurantCard from "@/components/home/RestaurantCard";
import SearchBar from "@/components/home/SearchBar";
import { motion } from "framer-motion";

export default function Home() {
  const restaurants = [
    { name: "Pizza Palace", image: "2484.jpg" },
    { name: "Burger World", image: "2484.jpg" },
    { name: "Chinese Corner", image: "2484.jpg" },
  ];

  return (
    <motion.div
      className="p-5 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <HeroBanner />
      <SearchBar />
      <Categories />

      <h2 className="mt-6 mb-2 text-xl font-bold">Popular Restaurants</h2>

      <div className="grid grid-cols-1 gap-4">
        {restaurants.map((r) => (
          <RestaurantCard key={r.name} name={r.name} image={r.image} />
        ))}
      </div>
    </motion.div>
  );
}
