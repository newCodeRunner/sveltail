<script>
  // State
  let percentage = 0;
  const noPercentage = $$props.noPercentage === undefined ? false : $$props.noPercentage;
  export const updatePercentage = (percent) => {
    percentage = Math.trunc(percent);
  };

  const props = $$props;
</script>

<div class="p-1">
  <div class="flex mb-2 items-center justify-between">
    {#if props.label}
      <div class="text-xs font-semibold inline-block py-1 text-{props.colorBody}">{props.label}</div>
    {/if}
    {#if !noPercentage}
      <div class="text-right"><span class="text-xs font-semibold inline-block text-{props.colorBody}">{percentage}%</span></div>
    {/if}
  </div>
  <div class="overflow-hidden h-2 mb-4 text-xs flex flex-row bg-{props.colorBg} {props.rounded ? 'rounded' : ''}">
    <div class="block shadow-none whitespace-nowrap justify-center bg-{props.color} flex-col-{percentage}" />
  </div>
</div>
