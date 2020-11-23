<script>
  import { getContext } from 'svelte';

  // Global
  const { helpers } = getContext('$$app');
  const props = {
    img: helpers.isString($$props.img) ? $$props.img : null,
    class: helpers.isString($$props.class) ? $$props.class : '',
  };
</script>

{#if props.img}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <image src="res://{props.img}" class={props.class} />
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <img class={props.class} src={props.img} alt="">
  {/if}
{/if}