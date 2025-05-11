<script lang="ts">
  import Account from "./Account.svelte";
  export let data;

  let pageTitle = "Your Account Details | PlaceMark";
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="container">
  <Account user={data.user} />
</div>
