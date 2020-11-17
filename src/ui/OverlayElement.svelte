<script>
  const props = $$props;
</script>

<div class="absolute top-0 left-0 h-full w-full {props.class} opacity-75" />
<div class="absolute top-0 left-0 h-full w-full {props.classInner}">
  <slot />
</div>
