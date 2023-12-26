<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
</script>

<div class="container mx-auto pt-5">
	<form
		action="?/login"
		method="post"
		use:enhance={() => {
			return async ({ result, action, update }) => {
				console.info(result, action, update);
        await invalidateAll();
        goto('/login')
			};
		}}
	>
		<div class="flex">
			<div>Username</div>
			<div>
				<input type="text" name="username" class="text-zinc-800 px-2 py-1 rounded" />
			</div>
		</div>
		<div class="flex">
			<div>Password</div>
			<div>
				<input type="password" name="password" class="text-zinc-800 px-2 py-1 rounded" />
			</div>
		</div>
		<div>
			<button>Submit</button>
		</div>
	</form>
</div>
