<script>
  import Icon from './Icon.svelte';

  // Globals
  let alert;
  const noDismiss = $$props.noDismiss === undefined ? false : $$props.noDismiss;
  const type = $$props.type === undefined ? 'info' : $$props.type;
  
  const props = $$props;
  const hide = () => {
    alert.parentNode.removeChild(alert);
  };
</script>

  <div
    bind:this={alert}
    role="alert"
    class="
      w-full
      px-4
      py-2
      {type === 'info' ? 'bg-gray-100 text-black' : ''}
      {type === 'warning' ? 'bg-warning text-current' : ''}
      {type === 'danger' ? 'bg-danger text-current' : ''}
      {type === 'success' ? 'bg-success text-current' : ''}
      {type === 'custom' ? `bg-${props.colorBg} text-${props.color}` : ''}
      {props.class}
    "
  >
    <div class="flex justify-between">
      <div class="flex">
        {#if !props.noIcons}
          <span class="h-8 w-8 p-1">
            {#if type === 'info'} <Icon icon="fas fa-info" size="auto" class="h-full w-full" />
            {:else if type === 'warning'} <Icon icon="fas fa-exclamation" size="auto" class="h-full w-full" />
            {:else if type === 'danger'} <Icon icon="fas fa-exclamation-circle" size="auto" class="h-full w-full" />
            {:else if type === 'success'} <Icon icon="fas fa-check" size="auto" class="h-full w-full" />
            {:else if type === 'custom'} <Icon icon={props.icon} size="auto" class="h-full w-full" />
            {/if}
          </span>
        {/if}
        <div class="mx-5">
          {#if props.title}<p class="font-bold">{props.title}</p>{/if}
          {#if props.body !== null}<p class="text-sm">{props.body}</p>{/if}
        </div>
      </div>
      {#if !noDismiss}<span class="h-4 w-4 cursor-pointer" on:click={hide}><Icon icon="fas fa-times" size="auto" class="h-full w-full" /></span>{/if}
    </div>
  </div>
