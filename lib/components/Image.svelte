<script>
  import { getContext } from 'svelte';

  // Global
  const { getString } = getContext('$$app').helpers;
  let _img, _class;

  $: _img = getString($$props.img, null);
  $: _class = getString($$props.class);
</script>

{#if _img}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <image class={_class} src="res://{_img}" />
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <img class={_class} src={_img} alt="">
  {/if}
{/if}