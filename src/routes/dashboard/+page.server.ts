// import { placemarkService } from "$lib/ui/services/placemark-service";
// import type { Session } from "$lib/ui/types/placemark-types";
// // import type { Session } from "$lib/ui/types/placemark-types";
// import type { PageServerLoad } from "./$types";

// export const load: PageServerLoad = async () => {
//   // const categoryId = params.id;

//   return {
//     categories: await placemarkService.getAllCategories()
//     // placemarks: await placemarkService.getPlacemarksByCategoryId(categoryId)
//   };
// };

// export const actions = {
//   category: async ({ request, cookies }) => {
//     const cookieStr = cookies.get("placemark-user") as string;
//     if (cookieStr) {
//       const session = JSON.parse(cookieStr) as Session;
//       if (session) {
//         const form = await request.formData();
//         const category = {
//           title: form.get("title") as string,
//           notes: form.get("notes") as string,
//           image: form.get("image") as string,
//           userid: form.get("userid") as string,
//           placemarks: [], // correctly typed as an array
//           loggedInUser: session._id
//         };
//         const newCategory = await placemarkService.addCategory(category);
//         return newCategory;
//       }
//     }
//   }
// };

// import { placemarkService } from "$lib/ui/services/placemark-service";
// import type { PageServerLoad, Actions } from "./$types";

// export const load: PageServerLoad = async ({ cookies }) => {
//   const cookieStr = cookies.get("placemark-user");
//   if (!cookieStr) {
//     return { categories: [] };
//   }

//   // const categories = await placemarkService.getAllCategories();

//   const categories = await placemarkService.getCategoriesByUserId(userId);

//   const serializedCategories = categories.map((cat) => ({
//     ...cat,
//     _id: cat._id.toString(),
//     userid: cat.userid?.toString?.() ?? cat.userid,
//     placemarks: (cat.placemarks || []).map((p) => ({
//       ...p,
//       _id: p._id.toString(),
//       categoryid: p.categoryId?.toString?.() ?? p.categoryId
//     }))
//   }));

//   return {
//     categories: serializedCategories
//   };
// };

// export const actions: Actions = {
//   category: async ({ request, cookies }) => {
//     const cookieStr = cookies.get("placemark-user");
//     if (!cookieStr) return;

//     const session = JSON.parse(cookieStr);
//     const form = await request.formData();

//     const category = {
//       title: form.get("title") as string,
//       notes: form.get("notes") as string,
//       image: form.get("image") as string,
//       userid: session._id,
//       placemarks: []
//     };

//     const newCategory = await placemarkService.addCategory(category);
//     return { success: true, category: newCategory };
//   }
// };

import { placemarkService } from "$lib/ui/services/placemark-service";
import type { PageServerLoad, Actions } from "./$types";

// Utility function to get userId from cookie
const getUserIdFromCookie = (cookies) => {
  const cookieStr = cookies.get("placemark-user");
  if (!cookieStr) return null;
  const session = JSON.parse(cookieStr);
  return session._id;
};

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = getUserIdFromCookie(cookies);
  if (!userId) {
    return { categories: [] }; // No user, return empty categories
  }

  try {
    const categories = await placemarkService.getCategoriesByUserId(userId);
    console.log("These are the CATEGORIES: ", categories);

    const serializedCategories = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      userid: cat.userid?.toString() ?? cat.userid,
      placemarks: (cat.placemarks || []).map((p) => ({
        ...p,
        _id: p._id.toString(),
        categoryid: p.categoryId?.toString() ?? p.categoryId
      }))
    }));

    return {
      categories: serializedCategories
    };
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return { categories: [] }; // Return empty categories on error
  }
};

export const actions: Actions = {
  // This is the action name that matches your form's POST request
  category: async ({ request, cookies }) => {
    const userId = getUserIdFromCookie(cookies);
    if (!userId) return;

    try {
      const form = await request.formData();

      // Creating the category object without the _id field.
      const category = {
        title: form.get("title") as string,
        notes: form.get("notes") as string,
        image: form.get("image") as string,
        userid: userId,
        placemarks: []
      };

      // Mongoose will automatically assign an _id when saving.
      const newCategory = await placemarkService.addCategory(category);
      return { success: true, category: newCategory };
    } catch (error) {
      console.error("Error adding category:", error);
      return { success: false, error: "Failed to add category" };
    }
  }
};
