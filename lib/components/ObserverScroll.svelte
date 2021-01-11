<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { getBoolean } from '../js/helpers';

  const dispatch = createEventDispatcher();

  let intersecting = false;
  let container;

  let _onlyOnce;
  $: _onlyOnce = getBoolean($$props.onlyOnce);
  
  onMount(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          intersecting = entries[0].isIntersecting;
          const satisfied = intersecting === true;
          if (satisfied && _onlyOnce === true) observer.unobserve(container);
          else if (satisfied) dispatch('inView');
          else if (!satisfied) dispatch('outView');
        },
        {
          rootMargin: '0px 0px 0px 0px',
        },
      );
      observer.observe(container);
      return () => observer.unobserve(container);
    } else {
      const handler = () => {
        const bcr = container.getBoundingClientRect();
        intersecting = (bcr.bottom > 0
          && bcr.right > 0
          && bcr.top < window.innerHeight
          && bcr.left < window.innerWidth);
        const satisfied = intersecting === true;
        if (satisfied && _onlyOnce === true) window.removeEventListener('scroll', handler);
        else if (satisfied) dispatch('inView');
        else if (!satisfied) dispatch('outView');
      };
      window.addEventListener('scroll', handler);
      return () => window.removeEventListener('scroll', handler);
    }
  });
</script>

<div bind:this={container} />