<script lang="ts">
	import { page } from '$app/state';
</script>

<nav class="bg-zinc-900 p-4">
	<div class="container mx-auto flex justify-between">
		<div>Salabridge Family</div>

		<div class="flex gap-2">
			<form>
				{#if page.data?.user}
					<button type="submit" formmethod="post" formaction="/logout"> Logout </button>
					{page.data.user.name}
				{:else}
					<button class="bg-primary-500 btn" formmethod="get" formaction="/login"> Login </button>
				{/if}
			</form>
		</div>
	</div>
</nav>
