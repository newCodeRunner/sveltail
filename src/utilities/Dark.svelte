<script>
  import { createEventDispatcher, onMount } from 'svelte';

  import '../css/dark.css';

  // Globals
  const dispatch = createEventDispatcher();
  const setDark = () => {
    const className = document.body.getAttribute('class');
    if (className === null) document.body.setAttribute('class', 'dark');
    else {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  };
  const setLight = () => {
    const className = document.body.getAttribute('class');
    if (className === null) document.body.setAttribute('class', 'light');
    else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  };

  if (window.matchMedia !== undefined) {
    const updateTheme = () => {
      const className = document.body.getAttribute('class');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (className === null) document.body.setAttribute('class', 'dark');
        else {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        }
      } else if (className === null) document.body.setAttribute('class', 'light');
      else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    };

    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        updateTheme();
      });
    } catch {
      window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
        updateTheme();
      });
    }
  }

  onMount(() => {
    dispatch('ready', { dark: { setDark, setLight } });
  });
</script>