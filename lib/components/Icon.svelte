<script>
  import { getContext } from 'svelte';

  // Globals
  const { helpers } = getContext('$$app');
  const props = {
    icon: helpers.isString($$props.icon) ? helpers.getIcon($$props.icon) : null,
    class: helpers.isString($$props.class) ? $$props.class : '',
    fontSize: helpers.getFontSize($$props.size), 
  };
</script>

{#if props.icon}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <span text={String.fromCharCode(props.icon.text)} class="{props.class} {props.icon.class}" />
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <i class="text-{props.color} {props.class} {props.icon}" style="font-size: {props.fontSize}px;" />
  {/if}
{/if}
