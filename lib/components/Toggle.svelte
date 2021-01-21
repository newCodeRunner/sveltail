<script>
  import {
    getString,
    getColor,
    getTextSize,
    getHeight,
    getWidth,
  } from "../js/helpers";

  let _class, _label, _textSize, _color, _height, _width;
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, "");
  $: _textSize = getTextSize($$props.size, "md");
  $: _color = getColor($$props.color, "primary");
  $: _height = getHeight($$props.size, "md");
  $: _width = getWidth($$props.size, "md");

  const _id = `st-check-${new Date().getTime()}-${Math.random() * 100}`;

  export let checked = false;
</script>

<div class={_class}>
  <label for={_id} class="inline-flex items-center cursor-pointer">
    <input id={_id} type="checkbox" class="hidden" checked="{checked}" on:click={() => { checked = !checked; }}>
    <div class="relative inline-flex items-center {_height} {_width}">
      <div class="w-full h-1/4 rounded-full shadow-inner {checked ? `bg-${_color}` : 'bg-info'}"/>
      <div class="st-toggle-handle absolute w-1/2 h-1/2 rounded-full shadow bg-info" />
    </div>
    <span class="ml-2 {_textSize}">{_label}</span>
  </label>
</div>

<style>
.st-toggle-handle {
  top: 50%;
  left: 0%;
  transform: translateY(-50%);
  transition: all 0.3s ease-in-out;
}

input[type="checkbox"]:checked + div div.st-toggle-handle {
  transform: translate(100%, -50%);
}
</style>
