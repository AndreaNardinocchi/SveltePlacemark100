import type { Placemark } from "$lib/ui/types/placemark-types";
import mongoose, { Model, Schema } from "mongoose";

const placemarkSchema = new mongoose.Schema<Placemark>({
  title: String,
  lat: String,
  long: String,
  address: String,
  country: String,
  phone: String,
  website: String,
  visited: String,
  description: String,
  // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
  img: {
    type: [String],
    default: undefined,
    required: false
  },
  categoryid: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
});

let PlacemarkMongoose: Model<Placemark>;
try {
  PlacemarkMongoose = mongoose.model<Placemark>("Placemark");
} catch {
  PlacemarkMongoose = mongoose.model<Placemark>("PlacemarkMongoose", placemarkSchema);
}

export { PlacemarkMongoose };
