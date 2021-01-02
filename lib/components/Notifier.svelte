<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  import Icon from '../components/Icon.svelte';
  import Button from '../components/Button.svelte';

  import { setNotifier } from '../js/utilities';
  import { getString, getIcon, getBoolean, isFunction, isNull } from '../js/helpers';


  // Globals
  const dispatch = createEventDispatcher();
  let notifications = [];
  let show;

  const clearAll = () => {
    notifications = [];
  };

  // Native
  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    show = ({ title, message, icon, dismissable, timeout }) => {
      //
    };
  }

  // Web / Hybrid
  let getStyle;
  let getPosition;

  if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
    getStyle = (i, pos, id) => {
      let style = '';
      const isTop = pos.indexOf('top') === 0;
      const isRight = pos.indexOf('right') > -1;
      const isCenter = pos.indexOf('center') > -1;

      if (isRight) style += 'right: 0;';
      if (isCenter) style += 'left: 50vw; transform: translateX(-50%);';

      let height = 0;
      for (let index = i - 1; index >= 0; --index) {
        height += notifications[index].height;
      }

      let previous = notifications[i - 1] ? notifications[i - 1] : null;
      previous = previous ? previous.isTop !== isTop : null;

      if (isTop) style += ` top: ${(i * 20) + height}px;`;
      else style += ` bottom: ${(i * 20) + height}px;`;

      return style;
    };
    getPosition = (pos) => {
      let position = 'top-right';
      position = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']
        .findIndex((i) => i === pos) > -1
          ? pos
          : position;
      return position;
    };

    show = ({ title, message, icon, dismissable, position, timeout, persistant, onDismiss, actions, actionsClass }) => {
      const newTitle = getString(title, null);
      const newMessage = getString(message, null);
      const newIcon = getIcon(icon);

      const foundIndex = notifications.findIndex((i) => i.title === newTitle && i.message === newMessage && i.icon === newIcon);
      if (foundIndex < 0) {
        const id = `notify-${new Date().getTime() + notifications.length}`;
        const dismiss = () => {
          notifications = [...notifications.filter((i) => i.id !== id)];
          if (isFunction(onDismiss)) onDismiss();
        };
        
        notifications = [...notifications, {
          id,
          height: 0,
          title: newTitle,
          message: newMessage,
          icon: newIcon,
          dismissable: getBoolean(dismissable),
          dismiss,
          timer: persistant ? null : setTimeout(dismiss, timeout || 3000),
          position: getPosition(position),
          isTop: getPosition(position).indexOf('bottom') !== 0, 
          badge: 1,
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
                    let result = true;
                    if (isFunction(i.onClick)) result = i.onClick();
                    if (isNull(result) || isUndefined(result)) result = true;
                    if (result) dismiss();  
                  }, 
                };
              }
            )
            : [],
          actionsClass: getString(actionsClass, 'justify-end'),
        }];
      } else {
        const tempArray = notifications.map((i) => i);
        tempArray[foundIndex].badge += 1;
        notifications = tempArray;
      }
    };
  }

  $setNotifier({
    show,
    clearAll,
  });
</script>

{#if notifications.length > 0}
  {#each notifications as item, i (item.id)}
    {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
      <gridLayout  width="100%" height="100%">
      </gridLayout>
    {/if}

    {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
      <div
        in:fly={{ y: item.isTop ? -50 : 50, duration: 500 }}
        out:fly={{ y: item.isTop ? -50 : 50, duration: 500 }}
        bind:clientHeight={item.height}
        class="fixed z-30 m-5 p-5 rounded max-w-xs md:max-w-sm bg-black text-white dark:bg-white dark:text-black"
        style={getStyle(i, item.position, item.id)}
      >
        <div class="relative flex">
          {#if item.badge > 1}<div class="fixed top-0 rounded left-0 st-notifier-badge text-white px-2 py-1">{item.badge}</div>{/if}
          {#if item.icon}<Icon icon={item.icon} class="ml-1 mr-2" size="md" />{/if}
          <div>
            {#if item.title}<div>{item.title}</div>{/if}
            {#if item.message}<div>{item.message}</div>{/if}

            {#if item.actions.length > 0}
              <br>
              <div class="inline-flex w-full {item.actionsClass}">
                {#each item.actions as action (action.id)}
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
          {#if item.dismissable}
            <span on:click={item.dismiss}><Icon class="ml-4 mr-1 cursor-pointer" icon="fas fa-times-circle" size="sm" /></span>
          {/if}
        </div>
      </div>
    {/if}
  {/each}
{/if}

<style>
  .st-notifier-badge {
    background-color: #0BB5FF;
    transform: translate(-50%, -10px);
  }
</style>