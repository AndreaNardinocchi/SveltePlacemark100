import type { Category } from "$lib/ui/types/placemark-types";
import { CategoryMongoose } from "./category";
import { placemarkMongoStore } from "./placemark-store";

export const categoryMongoStore = {
  async find(): Promise<Category[]> {
    const categories = await CategoryMongoose.find().lean();
    console.log("Mongoose categories:", categories);
    return categories;
  },

  async findOne(id: string): Promise<Category | null> {
    if (!id) return null;

    const category = await CategoryMongoose.findById(id).lean();
    if (category) {
      category.placemarks = await placemarkMongoStore.getPlacemarksByCategoryId(
        category._id as string
      );
    }

    return category;
  },

  // async addCategory(category: Omit<Category, "_id">): Promise<Category | null> {
  //   const newCategory = new CategoryMongoose(category);
  //   const saved = await newCategory.save();
  //   return this.getCategoryById(saved._id.toString());
  // },

  async findBy(userid: string): Promise<Category[]> {
    const categories = await CategoryMongoose.find({ userid }).lean();
    console.log("Mongoose categories:", categories);
    return categories;
  },

  async deleteCategoryById(id: string): Promise<void> {
    try {
      await CategoryMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.error("Invalid category ID:", id);
    }
  },

  async deleteAllCategories(): Promise<void> {
    await CategoryMongoose.deleteMany({});
  },

  async updateCategory(updatedCategory: Partial<Category> & { _id: string }): Promise<void> {
    const category = await CategoryMongoose.findById(updatedCategory._id);
    if (!category) return;

    if (updatedCategory.title !== undefined) category.title = updatedCategory.title;
    if (updatedCategory.image !== undefined) category.image = updatedCategory.image;
    if (updatedCategory.notes !== undefined) category.notes = updatedCategory.notes;

    await category.save();
  }
};

// import type { Category } from "$lib/ui/types/placemark-types";
// import { CategoryMongoose } from "./category";
// import { placemarkMongoStore } from "./placemark-store";

// function sanitizeCategory(category: any): Category {
//   return {
//     ...category,
//     _id: category._id.toString(),
//     userid: category.userid?.toString?.() ?? "",
//     placemarks: category.placemarks ?? []
//   };
// }

// export const categoryMongoStore = {
//   async getAllCategories(): Promise<Category[]> {
//     const categories = await CategoryMongoose.find().lean();
//     return categories.map(sanitizeCategory);
//   },

//   async getCategoryById(id: string): Promise<Category | null> {
//     if (!id) return null;

//     const category = await CategoryMongoose.findById(id).lean();
//     if (!category) return null;

//     const placemarks = await placemarkMongoStore.getPlacemarksByCategoryId(category._id.toString());
//     return sanitizeCategory({ ...category, placemarks });
//   },

//   async addCategory(category: Omit<Category, "_id">): Promise<Category | null> {
//     const newCategory = new CategoryMongoose(category);
//     const saved = await newCategory.save();
//     return this.getCategoryById(saved._id.toString());
//   },

//   async getUserCategories(userId: string): Promise<Category[]> {
//     const categories = await CategoryMongoose.find({ userid: userId }).lean();
//     return categories.map(sanitizeCategory);
//   },

//   async deleteCategoryById(id: string): Promise<void> {
//     try {
//       await CategoryMongoose.deleteOne({ _id: id });
//     } catch (error) {
//       console.error("Invalid category ID:", id);
//     }
//   },

//   async deleteAllCategories(): Promise<void> {
//     await CategoryMongoose.deleteMany({});
//   },

//   async updateCategory(updatedCategory: Partial<Category> & { _id: string }): Promise<void> {
//     const category = await CategoryMongoose.findById(updatedCategory._id);
//     if (!category) return;

//     if (updatedCategory.title !== undefined) category.title = updatedCategory.title;
//     if (updatedCategory.image !== undefined) category.image = updatedCategory.image;
//     if (updatedCategory.notes !== undefined) category.notes = updatedCategory.notes;

//     await category.save();
//   }
// };
