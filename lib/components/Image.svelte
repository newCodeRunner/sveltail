<script>
  import { getString } from '../js/helpers';

  // Global
  let _img, _class, _alt;

  $: _img = getString($$props.img, null);
  $: _class = getString($$props.class);
  $: _alt = getString($$props.alt, '');
  $: _onErrorSrc = getString($$props.altSrc, _img);
</script>

{#if _img}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <image class={_class} src="res://{_img}" />
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <img class={_class} src={_img} alt={_alt} onerror="this.src='{_onErrorSrc}'">
  {/if}
{/if}