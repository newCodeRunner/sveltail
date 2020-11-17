<script>
  import { createEventDispatcher } from 'svelte';

  import Button from './Button.svelte';
  import ObserverScroll from './ObserverScroll.svelte';
  import Image from './Image.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  let inView = false;

  const props = $$props;
</script>

<div class="relative z-0 overflow-hidden w-full">
  {#if !inView}<ObserverScroll on:inView={() => { inView = true; }} onlyOnce />{/if}
  <div class="w-full flex bg-{props.colorBg}">
    <div class="w-full p-5 -ml-10 {inView ? 'transition duration-500 ease-in-out transform translate-x-10' : ''}">
      <h2 class="text-4xl tracking-tight leading-10 font-extrabold sm:text-5xl sm:leading-none md:text-6xl text-{props.colorHeader}">
        {#if props.header}<span>{props.header}</span>{/if}
        <br />
        {#if props.title !== null}<span class="text-{props.colorTitle}">{props.title}</span>{/if}
      </h2>
      <p class="mt-3 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-{props.colorBody}">
        <slot name="body">{props.body}</slot>
      </p>
      {#if !props.noActions}
        <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
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
                class='lg:ml-3 md:ml-3 sm:ml-3 mt-2 lg:mt-0 md:mt-0 sm:mt-0'
                color={props.sActColor}
                on:click={() => dispatch('secondaryClicked')}
              />
            {/if}
          </slot>
        </div>
      {/if}
    </div>
  </div>
  {#if props.img}
    <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 {inView ? 'animate-once-slide-in-right' : ''}">
      <Image class="h-56 w-full p-5 object-cover hidden clip-rect-slanted-left lg:block lg:w-full lg:h-full" img={props.img} />
      <Image class="h-56 w-full object-cover sm:h-72 md:h-96 lg:hidden" img={props.img} />
    </div>
  {/if}
</div>
