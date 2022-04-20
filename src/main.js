class BaseElement extends HTMLElement {
  static shadow = null;
  static styleName = '';

  constructor() {
    super();
    this.styleName = `${this.tagName.toLowerCase()}-style`;
  }

  html() {
    return ``;
  }

  style() {
    return ``;
  }

  attr(target) {
    const name = typeof target === 'string' ? target : target[0];
    return this.getAttribute(name) || this.hasAttribute(name);
  }

  connectedCallback() {  
    if (this.hasAttribute('shadow')) {
      this.shadow = this.attachShadow({ mode: this.getAttribute('shadow') || 'open' });
    }

    this.render();
    this.onMount && this.onMount();
  }

  disconnectedCallback() {
    const stillHasElements = document.querySelectorAll(this.tagName).length;
    !stillHasElements && this.clear();
    this.onDestroy && this.onDestroy();
  }

  attributeChangedCallback(attribute, previousValue, currentValue) {    
    this.onAttrChange && this.isConnected && this.onAttrChange({
      attribute,
      previousValue,
      currentValue
    });
  }

  render() {
    const content = this.parseHtml();

    this.shadow ?
      this.shadow.replaceChildren(content) :
      this.replaceChildren(content);

    this.addStyle();
  }

  parseHtml() {
    const html = this.html();

    if (!html) {
      return '';
    }

    if (typeof html === 'string') {
      const template = Object.assign(document.createElement('template'), {
        innerHTML: this.html().trim()
      });

      return template.content.childNodes.length ? 
        template.content.cloneNode(true) : '';
    } else {
      return html;
    }
  }

  addStyle() {
    const styleExists = document.querySelector(`style[data-name=${this.styleName}]`);
    const style = Object.assign(document.createElement('style'), {
      innerHTML: this.style().trim()
    });

    style.dataset.name = this.styleName;
    this.shadow && this.shadow.append(style);
    !styleExists && !this.shadow && document.body.append(style);
  }

  clear() {
    const style = document.querySelector(`style[data-name=${this.styleName}]`);
    style && style.remove();
  }
}