import mongoose from "mongoose";

import { connectDB } from "../src/db/connect";
import { UserModel } from "../src/db/models/User";
import { USER_SEEDS } from "../src/db/seeds";

async function seedUsers() {
  await connectDB();

  for (const seed of USER_SEEDS) {
    const user = await UserModel.findOneAndUpdate(
      { email: seed.email },
      { $set: { name: seed.name } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    console.log(`Upserted user: ${seed.name} <${seed.email}> (${user._id})`);
  }

  console.log("Seed complete.");
}

seedUsers()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
