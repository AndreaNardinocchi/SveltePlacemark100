<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { clearCategoryState } from "$lib/ui/services/placemark-utils";
  clearCategoryState();
  if (browser)  goto("/");
</script>
