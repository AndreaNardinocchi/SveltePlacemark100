
<script lang="ts">
  //import { currentDataSets } from "$lib/runes.svelte"; // or ./stores.ts
  import { derived } from "svelte/store";

  let totalByCountry;
  let totalByVisited;

  $currentDataSets; // subscribe

 

  $: totalByCountry = $currentDataSets.totalByCountry;
  $: totalByVisited = $currentDataSets.totalByVisited;

  import { page } from "$app/stores";
  import { placemarkService } from "$lib/ui/services/placemark-service";
  import { onMount } from "svelte";
  import Category from "./Category.svelte";
  import type { Placemark } from "$lib/ui/types/placemark-types";
  import { currentCategories, currentDataSets, currentPlacemarks, placemark } from "$lib/runes.svelte";
  import CategoryBanner from "$lib/ui/CategoryBanner.svelte";
  import PlacemarkStats from "$lib/ui/PlacemarkStats.svelte";
  import PlacemarkListCard from "$lib/ui/PlacemarkListCard.svelte";
  import ListPlacemarks from "$lib/ui/ListPlacemarks.svelte";
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { refreshCategoryState, refreshPlacemarkMap } from "$lib/ui/services/placemark-utils";
    import type { PageProps } from "./$types.js";
    import type { ActionResult } from "@sveltejs/kit";

  let map: LeafletMap;

  /**
  //  * @type {any}
   */
  let { data }: PageProps = $props();
   refreshCategoryState(data.categories, data.placemarks); 
  let pageTitle: any = "";

  let categoryId: string;

  $: categoryId = $page.params.id;

  // export let data;
  const { category } = data;

  async function getBroswerTitle() {
    // if (typeof window === "undefined") return "PlaceMark";
    // Using the below enables me to retrieve the categoryId
    // https://stackoverflow.com/questions/23690234/getting-last-segment-of-url-in-javascript?
    // https://www.geeksforgeeks.org/how-to-get-url-and-url-parts-in-javascript/
    // const pathParts = window.location.pathname.split("/");
    // let categoryId = pathParts[pathParts.indexOf("category") + 1];
    // let placemarkId = pathParts[pathParts.indexOf("placemark") + 1];
    const category = await placemarkService.getCategoryById(categoryId);
    if (category) {
      // placemarkService.refreshPlacemarksInfo();
      pageTitle = `${category.title} | PlaceMark`; // This can be dynamic
    } else {
      pageTitle = "PlaceMark";
    }
    console.log("PageTitle: ", pageTitle);
    return pageTitle;
  }

  let statsComponent: any;

  function placemarkAdded(placemark: Placemark) {
    console.log("Placemark was added:", placemark);
    const popup = `${placemark.title}, ${placemark.country}, ${placemark.address} | Visited: ${placemark.visited} | Geo: ${placemark.lat} / ${placemark.long}`;
    map.addMarker(parseFloat(placemark.lat), parseFloat(placemark.long), popup);
    map.moveTo(parseFloat(placemark.lat), parseFloat(placemark.long));
    console.log("parseFloat(placemark.lat", placemark.lat);

    // Critical: check that this logs and is defined
    console.log("statsComponent is:", statsComponent);
    if (statsComponent && typeof statsComponent.refresh === "function") {
      console.log("Calling statsComponent.refresh()");
      statsComponent.refresh();
    } else {
      console.warn("statsComponent.refresh not available");
    }
  }

  console.log("Chart - Total by Country", totalByCountry);
  console.log("Chart - Total by Visited", totalByVisited);
  // placemarkService.refreshPlacemarksInfo();

  function placemarkDeleted(placemark: Placemark) {
    console.log("Placemark was deleted:", placemark);

    // Remove marker from map if a reference or identifier exists.
    // Assuming your `LeafletMap` component has a method like `removeMarker`:
    map.removeMarker(parseFloat(placemark.lat), parseFloat(placemark.long));

    // Refresh statistics or any dependent UI components
    if (statsComponent && typeof statsComponent.refresh === "function") {
      console.log("Calling statsComponent.refresh() after deletion");
      statsComponent.refresh();
    } else {
      console.warn("statsComponent.refresh not available");
    }
  }
 
  let message="";
  

  const handlePlacemarkSuccess = () => {
    return async ({ result }: { result: ActionResult }) => {
      if (result.type === "success") {
        const placemark = result.data as Placemark;
        currentPlacemarks.placemarks.push(placemark);
        const popup = `${placemark.title}, ${placemark.country}, ${placemark.address} | Visited: ${placemark.visited} | Geo: ${placemark.lat} / ${placemark.long}`;
    map.addMarker(parseFloat(placemark.lat), parseFloat(placemark.long), popup);
        map.moveTo(parseFloat(placemark.lat), parseFloat(placemark.long));
        refreshCategoryState(currentCategories.categories, currentPlacemarks.placemarks);
        message = `Thanks! You added ${placemark.title}`;
      }
    };
  };
  onMount(async () => {
    await refreshCategoryState(data.categories, data.placemarks);
    await refreshPlacemarkMap(map, placemarkList);
  });
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
              <p>Country Labels: {totalByCountry.labels.join(", ")}</p>
              <!-- <Chart data={totalByCountry} type="bar" /> -->

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
              <!-- <Chart data={totalByVisited} type="pie" /> -->
              {#key totalByVisited}
                <Chart data={totalByVisited} type="pie" />
              {/key}
            </PlacemarkListCard>
          </div>
        </div>
      </div>
      <PlacemarkListCard>
        <ListPlacemarks placemarkDeletedEvent={placemarkDeleted} placemarkList={currentCategories.categories} enhanceFn={handlePlacemarkSuccess} {message}/>
      </PlacemarkListCard>
    {/if}
    <Category placemarkEvent={placemarkAdded} />
  </section>
</div>
