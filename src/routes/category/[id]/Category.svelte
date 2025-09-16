<!-- <script lang="ts">
  // https://dev.to/maciekgrzybek/animate-on-scroll-with-svel
  // https://www.npmjs.com/package/svelte-inview

  let {
    placemarkEvent = null,
    placemarkDeleteEvent = null,
    placemarkList = [],
    enhanceFn,
    message = $bindable("")
  } = $props();

  import AddPlacemark from "$lib/ui/AddPlacemark.svelte";
  import { placemarkService } from "$lib/ui/services/placemark-service";
  import type { Placemark } from "$lib/ui/types/placemark-types";
  import { goto } from "$app/navigation";
  import DOMPurify from "dompurify";
  import { enhance } from "$app/forms";

  /**
   * This is to sanitize any inputs where needed
   * https://github.com/cure53/DOMPurify?tab=readme-ov-file#running-dompurify-on-the-server
   */
  function sanitizeInput(input: string): string {
    return DOMPurify.sanitize(input); // Use DOMPurify to clean the input
  }

  // Define reactive variables for the form fields
  let title = $state("");
  let lat = $state("");
  let long = $state("");
  let address = $state("");
  let country = $state("");
  let phone = $state("");
  let website = $state("");
  let visited = $state("");
  let img: string[] = [];
  let description = $state("");
  // let message = $state("");

  async function addPlacemark() {
    // Sanitize user input fields before using them
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedLat = sanitizeInput(lat);
    const sanitizedLong = sanitizeInput(long);
    const sanitizedAddress = sanitizeInput(address);
    const sanitizedCountry = sanitizeInput(country);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedWebsite = sanitizeInput(website);
    const sanitizedVisited = sanitizeInput(visited);
    const sanitizedDescription = sanitizeInput(description);

    const placemark: Placemark = {
      title: sanitizedTitle,
      lat: sanitizedLat,
      long: sanitizedLong,
      address: sanitizedAddress,
      country: sanitizedCountry,
      phone: sanitizedPhone,
      website: sanitizedWebsite,
      visited: sanitizedVisited,
      img: img.length > 0 ? img : undefined, // Only send `img` if it has values
      description: sanitizedDescription
      // categoryId: ""
    };

    const url = window.location.pathname;
    const categoryId = url.split("/").pop();

    console.log("This is the categoryId: ", categoryId);

    if (!categoryId) {
      console.warn("No category ID found in URL.");
      return;
    }

    const category = await placemarkService.getCategoryById(categoryId);

    if (!category) {
      console.warn("Invalid category returned.");
      return;
    }

    const result = await placemarkService.addPlacemark(categoryId, placemark);

    if (result) {
      if (placemarkEvent) placemarkEvent(placemark);
      // message = `You added ${placemark.title} in ${placemark.title}. Visited? ${placemark.visited}`;
      message = `You added ${sanitizedTitle} in ${sanitizedCountry}. Visited? ${sanitizedVisited}`;

      console.log(`Placemark added: ${title}, lat: ${lat}, long: ${long}`);
      console.log("Payload being sent:", placemark);
      await goto(`/category/${categoryId}`);
      // Reset form fields after navigation is completed
      title = "";
      lat = "";
      long = "";
      address = "";
      country = "";
      phone = "";
      website = "";
      visited = "";
      description = "";
    } else {
      console.log("Payload being sent:", placemark);
      console.warn("Failed to add placemark.");
    }

    // if (placemarkEvent) placemarkEvent(placemark);
    // // message = `You added ${placemark.title} in ${placemark.title}. Visited? ${placemark.visited}`;
    // message = `You added ${sanitizedTitle} in ${sanitizedCountry}. Visited? ${sanitizedVisited}`;
  }

  function handleDelete(placemark: Placemark) {
    // Your deletion logic here...

    if (placemarkDeleteEvent) {
      placemarkDeleteEvent(placemark); // Notify parent
    }
  }
</script>

<div class="box">
  <form method="POST" action="?/placemark" use:enhance={enhanceFn}>
    <AddPlacemark
      bind:title
      bind:lat
      bind:long
      bind:address
      bind:country
      bind:phone
      bind:website
      bind:visited
      bind:description
    />
  </form>
  {message}
  <div class="columns">
    <div class="column is-3">
      <button onclick={() => addPlacemark()} class="mt-3 button is-info has-text-white">
        Add your placemark
      </button>
    </div>
    <div class="column is-9">
      <p class="has-text-right mt-2">
        *Find your exact placemarks coordinates on
        <a href="https://www.gps-coordinates.net/" target="_blank" class="has-text-grey"
          >https://www.gps-coordinates.net/</a
        >
        <span class="ml-1 icon is-small">
          <i class="fas fa-solid fa-folder-open"></i>
        </span>
      </p>
    </div>
  </div>
