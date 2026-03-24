<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();
</script>

<div class="container mx-auto pt-5 max-w-sm">
  <h1 class="text-2xl font-bold mb-6">Sign in</h1>

  {#if form?.message}
    <p class="text-red-500 mb-4">{form.message}</p>
  {/if}

  <form method="post" action="?/login" use:enhance>
    <div class="flex flex-col gap-1 mb-4">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        class="text-zinc-800 px-2 py-1 rounded border"
        required
      />
    </div>
    <div class="flex flex-col gap-1 mb-6">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        class="text-zinc-800 px-2 py-1 rounded border"
        required
      />
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded w-full">
      Sign in
    </button>
  </form>
</div>
