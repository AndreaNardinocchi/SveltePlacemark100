import type { PlacemarService, Category, Placemark, Session, User } from "../types/placemark-types";

import { userStore } from "$lib/models/mongo/user-store";
import { categoryMongoStore } from "$lib/models/mongo/category-store";
import { CategoryMongoose } from "$lib/models/mongo/category";
import { PlacemarkMongoose } from "$lib/models/mongo/placemark";
import { placemarkMongoStore } from "$lib/models/mongo/placemark-store";
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

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await userStore.findOne(id);
      console.log(JSON.parse(JSON.stringify(user)));
      return JSON.parse(JSON.stringify(user));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await userStore.find();
      console.log(JSON.parse(JSON.stringify(users)));
      return JSON.parse(JSON.stringify(users));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await categoryMongoStore.find();
      console.log(JSON.parse(JSON.stringify(categories)));
      return JSON.parse(JSON.stringify(categories));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async getCategoriesByUserId(id: string): Promise<Category[]> {
    try {
      const categories = await categoryMongoStore.findBy(id);
      console.log("Fetched categories:", categories);
      return categories; // No need to stringify/parse if .lean() is used
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
  // This is the function that enables the user to add a new category
  async addCategory(category: Category) {
    try {
      const newCategory = await categoryMongoStore.add(category);
      return JSON.parse(JSON.stringify(newCategory));
    } catch (error) {
      return false;
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    if (!id) return null;

    try {
      const category = await CategoryMongoose.findById(id).lean();
      console.log("This is the category: ", category);

      if (!category) return null;

      const placemarks = await PlacemarkMongoose.find({ categoryId: id }).lean();

      return {
        ...category,
        placemarks
      } as Category;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      return null;
    }
  },

  // async getCategoryById(id: string): Promise<Category | null> {
  //   try {
  //     // const category = await CategoryMongoose.findById(id).lean();
  //     const category = await CategoryMongoose.findOne(id: string).lean();
  //     if (category) {
  //       category.placemarks = await PlacemarkMongoose.find({ categoryId: id }).lean();
  //     }
  //     return category;
  //   } catch (error) {
  //     console.error("Error fetching category by ID:", error);
  //     return null;
  //   }
  // },

  async updateCategory(id: string, updatedCategory: Partial<Category>): Promise<boolean> {
    try {
      const result = await CategoryMongoose.findByIdAndUpdate(id, updatedCategory, { new: true });
      return result !== null;
    } catch (error) {
      console.error("Error updating category:", error);
      return false;
    }
  },

  async deleteCategory(id: string) {
    try {
      console.log("This is the CATEGORYID to delete: ", id);
      const result = await CategoryMongoose.deleteOne({ _id: id }); // Check if deleteOne() is available
      if (result.deletedCount === 0) {
        console.warn(`No category found with id: ${id}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  },

  async addPlacemark(categoryId: string, placemark: Placemark): Promise<Placemark | null> {
    try {
      const newPlacemark = new PlacemarkMongoose({ ...placemark, categoryId });
      const savedPlacemark = await newPlacemark.save();
      return savedPlacemark.toObject() as Placemark;
    } catch (error) {
      console.error("Error adding placemark:", error);
      return null;
    }
  },

  // async getPlacemarksByCategoryId(categoryId: string): Promise<Placemark[]> {
  //   try {
  //     // Retrieve placemarks from the database based on the categoryId
  //     const placemarks = await PlacemarkMongoose.findBy({ categoryId }).lean();
  //     console.log("PLACEMARKS: ", placemarks);
  //     // Ensure 'img' is always an array
  //     return JSON.parse(JSON.stringify(placemarks));
  //   } else {
  //     const placemarks = await placemarkMongoStore.find();
  //     return JSON.parse(JSON.stringify(placemarks));
  //   }
  // } catch (error) {
  //   return [];
  // }

  // async getPlacemarksByCategoryId(categoryId: string): Promise<Placemark[]> {
  //   try {
  //     if (categoryId) {
  //       const placemarks = await placemarkMongoStore.findBy(categoryId);
  //       return JSON.parse(JSON.stringify(placemarks));
  //     } else {
  //       const placemarks = await placemarkMongoStore.find();
  //       return JSON.parse(JSON.stringify(placemarks));
  //     }
  //   } catch (error) {
  //     return [];
  //   }
  // },

  async getPlacemarksByCategoryId(categoryId: string): Promise<Placemark[]> {
    try {
      const placemarks = categoryId
        ? await placemarkMongoStore.findBy(categoryId)
        : await placemarkMongoStore.find();
      return placemarks; // No need to JSON stringify if using .lean()
    } catch (error) {
      console.error("Error in getPlacemarksByCategoryId:", error);
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
