<script>
  import { readable } from 'svelte/store';
  import { fade } from 'svelte/transition';

  import Input from './Input.svelte';
  import Button from './Button.svelte';

  import { getSize, getString, getBoolean, getColor, isArray, isObject, getHeight, getWidth } from '../js/helpers';
  import IconDismiss from '../icons/Dismiss.svelte';

  // Globals
  let _headerHeight = 0;
  let _msgHeight = 0;
  let _actionsHeight = 0;
  let props = null;

  let msg;
  let confirm;
  let input;
  let _inputText = null;
  let _inputError = null;
  const dismiss = () => {
    props = null;
  };

  // Native
  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    //
  }

  // Web / Hybrid
  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    msg = ({ title, message, details, barColorBg, barColorText, persistant, actions, actionsClass }) => {
      const html = document.querySelector('html');
      html.classList.add('overflow-hidden');
      props = {
        title: getString(title, null),
        message: getString(message, null),
        details: getString(details, null),
        barColorBg: getColor(barColorBg, 'transparent'),
        barColorText: getColor(barColorText, 'current'),
        persistant: getBoolean(persistant),
        actions: isArray(actions)
          ? actions.map((i, index) => {
              return { 
                id: index,
                label: i.label,
                size: getSize(i.size, 'md'),
                colorBg: getColor(i.colorBg, 'transparent'),
                colorText: getColor(i.colorText, 'current'),
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
              colorText: 'current',
              onClick: dismiss,
          }],
        actionsClass: getString(actionsClass, 'justify-end items-center'),
      };
    };
    confirm = ({ title, message, details, barColorBg, barColorText, actions, actionsClass }) => new Promise((resolve) => {
      const html = document.querySelector('html');
      html.classList.remove('overflow-hidden');
      props = {
        title: getString(title, null),
        message: getString(message, null),
        details: getString(details, null),
        barColorBg: getColor(barColorBg, 'transparent'),
        barColorText: getColor(barColorText, 'current'),
        persistant: true,
        actions: isArray(actions)
          ? actions.map((i, index) => {
              return { 
                id: index,
                label: i.label,
                size: getSize(i.size, 'md'),
                colorBg: getColor(i.colorBg, 'transparent'),
                colorText: getColor(i.colorText, 'current'),
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
              colorText: 'current',
              onClick() {
                dismiss();
                resolve();
              },
          }],
        actionsClass: getString(actionsClass, 'justify-end items-center'),
      };
    });
    input = ({ title, message, details, barColorBg, barColorText, actions, actionsClass, callback }) => new Promise((resolve) => {
      const html = document.querySelector('html');
      html.classList.remove('overflow-hidden');
      props = {
        title: getString(title, null),
        message: getString(message, null),
        details: getString(details, null),
        barColorBg: getColor(barColorBg, 'transparent'),
        barColorText: getColor(barColorText, 'current'),
        persistant: true,
        actions: isArray(actions)
          ? actions.map((i, index) => {
              return { 
                id: index,
                label: i.label,
                size: getSize(i.size, 'md'),
                colorBg: getColor(i.colorBg, 'transparent'),
                colorText: getColor(i.colorText, 'current'),
                onClick() {
                  resolve(i.label, _inputText);
                }, 
              };
            }
          )
          : [
              {
                label: 'Okay',
                size: 'sm',
                colorBg: 'transparent',
                colorText: 'current',
                onClick() {
                  if (callback) {
                    const result = callback(_inputText, _inputError);
                    if (result === true) {
                      resolve({ val: _inputText, err: _inputError });
                      dismiss();
                    } else _inputError = result;
                  } else {
                    resolve({ val: _inputText, err: _inputError});
                    dismiss();
                  }
                },
              },
              {
                label: 'Cancel',
                size: 'sm',
                colorBg: 'transparent',
                colorText: 'current',
                onClick() {
                  reject();
                },
              },
          ],
        actionsClass: getString(actionsClass, 'justify-end items-center'),
        showInput: true,
        textValue: null,
      };
    });
  }

  export const alerter = {
    msg,
    confirm,
    input,
    dismiss,
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
              <div>{props.title}</div>
            </div>
            {#if !props.persistant}
              <div class="cursor-pointer" on:click={dismiss}>
                <IconDismiss />
              </div>
            {/if}
          </div>
        {/if}
        <div class="w-full p-4" bind:clientHeight={_msgHeight}>{props.message}</div>
        {#if props.details || props.showInput}
          <div class="w-full p-4 overflow-auto" style="height: calc(50vh - {_headerHeight}px - {_msgHeight}px - {_actionsHeight}px);">
            {#if props.details}
              <div>{props.details}</div>
            {/if}
            {#if props.showInput}
              <Input bind:value={_inputText} bind:error={_inputError} class="w-full" />
            {/if}
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