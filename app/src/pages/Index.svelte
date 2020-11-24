<script>
  import { Button } from 'sveltail';
  import { getContext } from 'svelte';
  import Examples from '../components/Examples.svelte';

  const { router } = getContext('$$app');

  const message = 'Welcome to Sveltail';
  const gotoErrorPage = () => {
    router.navigateTo('/*');
  };
</script>

<h1>{message}</h1>
<Button on:click={gotoErrorPage} />
<h2>Examples</h2>
<p>Please see the examples below to see the UI in action.</p>
<Examples />