import type { User } from "$lib/ui/types/placemark-types";
import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema<User>({
  firstName: String,
  lastName: String,
  userLat: Number,
  userLong: Number,
  country: String,
  street: String,
  addressCode: String,
  DOB: String,
  phoneNumber: Number,
  email: String,
  password: String,
  createdTimeStamp: String
});

let UserMongoose: Model<User>;
try {
  UserMongoose = mongoose.model<User>("User");
} catch {
  UserMongoose = mongoose.model<User>("User", userSchema);
}

export { UserMongoose };
