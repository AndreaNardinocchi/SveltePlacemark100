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

import { placemarkService } from "$lib/ui/services/placemark-service";
import type { Session } from "inspector";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // const categoryId = params.id;

  const categories = await placemarkService.getAllCategories();
  const serializedCategories = categories.map((cat) => ({
    ...cat,
    _id: cat._id.toString(),
    userid: cat.userid?.toString?.() ?? cat.userid,
    placemarks: (cat.placemarks || []).map((p) => ({
      ...p,
      _id: p._id.toString(),
      categoryid: p.categoryId?.toString?.() ?? p.categoryId
    }))
  }));

  return {
    categories: serializedCategories
    // placemarks: await placemarkService.getPlacemarksByCategoryId(categoryId)
  };
};
export const actions = {
  category: async ({ request, cookies }) => {
    const cookieStr = cookies.get("placemark-user") as string;
    if (cookieStr) {
      const session = JSON.parse(cookieStr) as Session;
      if (session) {
        const form = await request.formData();
        const category = {
          title: form.get("title") as string,
          notes: form.get("notes") as string,
          image: form.get("image") as string,
          userid: form.get("userid") as string,
          placemarks: [], // correctly typed as an array
          loggedInUser: session._id
        };
        const newCategory = await placemarkService.addCategory(category);
        return newCategory;
      }
    }
  }
};
