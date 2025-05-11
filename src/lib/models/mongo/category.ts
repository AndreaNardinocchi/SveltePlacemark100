// import type { Category } from "$lib/ui/types/placemark-types";
// import mongoose, { Model } from "mongoose";

// const categorySchema = new mongoose.Schema<Category>({
//      title: String,
//      notes: String,
//      image: String,
//      placemarks: Array,
//     //  userid: String
//    userid: {
//        type: mongoose.Schema.Types.ObjectId,
//        ref: "User"
//    }

// });

// let CategoryMongoose: Model<Category>;

// try {
//   CategoryMongoose = mongoose.model<Category>("Category");
// } catch {
//   CategoryMongoose = mongoose.model<Category>("Category", categorySchema);
// }

// export { CategoryMongoose };

import type { Category } from "$lib/ui/types/placemark-types";
import type { Document, Model } from "mongoose";
import mongoose from "mongoose";

type CategoryDoc = Category & Document;

const categorySchema = new mongoose.Schema<CategoryDoc>({
  title: String,
  notes: String,
  image: String,
  // id: String,
  // placemarks: Array, // Adjust the type as necessary
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

let CategoryMongoose: Model<CategoryDoc>;
try {
  CategoryMongoose = mongoose.model<CategoryDoc>("Category");
} catch {
  CategoryMongoose = mongoose.model<CategoryDoc>("Category", categorySchema);
}

export { CategoryMongoose };
