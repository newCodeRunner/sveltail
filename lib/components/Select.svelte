<script>
  import { createEventDispatcher } from 'svelte';
  import { getString, getBoolean, getColor, getHeight, getWidth, getTextSize, getArray, isString, isObject } from '../js/helpers';
  
  import Menu from './Menu.svelte';
  import ListItem from './ListItem.svelte';

  import IconError from '../icons/Error.svelte';
  import IconClearable from '../icons/Clearable.svelte';
  import IconArrowDown from '../icons/ArrowDown.svelte';

  // Globals
  export let error = null;
  export let value = null;

  const dispatch = createEventDispatcher();

  let _size, _class, _label, _pill, _rounded, _colorBg,_colorText, _height,
  _width, _textSize, _clearable, _hideHint, _required, _options, _valueKey, _labelKey;

  $: _size = getString($$props.size, 'md');
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, null);
  $: _pill = getBoolean($$props.pill);
  $: _rounded = getBoolean($$props.rounded);
  $: _colorBg = getColor($$props.colorBg, 'transparent');
  $: _colorText = getColor($$props.colorText, 'current');
  $: _height = getHeight($$props.size, 'md');
  $: _width = getWidth($$props.size, 'md');
  $: _textSize = getTextSize($$props.size, 'md');
  $: _clearable = getBoolean($$props.clearable);

  $: _hideHint = getBoolean($$props.hideHint);
    
  // Validation Options
  $: _required = getBoolean($$props.required);

  // Data Options
  $: _valueKey = getString($$props.valueKey, 'value');
  $: _labelKey = getString($$props.labelKey, 'label');

  $: _options = getArray($$props.options, []).map((i) => {
    return {
      label: isString(i)
        ? i
        : isObject(i)
          ? i[_labelKey]
            ? i[_labelKey]
            : i[_valueKey] ? i[_valueKey] : 'No "label" key set'
          : 'No "label" Set',
      value: isString(i)
        ? i
        : isObject(i)
          ? i[_valueKey]
            ? i[_valueKey]
            : i[_labelKey] ? i[_labelKey] : 'No "value" key set'
          : 'No "value" Set',
    }
  });

  let isFocused = false;
  let input = null;

  const validate = () => {
    let errMsg = null;
    if (_required) errMsg = value ? null : 'This is Required';
    if (errMsg) error = errMsg;
    else error = null;
  };
  const focusInput = () => {
    if (input) input.focus();
  };
  const onChange = (val) => {
    dispatch('change', val);
  };
  const clearAll = () => {
    value = null
  };
  const _setValue = (newValue) => {
    value = newValue;
  };

  $: onChange(value);

  let _visible;
  const _toggle = ({ detail }) => {
    _visible = detail;
  }

  export const isValid = () => {
    validate();
    return error === null;
  };
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <!--  -->
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  <div>
    <Menu on:toggle={_toggle}>
      <div slot="items">
        {#if _options.length > 0}
          {#each _options as opt, o (o)}
            <ListItem class="px-2" on:click={_setValue(opt.value)}>{opt.label}</ListItem>
          {/each}
        {:else}
          <div class="px-2">No Data</div>
        {/if}
      </div>

      <div
        class="
          inline-flex
          items-center
          cursor-pointer
          border
          bg-{_colorBg}
          text-{_colorText}
          {isFocused && !error ? 'border-2 border-black dark:border-white' : ''}
          {error        
            ? 'border-danger'
            : `border-${_colorBg === 'transparent' ? 'dark' : _colorBg}
            dark:border-${_colorBg === 'transparent' ? 'light' : _colorBg}`
          }
          {_rounded || _pill ? 'rounded' : ''}
          {_pill ? 'rounded-full' : 'pl-2'}
          {_pill && _size === 'xs' ? 'px-3' : ''}
          {_pill && _size === 'sm' ? 'px-4' : ''}
          {_pill && _size === 'md' ? 'px-5' : ''}
          {_pill && _size === 'lg' ? 'px-6' : ''}
          {_pill && _size === 'xl' ? 'px-8' : ''}
          {_class}
          {_height}
        "
        on:click={focusInput}
      >
        <slot name="icon" />
        <div class="relative inline-flex items-center {isFocused || value ? 'h-full' : _height}">
          {#if _label}
            <label
              class="
                cursor-text
                absolute
                whitespace-nowrap
                bg-transparent
                left-0
                text-{_colorText}
                {isFocused || value ? `top-0 text-${_size} leading-none` : _textSize}
              "
              for=""
            >
              {_label}
            </label>
          {/if}
        </div>
        <input
          bind:this={input}
          bind:value={value}
          class="cursor-pointer flex-grow focus:outline-none {_label ? 'mt-2' : ''} bg-{_colorBg === 'transparent' ? 'inherit' : _colorBg} text-{_colorText} {_textSize}"
          tabindex="0"
          readonly
          on:blur={() => {
            validate();
            isFocused = false;
          }}
          on:focus={() => {
            isFocused = true;
          }}
          on:change={onChange}
        />
        <div class="flex justify-end {_width}">
          {#if error}
            <IconError size={_size} />
          {/if}
        </div>
        {#if _clearable}
          <div class="mx-1 cursor-pointer" on:click={clearAll}>  
            <IconClearable class="transition ease-in-out transform hover:scale-110" size={_size} />
          </div>
        {/if}
        <slot name="iconRight" />
        <IconArrowDown size={_size} class="p-2 transition transform {_visible ? 'rotate-180' : 'rotate-0'}" />
      </div>
    </Menu>
    {#if !_hideHint}
      <div
        class="
          select-none
          h-auto
          {_textSize}
          {error ? 'text-danger' : 'text-light dark:text-dark'}
          {_pill ? '' : 'px-2'}
          {_pill && _size === 'xs' ? 'px-3' : ''}
          {_pill && _size === 'sm' ? 'px-4' : ''}
          {_pill && _size === 'md' ? 'px-5' : ''}
          {_pill && _size === 'lg' ? 'px-6' : ''}
          {_pill && _size === 'xl' ? 'px-8' : ''}
        "
      >
        {error || '|'}
      </div>
    {/if}
  </div>
{/if}
  