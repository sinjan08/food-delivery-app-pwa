// prisma/seed.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";
import locations from "../src/data/locations.json" assert { type: "json" };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

// PostgreSQL pool + Prisma adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// SAFE decimal converter
const dec = (v: any) => {
  if (!v) return null;
  const n = Number(v);
  if (isNaN(n)) return null;
  return String(n);
};



async function main() {
  console.log("🌍 Seeding started...\n");

  const countriesData: any[] = [];
  const statesData: any[] = [];
  const citiesData: any[] = [];

  /** ------------------------------------------
   *   EXTRACT COUNTRIES → STATES → CITIES
   *  ------------------------------------------ */
  for (const c of locations) {
    // COUNTRY
    countriesData.push({
      name: c.name,
      iso3: c.iso3,
      iso2: c.iso2,
      numericCode: c.numeric_code,
      phonecode: c.phonecode ?? "",
      capital: c.capital,
      currency: c.currency,
      currencyName: c.currency_name,
      currencySymbol: c.currency_symbol,
      tld: c.tld,
      native: c.native,
      population: c.population,
      gdp: c.gdp,
      nationality: c.nationality,
      timezones: c.timezones,
      translations: c.translations,
      latitude: dec(c.latitude),
      longitude: dec(c.longitude),
      emoji: c.emoji,
      emojiU: c.emojiU,
    });

    // STATES
    for (const s of c.states || []) {
      statesData.push({
        name: s.name,
        countryIso2: c.iso2, // temporary during mapping
        countryCode: c.iso2,
        iso2: s.iso2, // Example: "BDS"
        iso3166_2: s.iso3166_2,
        fipsCode: s.fips_code || null,
        type: s.type || null,
        native: s.native || null,
        latitude: dec(s.latitude),
        longitude: dec(s.longitude),
        timezone: s.timezone || null,
        translations: s.translations || null,
        wikiDataId: s.wikiDataId || null,
      });

      // CITIES
      for (const city of s.cities || []) {
        citiesData.push({
          name: city.name,
          stateIso2: s.iso2, // Example: "BDS"
          countryIso2: c.iso2,
          stateCode: s.iso2,
          countryCode: c.iso2,
          latitude: dec(city.latitude),
          longitude: dec(city.longitude),
          timezone: city.timezone || null,
          native: city.native || null,
          translations: city.translations || null,
          wikiDataId: city.wikiDataId || null,
        });
      }
    }
  }

  /** ------------------------------------------
   *           INSERT COUNTRIES
   *  ------------------------------------------ */
  await prisma.country.createMany({
    data: countriesData,
    skipDuplicates: true,
  });

  const countryRows = await prisma.country.findMany();
  const countryMap = new Map(countryRows.map((x) => [x.iso2, x.id]));

  console.log(`✔ Countries inserted: ${countryRows.length}`);

  /** ------------------------------------------
   *           INSERT STATES
   *  ------------------------------------------ */
  const finalStateData = statesData
    .map((s) => {
      const countryId = countryMap.get(s.countryIso2);
      if (!countryId) return null;

      return {
        name: s.name,
        countryId,
        countryCode: s.countryCode,
        iso2: s.iso2,
        iso3166_2: s.iso3166_2,
        fipsCode: s.fipsCode,
        type: s.type,
        native: s.native,
        latitude: s.latitude,
        longitude: s.longitude,
        timezone: s.timezone,
        translations: s.translations,
        wikiDataId: s.wikiDataId,
      };
    })
    .filter(Boolean);

  await prisma.state.createMany({
    data: finalStateData as any[],
    skipDuplicates: true,
  });

  const stateRows = await prisma.state.findMany();
  const stateMap = new Map(
    stateRows.map((s) => [`${s.iso2}-${s.countryId}`, s.id])
  );

  console.log(`✔ States inserted: ${stateRows.length}`);

  /** ------------------------------------------
   *           INSERT CITIES (batch)
   *  ------------------------------------------ */
  const finalCityData = citiesData
    .map((c) => {
      const countryId = countryMap.get(c.countryIso2);
      if (!countryId) return null;

      const stateId = stateMap.get(`${c.stateIso2}-${countryId}`);
      if (!stateId) return null;

      return {
        name: c.name,
        countryId,
        stateId,
        countryCode: c.countryCode,
        stateCode: c.stateCode,
        latitude: c.latitude,
        longitude: c.longitude,
        timezone: c.timezone,
        native: c.native,
        translations: c.translations,
        wikiDataId: c.wikiDataId,
      };
    })
    .filter(Boolean);

  console.log(`→ Inserting ${finalCityData.length} cities...`);

  const batchSize = 5000;
  for (let i = 0; i < finalCityData.length; i += batchSize) {
    const batch = finalCityData.slice(i, i + batchSize);
    await prisma.city.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`   ✔ ${i + batch.length}/${finalCityData.length}`);
  }

  console.log("✔ Cities inserted successfully");

  /** ------------------------------------------
   *           INSERT ROLES
   *  ------------------------------------------ */
  await prisma.role.createMany({
    data: [
      { name: "Admin", code: "ADMIN" },
      { name: "User", code: "USER" },
      { name: "Restaurant", code: "RESTAURANT" },
      { name: "Delivery", code: "DELIVERY" },
    ],
    skipDuplicates: true,
  });

  console.log("✔ Roles inserted");
  console.log("🎯 Seeding completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
