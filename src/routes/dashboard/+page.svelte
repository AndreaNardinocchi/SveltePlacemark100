<!-- <script lang="ts">
  import type { ActionResult } from "@sveltejs/kit";
  import ListCategories from "$lib/ui/ListCategories.svelte";
  import { onMount } from "svelte";
  // https://www.npmjs.com/package/svelte-fa
  import { placemarkService } from "$lib/ui/services/placemark-service";
  import { currentCategories, currentDataSets, loggedInUser } from "$lib/runes.svelte";
  import DashboardBanner from "$lib/ui/DashboardBanner.svelte";
  import AddCategory from "$lib/ui/AddCategory.svelte";
  import PlacemarkListCard from "$lib/ui/PlacemarkListCard.svelte";
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import Dashboard from "./Dashboard.svelte";
  import type { PageProps } from "../$types";
  import { refreshCategoryState } from "$lib/ui/services/placemark-utils";
  import type { Category } from "$lib/ui/types/placemark-types";

  // @ts-ignore
  // export const load = async ({ page }) => ({
  //   props: {
  //     key: page.path
  //   }
  // });

  // export let key;
  let { data }: PageProps = $props();

  let pageTitle: any = "Dashboard | PlaceMark"; // This can be dynamic
  let message = $state("Please, select a category!");
  console.log("This is the loggedInUser email: ", loggedInUser.email);
  const handleCategorySuccess = () => {
    return async ({ result }: { result: ActionResult }) => {
      if (result.type === "success") {
        const category = result.data as Category;
        currentCategories.categories.push(category);

        //   refreshCategoryState(currentCategories.categories, currentPlacemarks.placemarks);
        message = `Thanks! You added ${category.title}`;
      }
    };
  };
  // Declare localCategories as an array of Category objects
  // svelte-ignore non_reactive_update
  let localCategories: Category[] = [];

  onMount(async () => {
    const myCategories = await placemarkService.getAllCategories();
    // Filter categories belonging to the logged-in user
    currentCategories.categories = myCategories.filter((cat) => cat.userid === loggedInUser._id);

    console.log("Filtered user categories:", currentCategories.categories);
  });

  // onMount(async () => {
  //   const myCategories = await placemarkService.getAllCategories();

  //   console.log("LoggedInUser:", loggedInUser);

  //   currentCategories.categories = myCategories.filter(
  //     (cat) => cat.userid?.toString() === loggedInUser._id?.toString()
  //   );

  //   console.log("Filtered user categories:", currentCategories.categories);
  // });
</script> -->

<script lang="ts">
  import type { ActionResult } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import { placemarkService } from "$lib/ui/services/placemark-service";
  import { currentCategories, loggedInUser } from "$lib/runes.svelte";
  import { refreshCategoryState } from "$lib/ui/services/placemark-utils";
  import type { Category } from "$lib/ui/types/placemark-types";

  import DashboardBanner from "$lib/ui/DashboardBanner.svelte";
  import ListCategories from "$lib/ui/ListCategories.svelte";
  import AddCategory from "$lib/ui/AddCategory.svelte";
  import PlacemarkListCard from "$lib/ui/PlacemarkListCard.svelte";
  // import Chart from "svelte-frappe-charts";
  import Dashboard from "./Dashboard.svelte";

  export let data: {
    categories: Category[];
  };

  let pageTitle = "Dashboard | PlaceMark";
  let message = "Please, select a category!";

  // Set initial categories from server data
  currentCategories.categories = data.categories;

  const handleCategorySuccess = () => {
    return async ({ result }: { result: ActionResult }) => {
      if (result.type === "success") {
        const category = result.data as Category;
        currentCategories.categories = [...currentCategories.categories, category];
        message = `Thanks! You added ${category.title}`;
      }
    };
  };

  onMount(() => {
    console.log("LoggedInUser:", loggedInUser);
    console.log("Loaded categories:", currentCategories.categories);
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="container">
  <DashboardBanner />
  <section class="section">
    <ListCategories />
    <Dashboard
      categoryList={currentCategories.categories}
      enhanceFn={handleCategorySuccess}
      {message}
    />
  </section>
</div>
