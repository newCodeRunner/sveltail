<script>
  import { createEventDispatcher } from 'svelte';
  import { escape, isEmpty, isNumeric, isEmail, isDate, isLength } from 'validator';

  import { getString, getIcon, getBoolean, getNumber, getColor, getHeight, getWidth, getTextSize, isFunction } from '../js/helpers';
  
  import Icon from './Icon.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const getType = (typ) => {
    const supportedTypes = ['text', 'number', 'tel', 'email', 'password'];

    let type = typ;
    if (supportedTypes.findIndex((i) => i === typ) < 0) type = 'text';

    return type;
  };

  let _size, _class, _label, _icon, _iconRight, _flat, _pill, _rounded, _colorBg,_colorText, _height,
  _width, _textSize, _clearable, _validate, _autoValidate, _type, _hideHint, _required, _min, _max;

  $: _size = getString($$props.size, 'md');
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, null);
  $: _icon = getIcon($$props.icon);
  $: _iconRight = getIcon($$props.iconRight);
  $: _flat = getBoolean($$props.flat);
  $: _pill = getBoolean($$props.pill);
  $: _rounded = getBoolean($$props.rounded);
  $: _colorBg = getColor($$props.colorBg, 'primary');
  $: _colorText = getColor($$props.colorText, 'white');
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
  $: _min = getNumber($$props.min, null);
  $: _max = getNumber($$props.max, null); 

  let isFocused = false;
  let error = null;
  let input = null;
  let value = null;
  const validate = () => {
    const cleanedStr = escape((value ? value : ''));

    let errMsg = null;
    if (_validate) {
      const result = _validate(cleanedStr);
      if (helpers.isString(result)) errMsg = result;
    }

    if (_required) errMsg = !isEmpty(cleanedStr) && cleanedStr.trim() !== '' ? null : 'This is Required';

    if (_autoValidate) {
      if (_type === 'number') {
        error = isNumeric(cleanedStr, { no_symbols: true }) ? null : 'Only numbers are allowed';
        if (_min) error = Number(cleanedStr) >= Number(_min) ? null : `Must be greater than or equal to ${_min}`;
        if (_max) error = Number(cleanedStr) <= Number(_max) ? null : `Must be less than or equal to ${_max}`;
      } else if (_type === 'tel') error = isNumeric(cleanedStr) ? null : 'Invalid Number';
      else if (_type === 'email') error = isEmail(cleanedStr) ? null : 'Invalid Email';
      else if (_type === 'date') error = isDate(cleanedStr) ? null : 'Invalid Date';
      else if (_type === 'text' || _type === 'password') {
        if (_min || _max) {
          error = isLength(cleanedStr, { min: _min ? _min : 0, max: _max ? _max : undefined })
            ? null
            : _min && _max
              ? `Must be between ${_min} and ${_max} Characters`
              : _min
                ? `Must be at least ${_min} Characters`
                : `Must be less than ${_max} Characters`;
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
    dispatch('change', val);
  };
  const clearAll = () => {
    value = null
  };

  $: onChange(value);
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
        cursor-text
        {isFocused && !error ? 'border-2 border-black dark:border-white' : ''}
        {error ? 'border-3 border-danger' : ''}
        bg-{_colorBg}
        border-{_colorBg === 'transparent' ? _colorText : _colorBg}
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
        class="mt-2 flex-grow focus:outline-none bg-{_colorBg === 'transparent' ? '' : _colorBg} text-{_colorText} {_textSize}"
        tabindex="0"
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
    </div>
    {#if !_hideHint}
      <div
        class="
          select-none
          h-auto
          pb-1
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
