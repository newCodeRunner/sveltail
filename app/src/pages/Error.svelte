<script>
  import { Button, router } from 'sveltail';

  const message = 'Error 404: Not Found';
  const gotoHomePage = () => {
    $router.navigateTo('/');
  };
</script>

<div>{message}</div>
<Button on:click={gotoHomePage} />