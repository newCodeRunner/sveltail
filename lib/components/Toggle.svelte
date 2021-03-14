<script>
  import {
    getString,
    getColor,
    getTextSize,
    getHeight,
    getWidth,
    getBoolean,
  } from "../js/helpers";

  let _class, _label, _textSize, _color, _height, _width, _disabled;
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, "");
  $: _textSize = getTextSize($$props.size, "md");
  $: _color = getColor($$props.color, "primary");
  $: _height = getHeight($$props.size, "md");
  $: _width = getWidth($$props.size, "md");
  $: _disabled = getBoolean($$props.disabled);

  export let value = false;

  const _id = `st-check-${new Date().getTime()}-${Math.random() * 100}`;

  const _update = (evt) => {
    if (!_disabled) value = !value; 
    else evt.preventDefault();
  };
</script>

<div class={_class}>
  <label for={_id} class="inline-flex items-center cursor-pointer">
    <input id={_id} type="checkbox" class="hidden" checked="{value}" on:click={_update}>
    <div class="relative inline-flex items-center {_height} {_width}">
      <div class="w-full h-1/4 rounded-full shadow-inner {value ? `bg-${_color}` : 'bg-info'}"/>
      <div class="st-toggle-handle left-0 -top-1/2 transition duration-300 ease-in-out transform -translate-y-2/4 absolute w-1/2 h-1/2 rounded-full shadow bg-info {value ? 'translate-x-full' : ''}" />
    </div>
    <span class="ml-2 {_textSize}">{_label}</span>
  </label>
</div>
