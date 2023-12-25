<script lang="ts">

	import { enhance } from "$app/forms";

</script>

<div class="container mx-auto pt-5">
  <form action="?/login" method="post" use:enhance>
    <div class="flex">
      <div>
        Username
      </div>
      <div>
        <input type="text" name="username">
      </div>
    </div>
    <div class="flex">
      <div>
        Password
      </div>
      <div>
        <input type="password" name="password">
      </div>
    </div>
    <div>
      <button>Submit</button>
    </div>
  </form>
</div>