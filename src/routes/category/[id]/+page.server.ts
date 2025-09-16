// import { placemarkService } from "$lib/ui/services/placemark-service";
// import type { Session } from "inspector";
// import type { PageServerLoad } from "./$types";

// export const load: PageServerLoad = async ({ params }) => {
//   const categoryId = params.id;

//   return {
//     categories: await placemarkService.getAllCategories(),
//     placemarks: await placemarkService.getPlacemarksByCategoryId(categoryId)
//   };
// };

// export const actions = {
//   placemark: async ({ request, cookies }) => {
//     const cookieStr = cookies.get("placemark-user") as string;
//     if (cookieStr) {
//       const session = JSON.parse(cookieStr) as Session;
//       if (session) {
//         const form = await request.formData();
//         const categoryId = form.get("categoryId") as string;

//         const placemark = {
//           title: form.get("title") as string,
//           lat: form.get("lat") as string,
//           long: form.get("long") as string,
//           address: form.get("address") as string,
//           country: form.get("country") as string,
//           phone: form.get("phone") as string,
//           website: form.get("website") as string,
//           visited: form.get("visited") as string,
//           description: form.get("description") as string,
//           userid: session._id,
//           categoryId
//         };

//         const newPlacemark = await placemarkService.addPlacemark(categoryId, placemark);
//         return newPlacemark;
//       }
//     }
//   }
// };

import { placemarkService } from "$lib/ui/services/placemark-service";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const categories = await placemarkService.getAllCategories();
  const category = categories.find((c) => c._id === params.id);
  return {
    category,
    placemarks: await placemarkService.getPlacemarksByCategoryId(params.id)
  };
};
