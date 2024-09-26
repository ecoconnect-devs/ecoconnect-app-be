import mongoose from "mongoose";

const uri = process.env.MONGODB || "";

async function main() {
  await mongoose.connect(uri);
}

main().catch((err) => console.log(err));
