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

    try {
      const category = await CategoryMongoose.findById(id).lean();
      console.log("This is the category: ", category);

      if (!category) return null;

      // Ensure placemarks are populated safely
      const placemarks = await placemarkMongoStore.find(category._id.toString());

      return {
        ...category,
        placemarks
      } as Category;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      return null;
    }
  },

  // async findOne(id: string): Promise<Category | null> {
  //   if (!id) return null;

  //   const category = await CategoryMongoose.findById(id).lean();
  //   if (category) {
  //     category.placemarks = await placemarkMongoStore.find(
  //       category._id as string
  //     );
  //   }

  //   return category;
  // },

  // async addCategory(category: Omit<Category, "_id">): Promise<Category | null> {
  //   const newCategory = new CategoryMongoose(category);
  //   const saved = await newCategory.save();
  //   return this.getCategoryById(saved._id.toString());
  // },

  async add(category: Omit<Category, "_id">): Promise<Category | null> {
    const newCategory = new CategoryMongoose({ ...category });
    await newCategory.save();
    const populatedCategory = await CategoryMongoose.findById(newCategory._id)
      .populate("categories")
      .lean();
    return populatedCategory;
  },

  async findBy(userid: string): Promise<Category[]> {
    const categories = await CategoryMongoose.find({ userid }).lean();
    console.log("Mongoose categories by user id:", categories);
    return categories;
  },

  async deleteOne(id: string) {
    try {
      console.log("ID to delete: ", id);
      const result = await CategoryMongoose.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        console.warn(`No category found with id: ${id}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      return false;
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
