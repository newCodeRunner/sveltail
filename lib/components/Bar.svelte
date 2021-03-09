<script>
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import Image from './Image.svelte';

  import { getString, getBoolean, getColor, getHeight } from '../js/helpers';
  import IconBars from '../icons/Bars.svelte';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _img, _title, _leftMenu, _rightMenu, _dense, _iconSize;
  $: _class = getString($$props.class);
  $: _img = getString($$props.img, null);
  $: _title = getString($$props.title, null);
  $: _leftMenu = getBoolean($$props.leftMenu);
  $: _rightMenu = getBoolean($$props.rightMenu);
  $: _dense = getBoolean($$props.dense);
  $: _iconSize = getHeight($$props.iconSize, 'md');

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
  <nav class="z-20 w-full flex items-center items-start p-2 {_class} {_dense ? 'h-12' : 'h-16'}">
    <slot>
      <div class="flex items-center justify-start">
        {#if _leftMenu}
          <div on:click={leftMenuClicked}>
            <IconBars class="p-2 bg-transparent cursor-pointer hover:bg-info" size={_iconSize} />
          </div>
        {/if}
     
        <!-- Start Slot  -->
        <slot name="start">
          <!-- Default Logo and Title -->
          <div class="flex" on:click={brandClicked}>
            {#if _img}<Image img={_img} class="object-contain mr-2 {_dense ? 'h-8' : 'h-12'}" />{/if}
            {#if _title}<span class="font-semibold text-xl tracking-tight">{_title}</span>{/if}
          </div>
        </slot>
      </div>

      <div class="flex flex-1 items-center justify-start">
        <!-- Middle Slot  -->
        <slot name="middle" />
      </div>

      <div class="flex  items-center justify-end">
        <!-- End Slot -->
        <slot name="end" />

        <!-- Right Menu -->
        {#if _rightMenu}
        
          <div on:click={rightMenuClicked}>
            <IconBars class="p-2 bg-transparent cursor-pointer hover:bg-info" size={_iconSize} />
          </div>
        {/if}
      </div>
    </slot>
  </nav>
{/if}

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <actionBar backgroundColor={getColor('brand')} >
    <!-- Left Menu -->
    <actionItem ios.position="left" android.position="actionBar">
      <Button colorBg="current" colorText="white" icon='fas fa-bars f0c9' size="md" flat on:click={leftMenuClicked} />
      <!-- Start Slot  -->
      <slot name="start" />
    </actionItem>
    
    <stackLayout orientation="horizontal">
      <!-- Start Slot  -->
      <slot name="middle">
        <!-- Default Logo and Title -->
        <Image src="res://{_img}" stretch="aspectFill" height="25" class="m-x-10" />
        {#if _title}<label text={_title} fontSize="25" for="" color={getColor('white')} />{/if}
      </slot>
    </stackLayout>

    <!-- Left Menu -->
    <actionItem ios.position="right" android.position="popup">
      <!-- End Slot -->
      <slot name="end" />
      <Button colorBg="current" colorText="white" icon='fas fa-bars f0c9' size="md" flat on:click={leftMenuClicked} />
    </actionItem>
  </actionBar>
{/if}