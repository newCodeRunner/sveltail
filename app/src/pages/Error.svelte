<script>
  import { getContext } from 'svelte';
  import { Button } from 'sveltail';

  const { router } = getContext('$$app');
  const message = 'Error 404: Not Found';
  const gotoHomePage = () => {
    $router.navigateTo('/');
  };
</script>

<div>{message}</div>
<Button on:click={gotoHomePage} />