<script>
  import { createEventDispatcher } from 'svelte';
  import {
    escape, isEmpty, isNumeric, isEmail, isDate, isLength, toBoolean,
  } from 'validator';
  import Icon from './Icon.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const debounce = $$props.debounce === undefined ? 300 : $$props.debounce;
  const type = $$props.type === undefined ? 'text' : $$props.type;
  const noDefaultValidation = $$props.noDefaultValidation === undefined ? false : $$props.noDefaultValidation;
  
  let active = false;
  export let value = type === 'number' ? 0 : null;
  export let error = null;

  let inputRef = null;
  $: if (inputRef !== null) inputRef.value = value;

  let timer = null;
  const id = Math.random().toString(36).substr(2, 4) + new Date().getTime();
  const validate = () => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      const clean = escape((inputRef.value));
      if (noDefaultValidation === false) {
        if (toBoolean($$props.required === undefined ? 'false' : String($$props.required))) {
          error = !isEmpty(clean) ? null : 'This is Required';
        }
        if (type === 'number') {
          error = isNumeric(clean, { no_symbols: true }) ? null : 'Only numbers are allowed';
          // eslint-disable-next-line max-len
          if ($$props.min !== undefined) error = Number(clean) >= Number($$props.min) ? null : `Must be greater than or equal to ${$$props.min}`;
          if ($$props.max !== undefined) error = Number(clean) <= Number($$props.max) ? null : `Must be less than or equal to ${$$props.max}`;
        } else if (type === 'tel') error = isNumeric(clean) ? null : 'Invalid Number';
        else if (type === 'email') error = isEmail(clean) ? null : 'Invalid Email';
        else if (type === 'date') {
          error = isDate(clean) ? null : 'Invalid Date';
        } else if (type === 'text' || type === 'password') {
          if ($$props.minLength !== undefined || $$props.minLength !== undefined) {
            const min = $$props.minLength === undefined ? 0 : $$props.minLength;
            const max = $$props.maxLength === undefined ? undefined : $$props.maxLength;

            // eslint-disable-next-line no-nested-ternary
            error = isLength(clean, { min, max })
              ? null
              // eslint-disable-next-line no-nested-ternary
              : $$props.minLength !== undefined && $$props.maxLength !== undefined
                ? `Must be between ${min} and ${max} Characters`
                : $$props.minLength !== undefined
                  ? `Must be at least ${min} Characters`
                  : `Must be less than ${max} Characters`;
          }
        }
      }

      if ($$props.customValidator !== undefined) error = $$props.customValidator(inputRef.value);

      value = clean;
    }, debounce);
  };
  $: dispatch('change', value);

  const props = $$props;
</script>

<div
  class="
    flex
    inline-flex
    w-full
    {type === 'textarea' ? 'items-start' : 'items-center'}
    {props.flat ? '' : `border border-${props.color}`}
    {props.rounded || props.pill ? 'rounded' : ''}
    {props.pill && type !== 'textarea' ? 'rounded-full px-3' : ''}
    {props.filled ? `bg-${props.color} text-current` : `text-${props.color}`}
    {props.class}
  "
>
  <span class="{props.height}" on:click={() => { dispatch('prependClicked'); }}>
    <slot name="prepend">
      {#if props.icon}
        <div class="h-full p-3 {props.width}">
          <Icon icon={props.icon} size="auto" class="h-full w-full" />
        </div>
      {/if}
    </slot>
  </span>

  <div class="relative z-0 px-1 flex flex-1 items-center {type === 'textarea' ? '' : props.height}">
    <label
      for="input-{id}"
      class="
        absolute
        z-20
        text-current
        flex
        {type === 'textarea' ? 'py-2 items-start' : 'items-center'}
        {active || (value !== '' && value !== null) ? 'text-xs top-0 h-fit' : `h-full w-full cursor-text ${props.textSize}`}
        {(active || (value !== '' && value !== null)) && type === 'textarea' ? 'hidden' : ''}
      "
      tabindex="-1"
      on:click={() => {
        if (inputRef) inputRef.focus();
      }}
    >
      <span>{props.label ? props.label : ''}</span>
    </label>
    {#if type === 'textarea'}
      <textarea
        bind:this={inputRef}
        class="h-48 w-full focus:outline-none bg-input-none pt-3 {props.textSize}"
        placeholder=""
        on:input={validate}
        on:focus={() => { active = true; }}
        on:blur={() => { active = false; }}
      />
    {:else}
      <input
        bind:this={inputRef}
        class="h-full w-full focus:outline-none bg-input-none {props.textSize}"
        placeholder=""   
        on:input={validate}
        on:focus={() => { active = true; }}
        on:blur={() => { active = false; }}
      />
    {/if}
    <div class="absolute text-xs bottom-0 text-danger h-fit">
      {error === null ? '' : error}
    </div>
  </div>
  
  <span class="{props.height}" on:click={() => { dispatch('appendClicked'); }}>
    <slot name="append">
      {#if props.iconRight}
        <div class="h-full p-3 {props.width}">
          <Icon icon={props.iconRight} size="auto" class="h-full w-full" />
        </div>
      {/if}
    </slot>
  </span>
</div>