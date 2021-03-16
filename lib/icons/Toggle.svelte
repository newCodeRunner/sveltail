<script>
  import { getString, getHeight, getWidth } from '../js/helpers';

  let _class;
  let _height;
  let _width;

  $: _class = getString($$props.class);
  $: _height = getHeight($$props.size, 'md');
  $: _width = getWidth($$props.size, 'md');
</script>

<div class="{_height} {_width} {_class}">
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 576 576">
    <!-- Font Awesome Free 5.15.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) -->
    <path fill="currentColor" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"></path>
  </svg>
</div>