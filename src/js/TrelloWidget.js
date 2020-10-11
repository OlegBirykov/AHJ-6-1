export default class TrelloWidget {
  constructor(container) {
    this.container = container;
  }

  static get markup() {
    return `
      <div data-widget="${this.ctrlId.widget}">
        ${this.createCol('Todo')}
        ${this.createCol('In progress')}
        ${this.createCol('Done')}
      </div>
    `;
  }

  static createCol(title) {
    return `
      <div data-id="${this.ctrlId.column}">
        <header>
          <h3>${title}</h3>
          <a href="#" data-id="${this.ctrlId.headerMenu}">&#x22EF;</a>
        </header>
        <div daia-id="${this.ctrlId.cards}">
        </div>
        <footer>
          <a href="#" data-id="${this.ctrlId.showForm}" data-visible="yes">+Add another card</a>
          <form data-id="${this.ctrlId.form}" data-visible="no">
            <textarea name="text" data-id="${this.ctrlId.newCardText}" rows="3" placeholder="Enter a title for this card" required></textarea>
            <div>
              <button type="submit" data-id="${this.ctrlId.addCard}">Add Card</button>
              <button type="reset" data-id="${this.ctrlId.hideForm}">&#x274C;</button> 
              <button type="button" data-id="${this.ctrlId.footerMenu}">&#x22EF;</button>  
            </div>          
          </form>
        </footer>
      </div>
    `;
  }

  static get ctrlId() {
    return {
      widget: 'trello',
      column: 'column',
      headerMenu: 'menu',
      cards: 'card-list',
      card: 'card',
      delete: 'delete-button',
      showForm: 'add-form-show',
      form: 'add-form',
      newCardText: 'add-form-text',
      addCard: 'add-button',
      hideForm: 'add-form-hide',
      footerMenu: 'add-form-menu',
    };
  }

  static get widgetSelector() {
    return `[data-widget=${this.ctrlId.widget}]`;
  }

  static get columnSelector() {
    return `[data-id=${this.ctrlId.column}]`;
  }

  static get headerMenuSelector() {
    return `[data-id=${this.ctrlId.headerMenu}]`;
  }

  static get cardsSelector() {
    return `[data-id=${this.ctrlId.cards}]`;
  }

  static get cardSelector() {
    return `[data-id=${this.ctrlId.card}]`;
  }

  static get deleteSelector() {
    return `[data-id=${this.ctrlId.delete}]`;
  }

  static get showFormSelector() {
    return `[data-id=${this.ctrlId.showForm}]`;
  }

  static get formSelector() {
    return `[data-id=${this.ctrlId.form}]`;
  }

  static get newCardTextSelector() {
    return `[data-id=${this.ctrlId.newCardText}]`;
  }

  static get addCardSelector() {
    return `[data-id=${this.ctrlId.addCard}]`;
  }

  static get hideFormSelector() {
    return `[data-id=${this.ctrlId.hideForm}]`;
  }

  static get footerMenuSelector() {
    return `[data-id=${this.ctrlId.footerMenu}]`;
  }

  bindToDOM() {
    this.container.innerHTML = this.constructor.markup;
    this.widget = this.container.querySelector(this.constructor.widgetSelector);

    this.cols = this.widget.querySelectorAll(this.constructor.columnSelector);

    this.cols.forEach((column) => {
      column.addEventListener('click', (event) => this.onClick(column, event));
    });
  }

  onClick(column, event) {
    switch (event.target.dataset.id) {
      case this.constructor.ctrlId.showForm:
        event.preventDefault();
        this.showForm(column);
        break;

      case this.constructor.ctrlId.hideForm:
        event.preventDefault();
        this.hideForm(column);
        break;

      case this.constructor.ctrlId.addCard:
        this.addCard(column, event);
        break;

      default:
    }
  }

  showForm(column) {
    const button = column.querySelector(this.constructor.showFormSelector);
    button.dataset.visible = 'no';
    const form = column.querySelector(this.constructor.formSelector);
    form.dataset.visible = 'yes';
  }

  addCard(column, event) {
    const textarea = column.querySelector(this.constructor.newCardTextSelector);
    textarea.value = textarea.value.trim();
    if (!textarea.value) return;

    event.preventDefault();
    this.hideForm(column);
  }

  hideForm(column) {
    const button = column.querySelector(this.constructor.showFormSelector);
    button.dataset.visible = 'yes';
    const form = column.querySelector(this.constructor.formSelector);
    form.dataset.visible = 'no';
  }
}
