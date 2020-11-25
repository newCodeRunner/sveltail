<script>
  import { Avatar, Button, Chip, Icon, Image } from 'sveltail';
</script>

<br>
<h1><strong>Avatars</strong></h1>

<h1>Square Avatars</h1>
<div class="inline-flex">
  <Avatar icon="fas fa-bars" size="xs" class="mx-1" colorBg="transparent" colorText="primary" />
  <Avatar icon="fas fa-bars" size="sm" class="mx-1" colorBg="info" />
  <Avatar icon="fas fa-bars" class="mx-1" colorBg="success" />
  <Avatar icon="fas fa-bars" size="lg" class="mx-1" colorBg="warning" />
  <Avatar icon="fas fa-bars" size="xl" class="mx-1" colorBg="danger" />
  <Avatar img="assets/logo.png" size="xl" class="mx-1" />
  <Avatar letter="Mary" size="xl" class="mx-1" colorBg="accent" />
  <Avatar letter="m" class="mx-1" colorBg="brand" />
</div>

<br>
<br>
<h1>Circle Avatars</h1>
<div class="inline-flex">
  <Avatar icon="fas fa-bars" size="xs" class="mx-1" circle colorBg="info" />
  <Avatar icon="fas fa-bars" size="sm" class="mx-1" circle colorBg="transparent" colorText="secondary" />
  <Avatar icon="fas fa-bars" class="mx-1" circle colorBg="success" />
  <Avatar img="assets/logo.png" class="mx-1" circle />
  <Avatar icon="fas fa-bars" size="lg" class="mx-1" circle colorBg="danger" />
  <Avatar icon="fas fa-bars" size="xl" class="mx-1" circle colorBg="transparent" colorText="success" />
  <Avatar letter="Mary" size="xl" class="mx-1" circle colorBg="accent" />
  <Avatar letter="m" class="mx-1" circle colorBg="brand" />
</div>


<br>
<h1><strong>Buttons</strong></h1>

<h1>Button Sizes Default</h1>
<div class="inline-flex items-center">
  <Button label="Size 'xs'" size="xs" class="mx-1" iconRight="fab fa-facebook" />
  <Button label="Size 'sm'" size="sm" class="mx-1" />
  <Button label="Size 'md'" size="md" class="mx-1" icon="fas fa-bars" iconRight="fab fa-facebook" />
  <Button label="Size 'lg'" size="lg" class="mx-1" />
  <Button label="Size 'xl'" size="xl" class="mx-1" icon="fas fa-bars" />
</div>

<br>
<br>

<h1>Rounded Buttons</h1>
<div class="inline-flex items-center">
  <Button label="Size 'xs'" size="xs" class="mx-1" rounded iconRight="fab fa-facebook" />
  <Button label="Size 'sm'" size="sm" class="mx-1" rounded />
  <Button label="Size 'md'" size="md" class="mx-1" rounded icon="fas fa-bars" iconRight="fab fa-facebook" />
  <Button label="Size 'lg'" size="lg" class="mx-1" rounded />
  <Button label="Size 'xl'" size="xl" class="mx-1" rounded icon="fas fa-bars" />
</div>

<br>
<br>

<h1>Pill Buttons</h1>
<div class="inline-flex items-center">
  <Button label="Pill Size 'xs'" size="xs" class="mx-1" pill iconRight="fab fa-facebook" />
  <Button label="Pill Size 'sm'" size="sm" class="mx-1" pill />
  <Button label="Pill Size 'md'" size="md" class="mx-1" pill icon="fas fa-bars" iconRight="fab fa-facebook" />
  <Button label="Pill Size 'lg'" size="lg" class="mx-1" pill icon="fas fa-search" />
  <Button label="Pill Size 'xl'" size="xl" class="mx-1" pill icon="fas fa-bars" />
</div>

<br>
<br>

<h1>Compared</h1>
<div class="inline-flex items-center">
  <Button label="Pill Size 'sm'" size="sm" class="mx-1" pill colorBg="secondary" />
  <Button label="Rounded Size 'sm'" size="sm" class="mx-1" rounded />
  <Button label="Default Size 'sm'" size="sm" class="mx-1" colorBg="warning" />
</div>

<br>
<br>

<h1>Button Group of different Color Buttons</h1>
<div class="inline-flex items-center">
  <Button label="Primary" size="xs" />
  <Button label="Secondary" colorBg="secondary" size="xs" />
  <Button label="Info" colorBg="info" size="xs" iconRight="fab fa-facebook" />
  <Button label="Warning" colorBg="warning" size="xs" />
  <Button label="Danger" colorBg="danger" size="xs" icon="fas fa-bars" iconRight="fab fa-facebook" />
  <Button label="Success" colorBg="success" size="xs" />
  <Button label="Brand" colorBg="brand" size="xs" icon="fas fa-bars" />
  <Button label="Accent" colorBg="accent" size="xs" />
</div>

<br>
<br>

