const roleData = [
  { name: 'Admin', code: 'ADMIN' },
  { name: 'User', code: 'USER' },
  { name: 'Restaurant', code: 'RESTAURANT' },
  { name: 'Delivery', code: 'DELIVERY' },
];

export const seedRoles = () => {
  try {
    console.log("Seeding roles...");
    // Add role seeding logic here
  } catch (err) {
    console.error("Error seeding roles:", err);
  }
}