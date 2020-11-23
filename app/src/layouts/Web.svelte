<script>
  import { LayoutWeb, Bar } from 'sveltail';

  const click = () => {
    console.log('Button clicked');
  }
</script>

<LayoutWeb>
  <div slot="header">
    <Bar
      img="logo.png"
      title="Sveltail Cross Platform App"
      leftMenu
      rightMenu
      on:rightMenuClicked={click}
      on:rightMenuClicked={click}
    />
  </div>
</LayoutWeb>