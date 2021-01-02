<script>
  import { isObject } from '../js/helpers'
  import { set, setAll, get, getAll, transact, clear, has, remove, each, add, keys, size, clearAll } from 'store2';
  
  export const localStorage = {
    set,
    setAll,
    get,
    getAll,
    transact,
    clear,
    has,
    remove,
    each,
    add,
    keys,
    size,
    clearAll,
  };

  if (isObject($$props.context)) {
    $$props.context.localStorage = localStorage;
  }
</script>