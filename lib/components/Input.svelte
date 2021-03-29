<script>
  import { createEventDispatcher } from 'svelte';
  import { escape, isEmpty, isNumeric, isEmail, isDate, isLength } from 'validator';

  import { getString, getBoolean, getNumber, getColor, getHeight, getWidth, getTextSize, isFunction } from '../js/helpers';
  import IconError from '../icons/Error.svelte';
  import IconClearable from '../icons/Clearable.svelte';
  
  // Globals
  const dispatch = createEventDispatcher();
  const getType = (typ) => {
    const supportedTypes = ['text', 'number', 'tel', 'email', 'password'];

    let type = typ;
    if (supportedTypes.findIndex((i) => i === typ) < 0) type = 'text';

    return type;
  };

  let _size, _class, _label, _pill, _rounded, _colorBg,_colorText, _height,
  _width, _textSize, _clearable, _validate, _autoValidate, _type, _hideHint, _required, _min, _max, _disabled;

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

  $: _validate = isFunction($$props.validate) ? $$props.validate : null;
  $: _autoValidate = getBoolean($$props.autoValidate);
  $: _type = getType($$props.type);
  $: _hideHint = getBoolean($$props.hideHint);
    
  // Validation Options
  $: _required = getBoolean($$props.required);
  $: _min = getString($$props.min ? String($$props.min) : null, null);
  $: _max = getString($$props.max ? String($$props.max) : null, null); 

  $: _disabled = getBoolean($$props.disabled, false);

  let isFocused = false;
  let input = null;
  
  export let error = null;
  export let value = null;

  const validate = () => {
    const cleanedStr = escape((value ? String(value) : '')).trim();

    let errMsg = null;
    if (_validate) {
      const result = _validate(cleanedStr);
      if (helpers.isString(result)) errMsg = result;
    }

    if (_required && !errMsg) errMsg = !isEmpty(cleanedStr) && cleanedStr.trim() !== '' ? null : 'This is Required';

    if (_autoValidate && !errMsg) {
      if (_type === 'number') {
        const num = Number(cleanedStr);
        errMsg = isNumeric(cleanedStr, { no_symbols: true }) ? null : 'Only numbers are allowed';
        if (_min && !errMsg) {
          const min = getNumber(Number(_min), -Infinity);
          errMsg = num >= min ? null : `Must be at least ${_min}`;
        }
        if (_max && !errMsg) {
          const max = getNumber(Number(_max), Infinity);
          errMsg = num <= max ? null : `Must be at most ${_max}`;
        }
      } else if (_type === 'tel') errMsg = isNumeric(cleanedStr) ? null : 'Invalid Number';
      else if (_type === 'email') errMsg = isEmail(cleanedStr) ? null : 'Invalid Email';
      else if (_type === 'date') errMsg = isDate(cleanedStr) ? null : 'Invalid Date';
      else if (_type === 'text' || _type === 'password') {
        if (_min && _max) {
          errMsg = isLength(cleanedStr, { min: _min, max: _max })
            ? null
            : _min === _max
                ? `Must be ${_min} characters`
                : `Must be ${_min}-${_max} characters`;
        } else if (_min) {
          errMsg = isLength(cleanedStr, { min: _min })
            ? null
            : `Must be at least ${_min} characters`;
        } else if (_max) {
          errMsg = isLength(cleanedStr, { max: _max })
            ? null
            : `Must be at most ${_max} characters`;
        }
      }
    }

    if (errMsg) error = errMsg;
    else error = null;
  };
  const focusInput = () => {
    if (input) input.focus();
  };
  const onChange = (val) => {
    error = null;
    dispatch('change', val);
  };
  const onClick = () => {
    focusInput();
    dispatch('click');
  };
  const onBlur = () => {
    validate();
    isFocused = false;
    dispatch('blur');
  };
  const onFocus = () => {
    isFocused = true;
    dispatch('focus');
  };
  const clearAll = () => {
    value = null
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
    <div
      class="
        inline-flex
        items-center
        border
        bg-{_colorBg}
        text-{_colorText}
        {_disabled ? 'cursor-not-allowed' : 'cursor-text'}
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
      on:click={onClick}
    >
      <slot name="icon" />
      <div class="relative inline-flex items-center {isFocused || value ? 'h-full' : _height}">
        {#if _label}
          <label
            class="
              absolute
              whitespace-nowrap
              bg-transparent
              left-0
              {_disabled ? 'cursor-not-allowed' : 'cursor-text'}
              {isFocused || value ? `top-0 text-${_size} leading-none` : _textSize}
              {error ? 'text-danger' : ''}
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
        class="-{_width} focus:outline-none {_label ? 'mt-2' : ''} bg-{_colorBg === 'transparent' ? 'inherit' : _colorBg} {_textSize}"
        tabindex="0"
        disabled={_disabled}
        on:blur={onBlur}
        on:focus={onFocus}
        on:change={onChange}
      />
      <div class="{_width} {_hideHint ? 'cursor-pointer' : ''}" title={_hideHint ? error : undefined}>
        {#if error}
          <IconError size={_size} class="p-2 overflow-visible {error ? 'text-danger' : ''}" />
        {/if}
      </div>
      {#if _clearable}
        <div class="-mx-2 cursor-pointer {_width}" on:click={clearAll} title="Clear">  
          <IconClearable class="p-2 transition ease-in-out transform hover:scale-110" size={_size} />
        </div>
      {/if}
      <slot name="iconRight" />
    </div>
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
