export default {
  dismissElement(element) {
    if (element) element.parentElement.removeChild(element);
  },
  dismissParent(element) {
    if (element) {
      const el = element.parentElement; 
      if (el !== document.body) el.parentElement.removeChild(el);
    }
  },
  autoDismiss(element) {
    setTimeout(() => {
      if (element) element.parentElement.removeChild(element);
    }, 3000);
  },
};
