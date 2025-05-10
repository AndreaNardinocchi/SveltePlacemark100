<script lang="ts">
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

  /**
   * @type {any}
   */
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

  onMount(async () => {
    const myCategories = await placemarkService.getAllCategories();
    // await refreshCategoryState(data.categories, data.placemarks);
    // Filter categories belonging to the logged-in user
    currentCategories.categories = myCategories.filter((cat) => cat.userid === loggedInUser._id);

    console.log("Filtered user categories:", currentCategories.categories);
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
