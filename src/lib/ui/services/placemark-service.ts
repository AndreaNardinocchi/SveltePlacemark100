import type { Placemark, Session, User } from "../types/placemark-types";
// import type Category from "../../../routes/category/Category.svelte";
import type { Category } from "../types/placemark-types";
import { userStore } from "$lib/models/mongo/user-store";
import { categoryMongoStore } from "$lib/models/mongo/category-store";
import { CategoryMongoose } from "$lib/models/mongo/category";
import { PlacemarkMongoose } from "$lib/models/mongo/placemark";
// import { goto } from "$app/navigation";
// import { category, currentCategories, currentPlacemarks, loggedInUser } from "$lib/runes.svelte";
// import { computeByCountry, computeByVisited } from "./placemark-utils";

// axios.defaults.withCredentials = true;

export const placemarkService = {
  async signup(user: User): Promise<boolean> {
    try {
      const newUser = await userStore.add(user);
      return !!newUser;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async login(email: string, password: string): Promise<Session | null> {
    try {
      const user = await userStore.findBy(email);
      if (user !== null && user.password === password) {
        const session = {
          name: `${user.firstName} ${user.lastName}`,
          token: user._id!.toString(),
          _id: user._id!.toString(),
          email: user.email
        };
        return session;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  // This is the function that enables the user to add a new category
  async addCategory(category: Category) {
    try {
      const newCategory = await categoryMongoStore.addCategory(category);
      return JSON.parse(JSON.stringify(newCategory));
    } catch (error) {
      return false;
    }
  },

  async getAllCategories(): Promise<Category[]> {
    try {
      return await CategoryMongoose.find().lean();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await CategoryMongoose.findById(id).lean();
      if (category) {
        category.placemarks = await PlacemarkMongoose.find({ categoryId: id }).lean();
      }
      return category;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      return null;
    }
  },

  async updateCategory(id: string, updatedCategory: Partial<Category>): Promise<boolean> {
    try {
      const result = await CategoryMongoose.findByIdAndUpdate(id, updatedCategory, { new: true });
      return result !== null;
    } catch (error) {
      console.error("Error updating category:", error);
      return false;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await CategoryMongoose.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  },

  async addPlacemark(categoryId: string, placemark: Placemark): Promise<Placemark | null> {
    try {
      const newPlacemark = new PlacemarkMongoose({ ...placemark, categoryId });
      const savedPlacemark = await newPlacemark.save();
      return savedPlacemark;
    } catch (error) {
      console.error("Error adding placemark:", error);
      return null;
    }
  },

  async getPlacemarksByCategoryId(categoryId: string): Promise<Placemark[]> {
    try {
      return await PlacemarkMongoose.find({ categoryId }).lean();
    } catch (error) {
      console.error("Error fetching placemarks by category ID:", error);
      return [];
    }
  },

  async getPlacemarkById(id: string): Promise<Placemark | null> {
    try {
      return await PlacemarkMongoose.findById(id).lean();
    } catch (error) {
      console.error("Error fetching placemark by ID:", error);
      return null;
    }
  },

  async updatePlacemark(id: string, updatedPlacemark: Partial<Placemark>): Promise<boolean> {
    try {
      const result = await PlacemarkMongoose.findByIdAndUpdate(id, updatedPlacemark, { new: true });
      return result !== null;
    } catch (error) {
      console.error("Error updating placemark:", error);
      return false;
    }
  },

  async deletePlacemark(id: string): Promise<boolean> {
    try {
      const result = await PlacemarkMongoose.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting placemark:", error);
      return false;
    }
  }
};
