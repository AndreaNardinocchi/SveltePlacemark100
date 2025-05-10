import type { Session } from "$lib/ui/types/placemark-types";
import type { LayoutServerData } from "./$types";

export const load: LayoutServerData = ({ cookies }) => {
  const cookieStr = cookies.get("placemark-user") as string;
  if (cookieStr) {
    const session = JSON.parse(cookieStr) as Session;
    return {
      session: session
    };
  }
};
