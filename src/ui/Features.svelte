<script>
  import Icon from './Icon.svelte';
  import ObserverScroll from './ObserverScroll.svelte';

  // Global
  let inView = false;
  const props = $$props;
</script>

<div class="py-12 bg-{props.colorBg}">
  <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:text-center">
      {#if props.header}
        <p class="text-base leading-6 text-{props.colorHeader} font-semibold tracking-wide uppercase">{props.header}</p>
      {/if}
      {#if props.title}
        <h3 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-{props.colorTitle} sm:text-4xl sm:leading-10">{props.title}</h3>
      {/if}
      {#if props.body}
        <p class="mt-4 max-w-2xl text-xl leading-7 text-{props.colorBody} lg:mx-auto">{props.body}</p>
      {/if}
    </div>
  
    <div class="mt-10">
      {#if !inView}<ObserverScroll on:inView={() => { inView = true; }} onlyOnce />{/if}
      <ul class="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
        {#each props.arrayItems as item, i}
          <li
            class="
              mb-4
              md:mb-0
              {i % 2 ? 'ml-10' : '-ml-10'}
              {inView ? `transition duration-500 ease-in-out transform ${i % 2 ? '-' : ''}translate-x-10` : ''}
            "
          >
            <div class="flex px-3">
              {#if item.icon}
                <div class="flex-shrink-0">
                  <Icon icon={item.icon} size={item.sizeIcon ? item.sizeIcon : 'lg'} color={item.colorIcon} />
                </div>
              {/if}
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-{item.colorTitle ? item.colorTitle : 'current'}">{item.title}</h4>
                <p class="mt-2 text-base leading-6 text-{item.colorBody ? item.colorBody : 'current'}">{item.body}</p>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>  