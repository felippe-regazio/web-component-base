class ExampleElement extends BaseElement {
  static observedAttributes = [ 'test' ];
  
  constructor() {
    super();
  }

  html() {
    return `
      <img src="${this.attr`test`}"/>
      <p class="color-blue">${this.attr`test`}</p>
    `;
  }

  style() {
    return `
      .color-blue {
        color: blue;
      }
    `;
  }

  onMount() {
    console.log('example-element mounted');
  }

  onDestroy() {
    console.log('example-element destroyed');
  }

  onAttrChange(changed) {
    this.render();
    
    console.log('example-element attr changed', changed);
  }  
}

window.customElements.define('example-element', ExampleElement);