<script>
  import { getString, getBoolean } from '../js/helpers';

  let _class, _single, _accordian;
  $: _class = getString($$props.class);
  $: _single = getBoolean($$props.single);
  $: _accordian = getString($$props.accordian);

</script>

<div class="w-full {_class}" single={_single} accordian={_accordian}>
  <slot />
</div>