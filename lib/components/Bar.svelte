<script>
    import { createEventDispatcher, getContext } from 'svelte';
    import Button from './Button.svelte';
    import Image from './Image.svelte';

    // Globals
    const dispatch = createEventDispatcher();
    const { helpers } = getContext('$$app');
    const props = {
      class: helpers.isString($$props.class) ? $$props.class : 'bg-brand text-white',
      img: helpers.isString($$props.img) ? $$props.img : null,
      title: helpers.isString($$props.title) ? $$props.title : null,
      leftMenu: helpers.getBoolean($$props.leftMenu),
      rightMenu: helpers.getBoolean($$props.rightMenu),
      dense: helpers.getBoolean($$props.dense),
    };
    const leftMenuClicked = () => {
      dispatch('leftMenuClicked');
    };
    const rightMenuClicked = () => {
      dispatch('rightMenuClicked');
    };
    const brandClicked = () => {
      dispatch('brandClicked');
    };
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <actionBar backgroundColor={helpers.getColor('brand')} >
    <!-- Left Menu -->
    {#if props.leftMenu}
      <actionItem ios.position="left" android.position="actionBar">
        <Button colorBg="current" colorText="white" icon='fas fa-bars f0c9' size="md" flat on:click={leftMenuClicked} />
        <!-- Start Slot  -->
        <slot name="nav-start" />
      </actionItem>
    {/if}
    
    <stackLayout orientation="horizontal">
      <!-- Start Slot  -->
      <slot name="nav-middle">
        <!-- Default Logo and Title -->
        <Image src="res://{props.img}" stretch="aspectFill" height="25" class="m-x-10" />
        {#if props.title}<label text={props.title} fontSize="25" for="" color={helpers.getColor('white')} />{/if}
      </slot>
    </stackLayout>

    <!-- Left Menu -->
    {#if props.rightMenu}
      <actionItem ios.position="right" android.position="popup">
        <!-- End Slot -->
        <slot name="nav-end" />
        <Button colorBg="current" colorText="white" icon='fas fa-bars f0c9' size="md" flat on:click={leftMenuClicked} />
      </actionItem>
    {/if}
  </actionBar>
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  <nav class="z-20 w-full flex items-center py-2 {props.class} {props.dense ? 'h-12' : 'h-16'}">
    <div class="flex items-center justify-start">
      <!-- Left Menu -->
      {#if props.leftMenu}
        <Button colorBg="brand" colorText="white" icon='fas fa-bars f0c9' size="{props.dense ? 'sm' : 'md'}" flat on:click={leftMenuClicked} />
      {/if}
      
      <!-- Start Slot  -->
      <slot name="nav-start">
        <!-- Default Logo and Title -->
        <div class="flex items-center justify-start mx-3 cursor-pointer" on:click={brandClicked}>
          {#if props.img}<Image img="assets/{props.img}" class="object-contain mr-2 {props.dense ? 'h-8' : 'h-12'}" />{/if}
          {#if props.title}<span class="font-semibold text-xl tracking-tight">{props.title}</span>{/if}
        </div>
      </slot>
    </div>

    <div class="flex items-center justify-start">
      <!-- Middle Slot  -->
      <slot name="nav-middle" />
    </div>

    <div class="flex flex-1 items-center justify-end">
      <!-- End Slot -->
      <slot name="nav-end" />

      <!-- Left Menu -->
      {#if props.rightMenu}
        <Button colorBg="brand" colorText="white" icon='fas fa-bars f0c9' size="{props.dense ? 'sm' : 'md'}" flat on:click={rightMenuClicked} />
      {/if}
    </div>
  </nav>
{/if}
