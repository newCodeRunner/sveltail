<script>
  import { getString } from '../js/helpers';

  let _class;
  $: _class = getString($$props.class);
</script>

<ul class="bg-white text-black dark:bg-black dark:text-white {_class}">
  <slot />
</ul>
