<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Toggle from '$lib/components/toggle/toggle.svelte';
	import { BookmarkIcon, CameraOffIcon, CameraIcon } from 'lucide-svelte';
</script>

<section class="min-h-56 bg-blue-500"></section>

<div class="flex gap-2 justify-center flex-grow min-h-dvh bg-zinc-100 text-zinc-800">
	<section class="w-1/6 p-2">
		<Header tag="h2">Ingredients</Header>
		<ol>
			<li>1 lb. boneless chicken breast</li>
			<li>8 oz. bacon</li>
			<li>Panco breadcrumbs</li>
		</ol>
	</section>
	<section class="w-4/6 rounded-lg md:-mt-28 bg-zinc-100 p-4 border border-zinc-700">
		<Header>
			{#snippet actions()}
				<button title="bookmark">
					<BookmarkIcon size="1em" />
				</button>
			{/snippet}

			Chicken Bacon Ranch
			<small> (1hr 15min) </small>
		</Header>
		<div class="text-xl mb-4">Tagline or something</div>

		<section>
			<Header tag="h3" color="custom">
				Preparation
				<small> (15 min) </small>
			</Header>
			<ol class="list-decimal list-inside">
				<li>Remove any excess fat from the chicken</li>
				<li>Place chicken in container or bag with enough ranch to thoroughly coat the chicken.</li>
				<li>
					Marinate chicken for as long as possible &ndash; up to overnight &ndash; but for minimum
					of 2 (two) hours.
				</li>
				<li>Cook 8 oz. of bacon and cut into squares or flakes.</li>
			</ol>
		</section>

		<section class="steps mt-4">
			<header class="step">
				<Header tag="h3" color="custom">
					{#snippet actions()}
						<Toggle selected="on" onchange={(e) => console.info(e)}>
							{#snippet on()}
								<CameraIcon size="1em" />
							{/snippet}
							{#snippet off()}
								<CameraOffIcon size="1em" />
							{/snippet}
						</Toggle>
					{/snippet}
					Cooking
				</Header>
			</header>
			<ol class="grid grid-cols-[1fr_8fr_minmax(0,250px)]">
				<li class="grid col-span-3 grid-cols-subgrid gap-2">
					<div>Lorem, ipsum.</div>
					<div>Distinctio, ad.</div>
					<div>
						<img src="https://placehold.it/400x310" class="w-full h-auto" alt="placeholder" />
					</div>
				</li>
				<li class="grid col-span-3 grid-cols-subgrid">
					<div>Lorem, ipsum.</div>
					<div>Distinctio, ad.</div>
					<div>
						<img src="https://placehold.it/400x310" class="w-full h-auto" alt="placeholder" />
					</div>
				</li>
			</ol>
		</section>
	</section>
	<section class="w-1/6 p-2">
		<Header tag="h2">Tags</Header>
		<div class="flex flex-wrap gap-2">
			<div class="bg-emerald-300 text-zinc-900 p-1 rounded">Chicken</div>
			<div class="bg-emerald-300 text-zinc-900 p-1 rounded">Bacon</div>
			<div class="bg-emerald-300 text-zinc-900 p-1 rounded">Breadcrumbs</div>
			<div class="bg-emerald-300 text-zinc-900 p-1 rounded">Panko</div>
			<div class="bg-emerald-300 text-zinc-900 p-1 rounded">Something</div>
			<div class="bg-emerald-300 text-zinc-900 p-1 rounded">Something</div>
			<div class="bg-emerald-300 text-zinc-900 p-1 rounded">Something</div>
		</div>
	</section>
</div>
