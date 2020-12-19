<script>
  import { createEventDispatcher, getContext } from 'svelte';
  import { escape, isEmpty, isNumeric, isEmail, isDate, isLength } from 'validator';

  import Icon from './Icon.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const { helpers } = getContext('$$app');
  const getType = (typ) => {
    const supportedTypes = ['text', 'number', 'tel', 'email', 'password'];

    let type = typ;
    if (supportedTypes.findIndex((i) => i === typ) < 0) type = 'text';

    return type;
  };
  const props = {
    class: helpers.isString($$props.class) ? $$props.class : '',
    label: helpers.isString($$props.label) ? $$props.label : null,
    icon: helpers.getIcon($$props.icon),
    iconRight: helpers.getIcon($$props.iconRight),
    flat: helpers.getBoolean($$props.flat),
    pill: helpers.getBoolean($$props.pill),
    rounded: helpers.getBoolean($$props.rounded),
    colorBg: helpers.getColor($$props.colorBg, 'primary'),
    colorText: helpers.getColor($$props.colorText, 'white'),
    height: helpers.getHeight($$props.size, 'md'),
    width: helpers.getWidth($$props.size, 'md'),
    textSize: helpers.getTextSize($$props.size, 'md'),
    clearable: helpers.getBoolean($$props.clearable),

    validate: helpers.isFunction($$props.validate) ? $$props.validate : null,
    autoValidate: helpers.getBoolean($$props.autoValidate),
    type: getType($$props.type),
    hideHint: helpers.getBoolean($$props.hideHint),
    iconWidth: helpers.getTextWidth($$props.size, 'md'),
    
    // Validation Options
    required: helpers.getBoolean($$props.required),
    min: helpers.isNumber($$props.min) ? $$props.min : null,
    max: helpers.isNumber($$props.max) ? $$props.max : null, 
  };

  let isFocused = false;
  let error = null;
  let input = null;
  let value = null;
  const validate = () => {
    const cleanedStr = escape((value ? value : ''));

    let errMsg = null;
    if (props.validate) {
      const result = props.validate(cleanedStr);
      if (helpers.isString(result)) errMsg = result;
    }

    if (props.required) errMsg = !isEmpty(cleanedStr) && cleanedStr.trim() !== '' ? null : 'This is Required';

    if (props.autoValidate) {
      if (props.type === 'number') {
        error = isNumeric(cleanedStr, { no_symbols: true }) ? null : 'Only numbers are allowed';
        const { min, max } = props;
        if (min) error = Number(cleanedStr) >= Number(min) ? null : `Must be greater than or equal to ${min}`;
        if (max) error = Number(cleanedStr) <= Number(max) ? null : `Must be less than or equal to ${max}`;
      } else if (type === 'tel') error = isNumeric(cleanedStr) ? null : 'Invalid Number';
      else if (type === 'email') error = isEmail(cleanedStr) ? null : 'Invalid Email';
      else if (type === 'date') error = isDate(cleanedStr) ? null : 'Invalid Date';
      else if (type === 'text' || type === 'password') {
        const { min, max } = props;
        if (min || max) {
          error = isLength(cleanedStr, { min: min ? min : 0, max: max ? max : undefined })
            ? null
            : min && max
              ? `Must be between ${min} and ${max} Characters`
              : min
                ? `Must be at least ${min} Characters`
                : `Must be less than ${max} Characters`;
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

  console.log(props.iconWidth);

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
        bg-{props.colorBg}
        border-{props.colorBg === 'transparent' ? props.colorText : props.colorBg}
        {props.rounded || props.pill ? 'rounded' : ''}
        {props.pill ? 'rounded-full' : 'px-2'}
        {props.pill && $$props.size === 'xs' ? 'px-3' : ''}
        {props.pill && $$props.size === 'sm' ? 'px-4' : ''}
        {props.pill && ($$props.size === 'md' || !$$props.size) ? 'px-5' : ''}
        {props.pill && $$props.size === 'lg' ? 'px-6' : ''}
        {props.pill && $$props.size === 'xl' ? 'px-8' : ''}
        {props.class}
        {props.height}
      "
      on:click={focusInput}
    >
        {#if props.icon}<Icon icon={props.icon} class="mx-1" size={$$props.size} />{/if}
        <div class="relative inline-flex items-center {isFocused || value ? 'h-full' : props.height}">
          {#if props.label}
            <label
              class="
                cursor-text
                absolute
                whitespace-nowrap
                bg-transparent
                left-0
                text-{props.colorText}
                {isFocused || value ? `top-0 text-${$$props.size} leading-none` : props.textSize}
              "
              for=""
            >
              {props.label}
            </label>
          {/if}
        </div>
        <input
          bind:this={input}
          bind:value={value}
          style={props.colorBg === 'transparent' ? 'background-color: inherit;' : ''}
          class="mt-2 flex-grow focus:outline-none bg-{props.colorBg === 'transparent' ? '' : props.colorBg} text-{props.colorText} {props.textSize}"
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
        <div class="flex justify-end {props.iconWidth}">
          {#if error}
            <Icon icon="fas fa-info-circle" size={$$props.size} class="text-danger" />
          {/if}
        </div>
        {#if props.clearable}
          <div class="mx-1 cursor-pointer transition ease-in-out transform hover:scale-110" on:click={clearAll}>  
            <Icon icon="fas fa-times-circle" class="text-{props.colorText}" size={$$props.size} />
          </div>
        {/if}
        {#if props.iconRight}
          <Icon icon={props.iconRight} class="text-{props.colorText}" size={$$props.size} />
        {/if}
    </div>
    {#if !props.hideHint}
      <div
        class="
          select-none
          h-auto
          pb-1
          {props.textSize}
          {error ? 'text-danger' : 'text-white dark:text-black'}
          {props.pill ? '' : 'px-2'}
          {props.pill && $$props.size === 'xs' ? 'px-3' : ''}
          {props.pill && $$props.size === 'sm' ? 'px-4' : ''}
          {props.pill && ($$props.size === 'md' || !$$props.size) ? 'px-5' : ''}
          {props.pill && $$props.size === 'lg' ? 'px-6' : ''}
          {props.pill && $$props.size === 'xl' ? 'px-8' : ''}
        "
      >
        {error || '|'}
      </div>
    {/if}
  </div>
{/if}
  