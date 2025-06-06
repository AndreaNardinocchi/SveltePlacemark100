import type { User } from "$lib/ui/types/placemark-types.js";
import { UserMongoose } from "./user.js";

export const userStore = {
  async find(): Promise<User[]> {
    const users = await UserMongoose.find().lean();
    console.log("Mongoose user:", users);
    return users;
  },

  async findOne(id: string): Promise<User | null> {
    if (id) {
      const user = await UserMongoose.findOne({ _id: id }).lean();

      // await UserMongoose.findOne({ _id: id }).lean();
      console.log("This is the user by id: ", user);
      return user;
    }
    return null;
  },

  async add(user: User): Promise<User | null> {
    const newUser = new UserMongoose(user);
    const userObj = await newUser.save();
    return userObj;
  },

  async findBy(email: string): Promise<User | null> {
    const user = await UserMongoose.findOne({ email: email }).lean();
    console.log("user by email:", user);
    console.log("UserMongoose model:", UserMongoose);
    return user;
  },

  async deleteOne(id: string) {
    try {
      await UserMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async delete() {
    await UserMongoose.deleteMany({});
  }
};
