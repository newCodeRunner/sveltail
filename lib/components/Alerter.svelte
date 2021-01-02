<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import Icon from './Icon.svelte';
  import Button from './Button.svelte';

  import { getString, getIcon, getBoolean, isObject } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

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
    msg = ({ title, message, icon, hideBar, barColorBg, barColorText, persistant, actions, actionsClass }) => {
      const html = document.querySelector('html');
      html.classList.add('overflow-hidden');
      props = {
        title: getString(title, null),
        message: getString(message, null),
        icon: getIcon(icon),
        hideBar: getBoolean(hideBar),
        barColorBg: getColor(barColorBg, 'primary'),
        barColorText: getColor(barColorText, 'white'),
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
            colorBg: 'primary',
            onClick: dismiss,
          }],
        actionsClass: isString(actionsClass) ? actionsClass : 'justify-end',
      };
    };
    confirm = () => {
      const html = document.querySelector('html');
      html.classList.remove('overflow-hidden');
    };
  }

  export const alerter = {
    msg,
    confirm,
  };

  if (isObject($$props.context)) {
    $$props.context.alerter = alerter;
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
        class="fixed bg-black dark:bg-white inset-0 opacity-50"
        on:click={() => {
          if (!props.persistant) dismiss();
        }}
      />
      <div transition:fade={{ duration: 300 }} class="z-10 m-auto st-alerter rounded bg-black text-white dark:bg-white dark:text-black">
        {#if !props.hideBar}
          <div class="flex h-12 p-5 items-center justify-between bg-{props.barColorBg} text-{props.barColorText}">
            <div>{props.title}</div>
            <div class="cursor-pointer" on:click={dismiss}><Icon icon="fas fa-times" size="md" /></div>
          </div>
        {/if}
        <div class="p-5">
          <p>{props.message}</p>
          {#if props.actions.length > 0}
              <br>
              <div class="inline-flex w-full {props.actionsClass}">
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
            {/if}
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .st-alerter {
    min-width: 50vw;
  }
</style>