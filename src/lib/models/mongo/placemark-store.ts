import { PlacemarkMongoose } from "./placemark.js";
import type { Placemark } from "$lib/ui/types/placemark-types";

export const placemarkMongoStore = {
  async getAllPlacemarks(): Promise<Placemark[]> {
    return await PlacemarkMongoose.find().lean();
  },

  async addPlacemark(
    categoryId: string,
    placemark: Omit<Placemark, "_id">
  ): Promise<Placemark | null> {
    try {
      const newPlacemark = new PlacemarkMongoose({ ...placemark, categoryid: categoryId });
      const saved = await newPlacemark.save();
      return this.getPlacemarkById(saved._id.toString());
    } catch (error) {
      console.error("Error adding placemark:", error);
      throw error;
    }
  },

  async getPlacemarksByCategoryId(categoryId: string): Promise<Placemark[]> {
    const placemarks = await PlacemarkMongoose.find({ categoryId }).lean();
    return placemarks.map((p) => ({
      ...p,
      img: Array.isArray(p.img) ? p.img : []
    }));
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
