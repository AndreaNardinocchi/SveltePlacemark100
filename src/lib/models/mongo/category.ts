import type { Category } from "$lib/ui/types/placemark-types";
import mongoose, { Model } from "mongoose";

const categorySchema = new mongoose.Schema<Category>({
  title: String,
  notes: String,
  image: String,
  placemarks: Array,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

let CategoryMongoose: Model<Category>;
try {
  CategoryMongoose = mongoose.model<Category>("Category");
} catch {
  CategoryMongoose = mongoose.model<Category>("Category", categorySchema);
}

export { CategoryMongoose };
