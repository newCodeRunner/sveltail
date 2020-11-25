<script>
  import { getContext } from 'svelte';
  import Icon from './Icon.svelte';
  import Image from './Image.svelte';

  // Globals
  const { helpers } = getContext('$$app');
  const props = {
    class: helpers.isString($$props.class) ? $$props.class : '',
    icon: helpers.getIcon($$props.icon),
    img: helpers.isString($$props.img) ? $$props.img : null,
    circle: helpers.getBoolean($$props.circle),
    colorBg: helpers.getColor($$props.colorBg, 'primary'),
    colorText: helpers.getColor($$props.colorText, 'white'),
    height: helpers.getHeight($$props.size, 'md'),
    width: helpers.getWidth($$props.size, 'md'),
  };
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <span />
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <div
      class="
        flex
        justify-center
        items-center
        border
        bg-{props.colorBg}
        text-{props.colorText}
        border-{props.colorBg === 'transparent' ? props.colorText : props.colorBg}
        {props.circle ? 'rounded-full p-2' : ''}
        {props.height} 
        {props.width}
        {props.class}
      "
    >
      {#if props.icon}
        <Icon icon={props.icon} size={$$props.size} />
      {:else if props.img}
        <Image img={props.img} />
      {/if}
    </div>
{/if}
  