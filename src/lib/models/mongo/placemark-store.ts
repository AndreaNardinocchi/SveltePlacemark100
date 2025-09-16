import { PlacemarkMongoose } from "./placemark.js";
import type { Placemark } from "$lib/ui/types/placemark-types";
import mongoose from "mongoose";

export const placemarkMongoStore = {
  async find(): Promise<Placemark[]> {
    const placemarks = await PlacemarkMongoose.find().lean();
    console.log("PLACEMARKS: ", placemarks);
    return placemarks;
  },

  async add(categoryId: string, placemark: Omit<Placemark, "_id">): Promise<Placemark | null> {
    const newPlacemark = new PlacemarkMongoose({ ...placemark });
    await newPlacemark.save();
    const populatedPlacemark = await PlacemarkMongoose.findById(newPlacemark._id)
      .populate("placemark")
      .populate("category")
      .lean();
    console.log("These are populatedPlacemarks: ", populatedPlacemark);
    return populatedPlacemark;
  },

  async delete() {
    await PlacemarkMongoose.deleteMany({});
  },

  // async findBy(categoryId: string): Promise<Placemark[]> {
  //   // Retrieve placemarks from the database based on the categoryId
  //   const placemarks = await PlacemarkMongoose.find({ categoryId }).lean();
  //   console.log("PLACEMARKS: ", placemarks);

  //   // Ensure the 'img' field is always an array
  //   return placemarks.map((p) => ({
  //     ...p,
  //     img: Array.isArray(p.img) ? p.img : [] // If img is not an array, make it an empty array
  //   }));
  // },

  // async findBy(categoryId: string): Promise<Placemark[]> {
  //   const placemarks = await PlacemarkMongoose.find({ categoryId: categoryId })
  //     .populate("placemark")
  //     .populate("category")
  //     .lean();

  //   console.log("PLACEMARKS: ", placemarks);
  //   return placemarks;
  // },

  async findBy(categoryId: string): Promise<Placemark[]> {
    try {
      const objectId = new mongoose.Types.ObjectId(categoryId);
      const placemarks = await PlacemarkMongoose.find({ category: objectId }) // ✅ use "category" not "categoryId"
        .populate("category")
        .lean();
      console.log("PLACEMARKS: ", placemarks);
      return placemarks;
    } catch (error) {
      console.error("Error in findBy:", error);
      return [];
    }
  },

  async getPlacemarkById(id: string): Promise<Placemark | null> {
    if (!id) return null;

    const placemark = await PlacemarkMongoose.findById(id).lean();
    if (placemark) {
      placemark.img = Array.isArray(placemark.img) ? placemark.img : [];
    }
    return placemark;
  },

  async deletePlacemark(id: string): Promise<void> {
    try {
      await PlacemarkMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.error("Invalid placemark ID:", id);
    }
  },

  async deleteAllPlacemarks(): Promise<void> {
    await PlacemarkMongoose.deleteMany({});
  },

  async updatePlacemark(updated: Partial<Placemark> & { _id: string }): Promise<void> {
    const placemark = await PlacemarkMongoose.findById(updated._id);
    if (!placemark) return;

    if (updated.title !== undefined) placemark.title = updated.title;
    if (updated.lat !== undefined) placemark.lat = updated.lat;
    if (updated.long !== undefined) placemark.long = updated.long;
    if (updated.address !== undefined) placemark.address = updated.address;
    if (updated.country !== undefined) placemark.country = updated.country;
    if (updated.phone !== undefined) placemark.phone = updated.phone;
    if (updated.website !== undefined) placemark.website = updated.website;
    if (updated.visited !== undefined) placemark.visited = updated.visited;
    if (updated.description !== undefined) placemark.description = updated.description;
    if (updated.img !== undefined) placemark.img = updated.img;

    await placemark.save();
  }
};
