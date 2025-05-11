// src/routes/account/+page.server.ts
// import { placemarkService } from "$lib/ui/services/placemark-service";
// import type { PageServerLoad } from "./$types";

// export const load: PageServerLoad = async ({ cookies }) => {
//   const cookieStr = cookies.get("placemark-user");
//   if (!cookieStr) {
//     return { user: null };
//   }

//   const session = JSON.parse(cookieStr);
//   const user = await placemarkService.getUserById(session._id);

//   return {
//     user: {
//       ...user,
//       _id: user._id.toString()
//     }
//   };
// };

import { placemarkService } from "$lib/ui/services/placemark-service";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const cookieStr = cookies.get("placemark-user");
  if (!cookieStr) {
    return { user: null };
    // return { user: null, categories: [] };
  }

  const session = JSON.parse(cookieStr);
  const user = await placemarkService.getUserById(session._id);
  // const categories = await placemarkService.getAllCategories();

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

  return {
    user: {
      ...user,
      _id: user._id.toString()
    }
    // categories: serializedCategories
  };
};
