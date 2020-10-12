export default class TrelloWidget {
  constructor(container) {
    this.container = container;
    this.data = [];
    this.dragEl = null;
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
        <div data-id="${this.ctrlId.cards}">
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
      deleteCard: 'delete-button',
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
    return `[data-id=${this.ctrlId.deleteCard}]`;
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
    this.cards = [];
    this.showFormButtons = [];
    this.forms = [];
    this.textareas = [];
    this.addCardButtons = [];
    this.hideFormButtons = [];

    this.cols.forEach((column, index) => {
      this.cards.push(column.querySelector(this.constructor.cardsSelector));
      this.showFormButtons.push(column.querySelector(this.constructor.showFormSelector));
      this.forms.push(column.querySelector(this.constructor.formSelector));
      this.textareas.push(column.querySelector(this.constructor.newCardTextSelector));
      this.addCardButtons.push(column.querySelector(this.constructor.addCardSelector));
      this.hideFormButtons.push(column.querySelector(this.constructor.hideFormSelector));

      const col = column;
      col.dataset.index = index;
      col.addEventListener('click', (event) => this.onClick(column.dataset.index, event));
    });

    this.widget.addEventListener('pointerdown', (event) => this.onDragStart(event));
    this.widget.addEventListener('pointermove', (event) => this.onDrag(event));
    this.widget.addEventListener('pointerup', (event) => this.onDragEnd(event));

    this.redraw();
  }

  onClick(colIndex, event) {
    switch (event.target.dataset.id) {
      case this.constructor.ctrlId.showForm:
        event.preventDefault();
        this.showForm(colIndex);
        break;

      case this.constructor.ctrlId.hideForm:
        event.preventDefault();
        this.hideForm(colIndex);
        break;

      case this.constructor.ctrlId.addCard:
        this.addCard(colIndex, event);
        break;

      case this.constructor.ctrlId.deleteCard:
        event.preventDefault();
        this.deleteCard(colIndex, event.target.dataset.index);
        break;

      default:
    }
  }

  onDragStart(event) {
    if (event.target.dataset.id !== this.constructor.ctrlId.card) {
      return;
    }
    event.preventDefault();

    this.dragEl = event.target.cloneNode(true);
    this.dragEl.dataset.id = 'card-drag';
    this.widget.appendChild(this.dragEl);

    const {
      x, y, width,
    } = event.target.getBoundingClientRect();
    this.dragEl.style.left = `${x}px`;
    this.dragEl.style.top = `${y}px`;
    this.dragEl.style.width = `${width}px`;

    this.deltaXDrag = x - event.pageX;
    this.deltaYDrag = y - event.pageY;
  }

  onDrag(event) {
    if (!this.dragEl) {
      return;
    }
    event.preventDefault();
    this.dragEl.style.left = `${event.pageX + this.deltaXDrag}px`;
    this.dragEl.style.top = `${event.pageY + this.deltaYDrag}px`;
  }

  onDragEnd(event) {
    if (!this.dragEl) {
      return;
    }
    event.preventDefault();
    this.dragEl.remove();
    this.dragEl = null;
  }

  showForm(colIndex) {
    this.showFormButtons[colIndex]
      .dataset.visible = 'no';
    this.forms[colIndex]
      .dataset.visible = 'yes';
  }

  hideForm(colIndex) {
    this.textareas[colIndex].value = '';
    this.showFormButtons[colIndex]
      .dataset.visible = 'yes';
    this.forms[colIndex]
      .dataset.visible = 'no';
  }

  addCard(colIndex, event) {
    const textarea = this.textareas[colIndex];
    textarea.value = textarea.value.trim();
    if (!textarea.value) return;

    event.preventDefault();

    this.data[colIndex].push(textarea.value);

    this.hideForm(colIndex);
    this.saveData();
    this.redraw();
  }

  deleteCard(colIndex, rowIndex) {
    this.data[colIndex].splice(rowIndex, 1);

    this.saveData();
    this.redraw();
  }

  loadData() {
    try {
      this.data = JSON.parse(localStorage.getItem('data'));
    } catch (e) {
      this.data = [[], [], []];
      throw new Error('Invalid data');
    }

    if (!this.data) {
      this.data = [[], [], []];
    }
  }

  saveData() {
    localStorage.setItem('data', JSON.stringify(this.data));
  }

  redraw() {
    this.loadData();

    this.data.forEach((columnData, index) => {
      let html = '';
      columnData.forEach((cardData, cardIndex) => {
        html += `
          <div data-id="${this.constructor.ctrlId.card}">
            <p>
              ${cardData}
            </p>
            <a href="#" data-id="${this.constructor.ctrlId.deleteCard}" data-index="${cardIndex}">&#x274C;</a>
          </div>      
        `;
      });
      this.cards[index].innerHTML = html;
    });
  }
}
