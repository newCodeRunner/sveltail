<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import Image from './Image.svelte';
  import Button from './Button.svelte';

  // Global
  const time = $$props.time === undefined ? 10000 : $$props.time;
  let timer;
  let slideIndex = 0;
  let slides;
  let selected;
  const updateSlide = (s) => {
    if (!slides) return;
    if (s === slideIndex) return;
    if (s) slideIndex = s;
    else slideIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
    selected = null;
    window.requestAnimationFrame(() => {
      selected = slides[slideIndex];
    });
  };
  
  const props = $$props;

  onMount(() => {
    timer = setInterval(updateSlide, time);
    return () => {
      clearInterval(timer);
    };
  });
</script>

<div class="w-full px-4 sm:px-6 lg:px-8">
  <div class="lg:text-center">
    {#if props.header}
      <p class="text-base leading-6 text-{props.colorHeader} font-semibold tracking-wide uppercase">{props.header}</p>
    {/if}
    {#if props.title !== null}
      <h3 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-{props.colorTitle} sm:text-4xl sm:leading-10">{props.title}</h3>
    {/if}
    {#if props.body !== null}
      <p class="mt-4 max-w-2xl text-xl leading-7 text-{props.colorBody} lg:mx-auto">{props.body}</p>
    {/if}
  </div>

  <!-- Carousel Body -->
  <div class="w-full h-64 mt-10">
    {#if selected}
      <div in:fade={{ duration: 500 }} class="relative z-0 w-full h-64 flex overflow-hidden bg-{selected.colorBg}">
        <div class="absolute left-0 h-full w-full md:w-1/3 p-4">
          <Image class="w-full h-full object-contain" img={selected.img} />
        </div>
        <div class="absolute right-0 bg-gray-800 w-full h-full md:w-1/2 opacity-75 block md:hidden" />
        <div class="absolute right-0 w-full h-full md:w-2/3 p-4 overflow-auto">
          <h2 class="text-2xl tracking-tight leading-10 font-extrabold sm:text-3xl sm:leading-none md:text-4xl text-{selected.headerColor}">
            {#if selected.header}<span>{selected.header}</span>{/if}
            <br />
            {#if selected.title}<span class="text-{selected.titleColor}">{selected.title}</span>{/if}
          </h2>
          {#if selected.body}
            <p class="mt-3 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-{selected.bodyColor}">{selected.body}</p>
          {/if}
          {#if selected.footer}
            <p class="mt-3 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-{selected.footerColor}">{selected.footer}</p>
          {/if}
          {#if selected.pActLabel}
            <Button
              rounded
              size="md"
              label={selected.pActLabel}
              color={selected.pActColor}
              on:click={selected.pClick}
            />
          {/if}
          {#if selected.secondaryActionLabel}
            <Button
              rounded
              size="md"
              label={selected.sActLabel}
              color={selected.sActColor}
              class='lg:ml-3 md:ml-3 sm:ml-3 mt-2 lg:mt-0 md:mt-0 sm:mt-0'
              on:click={selected.sClick}
            />
          {/if}
          {#if selected.link}<a href={selected.link} alt="">{selected.linkText}</a>{/if}
        </div>
      </div>
    {/if}
  </div>

  <!-- Carousel Tabs -->
  {#if slides}
    <div class="flex items-center pt-5 justify-center">
      {#each slides as _, s (s)}<Button size="sm" flat icon="fas fa-circle" on:click={() => { updateSlide(s); }} />{/each}
    </div>
  {/if}
</div>
