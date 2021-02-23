<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';
    import Image from './Image.svelte';

    import { getString, getBoolean, getColor } from '../js/helpers';

    // Globals
    const dispatch = createEventDispatcher();

    let _class, _img, _title, _leftMenu, _rightMenu, _dense;
    $: _class = getString($$props.class);
    $: _img = getString($$props.img, null);
    $: _title = getString($$props.title, null);
    $: _leftMenu = getBoolean($$props.leftMenu);
    $: _rightMenu = getBoolean($$props.rightMenu);
    $: _dense = getBoolean($$props.dense);

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

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  <nav class="z-20 w-full flex items-center p-2 {_class} {_dense ? 'h-12' : 'h-16'}">
    <div class="flex items-center justify-start">
      <!-- Left Menu -->
      {#if _leftMenu}
        <Button icon='fas fa-bars f0c9' size="{_dense ? 'sm' : 'md'}" flat on:click={leftMenuClicked} />
      {/if}
      
      <!-- Start Slot  -->
      <slot name="start">
        <!-- Default Logo and Title -->
        <div class="flex items-center justify-start mx-3 cursor-pointer" on:click={brandClicked}>
          {#if _img}<Image img={_img} class="object-contain mr-2 {_dense ? 'h-8' : 'h-12'}" />{/if}
          {#if _title}<span class="font-semibold text-xl tracking-tight">{_title}</span>{/if}
        </div>
      </slot>
    </div>

    <div class="flex items-center justify-start">
      <!-- Middle Slot  -->
      <slot name="middle" />
    </div>

    <div class="flex flex-1 items-center justify-end">
      <!-- End Slot -->
      <slot name="end" />

      <!-- Left Menu -->
      {#if _rightMenu}
        <Button icon='fas fa-bars f0c9' size="{_dense ? 'sm' : 'md'}" flat on:click={rightMenuClicked} />
      {/if}
    </div>
  </nav>
{/if}

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <actionBar backgroundColor={getColor('brand')} >
    <!-- Left Menu -->
    {#if _leftMenu}
      <actionItem ios.position="left" android.position="actionBar">
        <Button colorBg="current" colorText="white" icon='fas fa-bars f0c9' size="md" flat on:click={leftMenuClicked} />
        <!-- Start Slot  -->
        <slot name="start" />
      </actionItem>
    {/if}
    
    <stackLayout orientation="horizontal">
      <!-- Start Slot  -->
      <slot name="middle">
        <!-- Default Logo and Title -->
        <Image src="res://{_img}" stretch="aspectFill" height="25" class="m-x-10" />
        {#if _title}<label text={_title} fontSize="25" for="" color={getColor('white')} />{/if}
      </slot>
    </stackLayout>

    <!-- Left Menu -->
    {#if _rightMenu}
      <actionItem ios.position="right" android.position="popup">
        <!-- End Slot -->
        <slot name="end" />
        <Button colorBg="current" colorText="white" icon='fas fa-bars f0c9' size="md" flat on:click={leftMenuClicked} />
      </actionItem>
    {/if}
  </actionBar>
{/if}