<h1>Button Group of different Outline Color Buttons</h1>
<div class="inline-flex items-center">
  <Button label="Primary" colorBg="transparent" colorText="primary" size="xs" icon="fas fa-bars" />
  <Button label="Secondary" colorBg="transparent" colorText="secondary" size="xs" />
  <Button label="Warning" colorBg="transparent" colorText="warning" size="xs" iconRight="fas fa-bars" />
  <Button label="Danger" colorBg="transparent" colorText="danger" size="xs" />
  <Button label="Success" colorBg="transparent" colorText="success" size="xs" />
  <Button label="Info" colorBg="transparent" colorText="info" size="xs" icon="fas fa-bars" iconRight="fab fa-facebook" />
  <Button label="Brand" colorBg="transparent" colorText="brand" size="xs" />
  <Button label="Accent" colorBg="transparent" colorText="accent" size="xs" />
</div>

<br>
<br>

<h1>Button Group of Flat Color Buttons</h1>
<div class="inline-flex items-center">
  <Button label="Primary" flat colorBg="transparent" colorText="primary" size="xs" />
  <Button label="Secondary" flat colorBg="transparent" colorText="secondary" size="xs" />
  <Button label="Info" flat colorBg="transparent" colorText="info" size="xs" iconRight="fab fa-facebook" />
  <Button label="Warning" flat colorBg="transparent" colorText="warning" size="xs" />
  <Button label="Danger" flat colorBg="transparent" colorText="danger" size="xs" />
  <Button label="Success" flat colorBg="transparent" colorText="success" size="xs" icon="fas fa-bars" iconRight="fab fa-facebook" />
  <Button label="Brand" flat colorBg="transparent" colorText="brand" size="xs"icon="fas fa-bars"  />
  <Button label="Accent" flat colorBg="transparent" colorText="accent" size="xs" />
</div>

<br>
<br>

<h1>Circle-Icon Buttons</h1>
<div class="inline-flex items-center">
  <Button size="xs" circle iconRight="fas fa-bars" class="mx-1" />
  <Button colorBg="secondary" size="sm" circle icon="fas fa-bars" class="mx-1" />
  <Button colorBg="transparent" colorText="info" size="md" circle iconRight="fas fa-bars" class="mx-1" />
  <Button colorBg="warning" size="lg" circle icon="fas fa-bars" class="mx-1" />
  <Button colorBg="danger" size="xl" circle iconRight="fas fa-bars" class="mx-1" />
</div>

<br>
<br>

<h1>Square-Icon Buttons</h1>
<div class="inline-flex items-center">
  <Button size="xs" iconRight="fas fa-bars" class="mx-1" />
  <Button colorBg="secondary" size="sm" icon="fas fa-bars" class="mx-1" />
  <Button colorBg="transparent" colorText="info" size="md" iconRight="fas fa-bars" class="mx-1" />
  <Button colorBg="warning" size="lg" icon="fas fa-bars" class="mx-1" />
  <Button colorBg="danger" size="xl" iconRight="fas fa-bars" class="mx-1" />
</div> 

<br>
<br>

<h1><strong>FontAwesome Support out of the box!</strong></h1>
<br>

<h1>Sizes</h1>
<Icon icon="fas fa-bars" size="xs" />
<Icon icon="fas fa-bars" size="sm" />
<Icon icon="fas fa-bars" />
<Icon icon="fas fa-bars" size="lg" />
<Icon icon="fas fa-bars" size="xl" />
<Icon icon="fas fa-bars" fontSize="100" />

<h1>Colors</h1>
<Icon icon="fas fa-bars" size="xs" class="text-primary" />
<Icon icon="fas fa-bars" size="sm" class="text-secondary" />
<Icon icon="fas fa-bars" class="text-success" />
<Icon icon="fas fa-bars" size="lg" class="text-info" />
<Icon icon="fas fa-bars" size="xl" class="text-danger" />
<Icon icon="fas fa-bars" fontSize="100" class="text-warning" />

<br>
<h1><strong>Chips</strong></h1>
<br>

<Chip size="xs" label="Primary Chip" />
<Chip size="xs" label="Secondary Chip" pill colorBg="secondary" class="mx-1" />
<Chip size="xs" label="Info Chip" class="mx-1" icon="fas fa-search" />
<Chip size="xs" label="Success Chip" pill colorBg="success" class="mx-1" icon="fas fa-bars" />
<Chip size="xs" label="Danger Chip" colorBg="danger" class="mx-1" icon="fas fa-download" dismissable />

<br>
<br>

<h1>Sizes</h1>
<Chip size="xs" label="Primary Chip" icon="fab fa-youtube" />
<Chip size="sm" label="Secondary Chip" pill colorBg="secondary" class="mx-1" icon="fas fa-bars" />
<Chip label="Info Chip" class="mx-1" icon="fas fa-search" />
<Chip size="lg" label="Success Chip" pill colorBg="success" class="mx-1" icon="fas fa-bars" dismissable />
<Chip size="xl" label="Danger Chip" colorBg="danger" class="mx-1" icon="fas fa-download" dismissable />


<Image />
