<script>
  import ObserverScroll from './ObserverScroll.svelte';
  import Icon from './Icon.svelte';

  // Global
  let inView = false;
  const props = $$props;
</script>

{#if inView === false}
  <ObserverScroll on:inView={() => { inView = true; }} onlyOnce />
  <span><Icon icon="circle-notch" /></span>
{:else}
  <img class={props.class} src={props.img} alt="">
{/if}