<script>
  import { createEventDispatcher } from 'svelte';
  import { readable } from 'svelte/store';
  import { fade } from 'svelte/transition';

  import Icon from './Icon.svelte';
  import Button from './Button.svelte';

  import { getString, getIcon, getBoolean, getColor, isArray, isObject } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let _headerHeight = 0;
  let _msgHeight = 0;
  let _actionsHeight = 0;
  let props = null;
  let msg;
  let confirm;
  const dismiss = () => {
    props = null;
  };

  // Native
  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    //
  }

  // Web / Hybrid
  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    msg = ({ title, message, details, icon, barColorBg, barColorText, persistant, actions, actionsClass }) => {
      const html = document.querySelector('html');
      html.classList.add('overflow-hidden');
      props = {
        title: getString(title, null),
        message: getString(message, null),
        details: getString(details, null),
        icon: getIcon(icon, null),
        barColorBg: getColor(barColorBg, 'transparent'),
        barColorText: getColor(barColorText, 'current'),
        persistant: getBoolean(persistant),
        actions: isArray(actions)
          ? actions.map((i, index) => {
              return { 
                id: index,
                label: i.label,
                size: i.size,
                icon: i.icon,
                colorBg: i.colorBg,
                colorText: i.colorText,
                onClick() {
                  if (isFunction(i.onClick)) result = i.onClick();
                  dismiss();  
                }, 
              };
            }
          )
          : [{
            label: 'Okay',
            size: 'sm',
            colorBg: 'transparent',
            colorText: 'primary',
            onClick: dismiss,
          }],
        actionsClass: getString(actionsClass, 'justify-end items-center'),
      };
    };
    confirm = ({ title, message, details, icon, barColorBg, barColorText, actions, actionsClass }) => new Promise((resolve) => {
      const html = document.querySelector('html');
      html.classList.remove('overflow-hidden');
      props = {
        title: getString(title, null),
        message: getString(message, null),
        details: getString(details, null),
        icon: getIcon(icon, null),
        barColorBg: getColor(barColorBg, 'transparent'),
        barColorText: getColor(barColorText, 'current'),
        persistant: true,
        actions: isArray(actions)
          ? actions.map((i, index) => {
              return { 
                id: index,
                label: i.label,
                size: i.size,
                icon: i.icon,
                colorBg: i.colorBg,
                colorText: i.colorText,
                onClick() {
                  dismiss();
                  resolve(i.label);
                }, 
              };
            }
          )
          : [{
            label: 'Cancel',
            size: 'sm',
            colorBg: 'transparent',
            colorText: 'primary',
            onClick() {
              dismiss();
              resolve();
            },
          }],
        actionsClass: getString(actionsClass, 'justify-end items-center'),
      };
    });
  }

  export const alerter = {
    msg,
    confirm,
  };

  if (isObject($$props.context)) {
    $$props.context.alerter = readable(alerter);
  }
</script>

{#if props}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <gridLayout  width="100%" height="100%">
    </gridLayout>
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <div class='absolute h-screen w-screen top-0 left-0 flex'>
      <div
        class="fixed bg-dark dark:bg-light inset-0 opacity-50"
        on:click={() => {
          if (!props.persistant) dismiss();
        }}
      />
      <div
        transition:fade={{ duration: 300 }}
        class="z-10 m-auto st-alerter rounded bg-light text-dark dark:bg-dark dark:text-light"
      >
        {#if props.title}
          <div
            bind:clientHeight={_headerHeight}
            class="flex h-12 px-5 items-center justify-between bg-{props.barColorBg} text-{props.barColorText}"
          >
            <div class="inline-flex items-center">
              {#if props.icon}
                <Icon icon={props.icon} size="md" class="mx-1" />
              {/if}
              <div>{props.title}</div>
            </div>
            {#if !props.persistant}
              <div class="cursor-pointer" on:click={dismiss}><Icon icon="fas fa-times" size="md" /></div>
            {/if}
          </div>
        {/if}
        <div class="w-full p-4" bind:clientHeight={_msgHeight}>{props.message}</div>
        {#if props.details}
          <div class="w-full p-4 overflow-auto" style="height: calc(50vh - {_headerHeight}px - {_msgHeight}px - {_actionsHeight}px);">
            {props.details}
          </div>
        {/if}
        <div class="flex p-4 {props.actionsClass}" bind:clientHeight={_actionsHeight}>
          {#each props.actions as action}
            <Button
              flat
              rounded
              class="mx-1"
              label={action.label}
              size={action.size}
              colorBg={action.colorBg}
              colorText={action.colorText}
              on:click={action.onClick}
            />
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .st-alerter {
    min-width: 50vw;
    max-width: 75vw;
  }
</style>