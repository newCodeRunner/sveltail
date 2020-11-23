<script>
  import { Button } from 'sveltail';
  import { getContext } from 'svelte';

  const { router } = getContext('$$app');
  const message = 'Error 404: Not Found';
  const gotoHomePage = () => {
    router.navigateTo('/');
  };
</script>

<div>{message}</div>
<Button on:click={gotoHomePage} />