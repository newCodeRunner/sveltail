<script>
  import { createEventDispatcher } from 'svelte';
  import { getString, getIcon, getBoolean, getColor, getHeight, getWidth, getTextSize, getArray, isString, isObject } from '../js/helpers';
  
  import Icon from './Icon.svelte';
  import Menu from './Menu.svelte';
  import ListItem from './ListItem.svelte';
import { prop_dev } from 'svelte/internal';

  // Globals
  export let error = null;
  export let value = null;

  const dispatch = createEventDispatcher();

  let _size, _class, _label, _icon, _iconRight, _pill, _rounded, _colorBg,_colorText, _height,
  _width, _textSize, _clearable, _hideHint, _required, _options, _valueKey, _labelKey;

  $: _size = getString($$props.size, 'md');
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, null);
  $: _icon = getIcon($$props.icon);
  $: _iconRight = getIcon($$props.iconRight);
  $: _pill = getBoolean($$props.pill);
  $: _rounded = getBoolean($$props.rounded);
  $: _colorBg = getColor($$props.colorBg, 'transparent');
  $: _colorText = getColor($$props.colorText, 'dark');
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
    <Menu>
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
          {isFocused && !error ? 'border-2 border-black dark:border-white' : ''}
          {error ? 'border-3 border-danger' : ''}
          bg-{_colorBg}
          border
          border-{_colorBg === 'transparent' ? 'dark' : _colorBg}
          dark:border-{_colorBg === 'transparent' ? 'light' : _colorBg}
          {_rounded || _pill ? 'rounded' : ''}
          {_pill ? 'rounded-full' : 'px-2'}
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
        {#if _icon}<Icon icon={_icon} class="mx-1" size={_size} />{/if}
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
          style={_colorBg === 'transparent' ? 'background-color: inherit;' : ''}
          class="cursor-pointer flex-grow focus:outline-none {_label ? 'mt-2' : ''} bg-{_colorBg === 'transparent' ? '' : _colorBg} text-{_colorText} {_textSize}"
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
            <Icon icon="fas fa-info-circle" size={_size} class="text-danger" />
          {/if}
        </div>
        {#if _clearable}
          <div class="mx-1 cursor-pointer transition ease-in-out transform hover:scale-110" on:click={clearAll}>  
            <Icon icon="fas fa-times-circle" class="text-{_colorText}" size={_size} />
          </div>
        {/if}
        {#if _iconRight}
          <Icon icon={_iconRight} class="text-{_colorText}" size={_size} />
        {/if}
        <Icon icon="fas fa-chevron-down" size={_size} />
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
  