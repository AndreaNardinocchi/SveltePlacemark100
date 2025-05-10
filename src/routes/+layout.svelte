<script lang="ts">
  // https://www.npmjs.com/package/svelte-fa
  import { loggedInUser } from "$lib/runes.svelte";
  import Footer from "$lib/Footer.svelte";
  import Header from "$lib/Header.svelte";
  import WelcomeMenu from "$lib/ui/WelcomeMenu.svelte";
  import { onMount } from "svelte";
  import { placemarkService } from "$lib/ui/services/placemark-service";

  // @ts-ignore
  export const load = async ({ page }) => ({
    props: {
      key: page.path
    }
  });

  /**
   * @type {any}
   */
  //export let key: any;

  let pageTitle: any = "Welcome to PlaceMark"; // This can be dynamic
  // onMount(async () => {
  //   await placemarkService.restoreSession();
  // });
  export let data: any;
  if (data.session) {
    loggedInUser.email = data.session.email;
    loggedInUser.name = data.session.name;
    loggedInUser.token = data.session.token;
    loggedInUser._id = data.session._id;
  } else {
    loggedInUser.email = "";
    loggedInUser.name = "";
    loggedInUser.token = "";
    loggedInUser._id = "";
  }

  console.log("LoggedInUser: ", loggedInUser.email);
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="container">
  {#if loggedInUser.email}
    <Header />
  {:else}
    <WelcomeMenu />
  {/if}
  <slot />
</div>
<Footer />
