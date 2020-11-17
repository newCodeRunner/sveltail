<script>
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let intersecting = false;
  let container;

  const onlyOnce = $$props.onlyOnce === undefined ? false : $$props.onlyOnce;
  const reverse = $$props.reverse === undefined ? false : $$props.reverse;
  
  onMount(() => {
      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(
          (entries) => {
            intersecting = entries[0].isIntersecting;
            const satisfied = reverse ? intersecting === false : intersecting === true;
            if (satisfied && onlyOnce === true) observer.unobserve(container);
            if (satisfied) dispatch(reverse ? 'outView' : 'inView');
            else dispatch(reverse ? 'inView' : 'ouView');
          },
          {
            rootMargin: '0px 0px 0px 0px',
          },
        );
        observer.observe(container);
        return () => observer.unobserve(container);
      }

      const handler = () => {
        const bcr = container.getBoundingClientRect();
        intersecting = (bcr.bottom > 0
          && bcr.right > 0
          && bcr.top < window.innerHeight
          && bcr.left < window.innerWidth);
        const satisfied = reverse ? intersecting === false : intersecting === true;
        if (satisfied && onlyOnce === true) window.removeEventListener('scroll', handler);
        if (satisfied) dispatch(reverse ? 'outView' : 'inView');
        else dispatch(reverse ? 'inView' : 'ouView');
      };

      window.addEventListener('scroll', handler);
      return () => window.removeEventListener('scroll', handler);
  });
</script>

<div bind:this={container} />