</div> -->

<script lang="ts">
  import AddPlacemark from "$lib/ui/AddPlacemark.svelte";
  import { placemarkService } from "$lib/ui/services/placemark-service";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import DOMPurify from "dompurify";
  import { derived } from "svelte/store";

  // Props from parent
  let {
    placemarkEvent = null,
    placemarkDeleteEvent = null,
    placemarkList = [],
    message = $bindable("")
  } = $props();

  // Get categoryId from the route
  const categoryIdStore = derived(page, ($page) => $page.params.id);
  // svelte-ignore non_reactive_update
  let categoryId: string;
  categoryIdStore.subscribe((id) => {
    categoryId = id;
  });

  // Form fields
  let title = $state("");
  let lat = $state("");
  let long = $state("");
  let address = $state("");
  let country = $state("");
  let phone = $state("");
  let website = $state("");
  let visited = $state("");
  let description = $state("");

  // Sanitize inputs
  function sanitizeInput(input: string): string {
    return DOMPurify.sanitize(input);
  }

  // Corrected handleResult function to match the expected signature
  const handleResult = async ({
    formData,
    action,
    submitter,
    cancel
  }: {
    formData: FormData;
    action: URL;
    submitter: HTMLElement | null;
    cancel: () => void;
  }) => {
    // Extract and sanitize data from formData
    const sanitizedData = {
      title: sanitizeInput(formData.get("title") as string),
      lat: sanitizeInput(formData.get("lat") as string),
      long: sanitizeInput(formData.get("long") as string),
      address: sanitizeInput(formData.get("address") as string),
      country: sanitizeInput(formData.get("country") as string),
      phone: sanitizeInput(formData.get("phone") as string),
      website: sanitizeInput(formData.get("website") as string),
      visited: sanitizeInput(formData.get("visited") as string),
      description: sanitizeInput(formData.get("description") as string)
    };

    // Send sanitized data to the server for processing
    const response = await fetch(action.toString(), {
      method: "POST",
      body: formData
    });

    // Handle response (you can set success/failure messages here)
    if (response.ok) {
      const newPlacemark = await response.json();
      if (placemarkEvent) placemarkEvent(newPlacemark);
      message = `You added ${sanitizedData.title} in ${sanitizedData.country}. Visited? ${sanitizedData.visited}`;
    } else {
      message = "There was an issue adding the placemark.";
    }
  };
</script>

<div class="box">
  <form method="POST" action="?/placemark" use:enhance={handleResult}>
    <AddPlacemark
      bind:title
      bind:lat
      bind:long
      bind:address
      bind:country
      bind:phone
      bind:website
      bind:visited
      bind:description
    />

    <!-- Required hidden inputs -->
    <input type="hidden" name="categoryId" value={categoryId} />
    <input type="hidden" name="title" value={sanitizeInput(title)} />
    <input type="hidden" name="lat" value={sanitizeInput(lat)} />
    <input type="hidden" name="long" value={sanitizeInput(long)} />
    <input type="hidden" name="address" value={sanitizeInput(address)} />
    <input type="hidden" name="country" value={sanitizeInput(country)} />
    <input type="hidden" name="phone" value={sanitizeInput(phone)} />
    <input type="hidden" name="website" value={sanitizeInput(website)} />
    <input type="hidden" name="visited" value={sanitizeInput(visited)} />
    <input type="hidden" name="description" value={sanitizeInput(description)} />

    <div class="columns">
      <div class="column is-3">
        <button type="submit" class="mt-3 button is-info has-text-white">
          Add your placemark
        </button>
      </div>
      <div class="column is-9">
        <p class="has-text-right mt-2">
          *Find your exact placemarks coordinates on
          <a href="https://www.gps-coordinates.net/" target="_blank" class="has-text-grey">
            https://www.gps-coordinates.net/
          </a>
          <span class="ml-1 icon is-small">
            <i class="fas fa-solid fa-folder-open"></i>
          </span>
        </p>
      </div>
    </div>
  </form>

  {#if message}
    <p class="has-text-success mt-3">{message}</p>
  {/if}
</div>
