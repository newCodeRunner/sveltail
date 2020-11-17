<script>
  import { slide } from 'svelte/transition';

  const props = $$props;
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <slot />
{:else}
  <section class={props.class} transition:slide={{ duration: 250 }} >
    <slot />
  </section>
{/if}
