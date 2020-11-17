<script>
  import { createEventDispatcher, onMount } from 'svelte';

  import Notification from '../ui/Notification.svelte';

  const dispatch = createEventDispatcher();

  // State
  const autoClose = $$props.autoClose === undefined ? true : $$props.autoClose;
  const time = $$props.time === undefined ? 3000 : $$props.time;

  // Internal
  let notificationArray = [];
  const hide = (id) => {
    let searchId = id;
    if (notificationArray.length > 0 && id === undefined) {
      searchId = notificationArray[notificationArray.length - 1].id;
    }
    notificationArray = notificationArray.filter((i) => i.id !== searchId);
  };
  const show = ({
    title, body, icon, customClass,
  }) => {
    const id = `${new Date().getTime()}-${notificationArray.length + 1}`;
    const lastNotification = notificationArray.length > 0
      ? notificationArray[notificationArray.length - 1]
      : null;
    const alreadyPresent = lastNotification !== null
      ? lastNotification.title === title && lastNotification.body === body
      : false;
    const badge = alreadyPresent ? lastNotification.badge + 1 : 1;
    if (alreadyPresent) {
      if (lastNotification.timer !== null)clearTimeout(lastNotification.timer);
      lastNotification.id = id;
      lastNotification.badge += 1;
      if (autoClose) {
        lastNotification.timer = setTimeout(
          () => {
            if (notificationArray.findIndex((i) => i.id === id) > -1) {
              hide(notificationArray[notificationArray.length - 1].id);
            }
          },
          time,
        );
      }
      notificationArray[notificationArray.length - 1] = lastNotification;
    } else {
      notificationArray.push({
        id,
        title,
        body,
        icon,
        badge,
        class: customClass === undefined ? '' : customClass,
        timer: autoClose
          ? setTimeout(
            () => (notificationArray.findIndex((i) => i.id === id) > -1 ? hide(id) : null),
            time,
          )
          : null,
      });
    }
    notificationArray = notificationArray;
  };

  onMount(() => {
    dispatch('ready', { notifier: { show, hide } });
  });
</script>

{#if notificationArray.length > 0}
  <div class="fixed z-0 top-0 right-0 h-screen box-content hide-scrollbar overflow-auto">
    {#each notificationArray as n (n.id)}
      <Notification
        title={n.title}
        body={n.body}
        icon={n.icon}
        badge={n.badge > 1 ? n.badge : undefined}
        class="mt-5 mx-3 {n.class}"
        colorBg="info"
        colorBody="black"
        on:dismiss={() => hide(n.id)}
      />
    {/each}
  </div>
{/if}