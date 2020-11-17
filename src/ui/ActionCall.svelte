<script>
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import ObserverScroll from './ObserverScroll.svelte';

  // Globals
  const props = $$props;
  const dispatch = createEventDispatcher();
  let inView = false;
</script>

<div class="max-w-full mx-auto p-12 px-4 sm:p-6 lg:p-16 lg:flex lg:items-center lg:justify-between bg-{props.colorBg}">
  <div class="max-w-full -ml-10 {inView ? 'transition duration-500 ease-in-out transform translate-x-10' : ''}">
    {#if !inView}<ObserverScroll on:inView={() => { inView = true; }} onlyOnce />{/if}
    <slot name="title">
      <h2 class="text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 text-{props.colorTitle}">{props.title}</h2>
    </slot>
    <br>
    <slot name="body">
      <h2 class="text-xl leading-9 font-extrabold tracking-tight sm:text-2xl sm:leading-10 text-{props.colorBody}">{props.body}</h2>
    </slot>
  </div>
  <div class="mt-8 flex lg:flex-shrink-0 lg:mt-0 ml-10 {inView ? 'transition duration-500 ease-in-out transform -translate-x-10' : ''}">
    <slot name="actions">
      {#if props.pActLabel}
        <Button
          rounded
          filled={props.filled}
          size={props.actionSize}
          label={props.pActLabel}
          color={props.pActColor}
          on:click={() => dispatch('primaryClicked')}
        />
      {/if}
      {#if props.sActLabel}
        <Button
          rounded
          filled={props.filled}
          size={props.actionSize}
          label={props.sActLabel}
          class='ml-3'
          color={props.sActColor}
          on:click={() => dispatch('secondaryClicked')}
        />
      {/if}
    </slot>
  </div>
</div>
  