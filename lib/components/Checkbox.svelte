<script>
  import { getString, getColor, getTextSize, getHeight, getWidth, getBoolean } from '../js/helpers';
  
  let _class, _label, _textSize, _colorBg, _colorText, _height, _width, _disabled;
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, '');
  $: _textSize = getTextSize($$props.size, 'md');
  $: _colorBg = getColor($$props.colorBg, 'transparent');
  $: _colorText = getColor($$props.colorText, 'current');
  $: _height = getHeight($$props.size, 'md');
  $: _width = getWidth($$props.size, 'md');
  $: _disabled = getBoolean($$props.disabled);

  const _id = `st-check-${new Date().getTime()}-${(Math.random() * 100)}`;
  const _update = (evt) => {
    if (!_disabled) value = !value; 
    else evt.preventDefault();
  };
  export let value = false;
</script>

<div class={_class}>
  <input id={_id} type="checkbox" class="hidden" checked="{value}" on:click={_update}>
  <label for={_id} class="inline-flex items-center text-{_colorText}">
    <div class="p-2 {_height} {_width}">
      <div tabindex="-1" class="h-full w-full relative border {_textSize} border-{_colorBg} bg-{_colorBg} focus:outline-none focus:border-{_colorText}" />
    </div>
    <span class="pr-2 {_textSize}">{_label}</span>
  </label>
</div>

<!-- <style>
  input[type="checkbox"] + label div div:after {
    color: transparent !important;
  }
  input[type="checkbox"] + label div div:after , input[type="checkbox"]:checked + label div div:after {
    position: absolute;
    width: fit-content;
    height: fit-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '\2713';
  }
  input[type="checkbox"]:checked + label div div:after {
    color: currentColor !important;
  }
</style> -->