// Test environment setup: point the app at an in-memory MongoDB instance
// so the suite never touches a real database, and supply throwaway
// secrets so config/env.js doesn't refuse to boot.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-please-do-not-use-in-prod";
process.env.ANTHROPIC_API_KEY = "test-key";
process.env.MONGO_URI = "mongodb://placeholder"; // unused in test mode, but env.js requires it to be set

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
});
