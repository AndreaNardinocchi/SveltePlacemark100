<script lang="ts">
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { page } from "$app/stores";
  import DOMPurify from "dompurify";

  import { placemarkService } from "$lib/ui/services/placemark-service";
  import { refreshCategoryState, refreshPlacemarkMap } from "$lib/ui/services/placemark-utils";

  import { currentCategories, currentDataSets, currentPlacemarks } from "$lib/runes.svelte";

  import Category from "./Category.svelte";
  import CategoryBanner from "$lib/ui/CategoryBanner.svelte";
  import PlacemarkStats from "$lib/ui/PlacemarkStats.svelte";
  import PlacemarkListCard from "$lib/ui/PlacemarkListCard.svelte";
  import ListPlacemarks from "$lib/ui/ListPlacemarks.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import Chart from "svelte-frappe-charts";

  import type { Placemark } from "$lib/ui/types/placemark-types";
  // import type { ActionResult, SubmitEnhancement } from "@sveltejs/kit";

  // export let data: {
  //   categories: Category[];
  //   placemarks: Placemark[];
  // };

  let { data }: any = $props();

  // Reactive categoryId from URL params
  //$: categoryId = $page.params.id;

  const totalByCountry = derived(currentDataSets, ($data) => $data.totalByCountry);
  const totalByVisited = derived(currentDataSets, ($data) => $data.totalByVisited);

  let map: LeafletMap;
  let pageTitle = "";
  let message = "";
  let statsComponent: any;

  // Page Title
  const category = data.category; //await placemarkService.getCategoryById();
  console.log("This is the CATEGORY: ", category, category.title);

  pageTitle = `${category.title} | PlaceMark`;

  // function placemarkAdded(placemark: Placemark) {
  console.log("Placemark added:", data.placemarks);
  // const popup = `${placemark.title}, ${placemark.country}, ${placemark.address} | Visited: ${placemark.visited} | Geo: ${placemark.lat} / ${placemark.long}`;
  // map.addMarker(parseFloat(placemark.lat), parseFloat(placemark.long), popup);
  // map.moveTo(parseFloat(placemark.lat), parseFloat(placemark.long));
  // statsComponent?.refresh?.();
  // }

  function placemarkDeleted(placemark: Placemark) {
    console.log("Placemark deleted:", placemark);
    map.removeMarker(parseFloat(placemark.lat), parseFloat(placemark.long));
    statsComponent?.refresh?.();
  }

  // const handlePlacemarkSuccess: SubmitEnhancement = async ({ result }) => {
  //   if (result.type === "success") {
  //     const placemark = result.data as Placemark;
  //     currentPlacemarks.placemarks.push(placemark);
  //     const popup = `${placemark.title}, ${placemark.country}, ${placemark.address} | Visited: ${placemark.visited} | Geo: ${placemark.lat} / ${placemark.long}`;
  //     map.addMarker(parseFloat(placemark.lat), parseFloat(placemark.long), popup);
  //     map.moveTo(parseFloat(placemark.lat), parseFloat(placemark.long));
  //     refreshCategoryState(currentCategories.categories, currentPlacemarks.placemarks);
  //     message = `Thanks! You added ${placemark.title}`;
  //   } else if (result.type === "error") {
  //     message = "Something went wrong.";
  //   }
  // };

  // onMount(async () => {
  //   await refreshCategoryState(data.categories, data.placemarks);
  //   await refreshPlacemarkMap(map, data.placemarks);

  // });
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="container">
  <section class="section mt-6">
    {#if currentCategories.categories.length > 0}
      <CategoryBanner />
      <PlacemarkStats bind:this={statsComponent} />
      <PlacemarkListCard>
        <LeafletMap height={40} bind:this={map} />
      </PlacemarkListCard>

      <div class="box has-background-white">
        <div class="columns">
          <div class="column">
            <PlacemarkListCard>
              <p class="has-text-centered subtitle has-text-weight-bold is-5">Total by Country</p>
              {#key totalByCountry}
                <Chart data={totalByCountry} type="bar" />
              {/key}
            </PlacemarkListCard>
          </div>

          <div class="column has-text-centered">
            <PlacemarkListCard>
              <p class="has-text-centered subtitle has-text-weight-bold is-5">
                Total by Visited/Not Visited
              </p>
              {#key totalByVisited}
                <Chart data={totalByVisited} type="pie" />
              {/key}
            </PlacemarkListCard>
          </div>
        </div>
      </div>
      <!-- placemarkDeletedEvent={placemarkDeleted} -->
      <!-- placemarkList={currentCategories.categories}
      enhanceFn={handlePlacemarkSuccess} -->
      {message}
      <PlacemarkListCard>
        <ListPlacemarks placemarks={data.placemarks} />
      </PlacemarkListCard>
    {/if}
    <!-- placemarkEvent={placemarkAdded}  -->
    <Category />
  </section>
</div>
