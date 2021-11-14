import '../sass/main.scss';

class Obra {
  /**
   *
   * @param {String} nome
   * @param {Number} ultimo
   * @param {Number} total
   */
  constructor(nome, ultimo, total) {
    this.nome = nome;
    this.ultimo = ultimo;
    this.total = total;
  }
}

class Database {
  /**
   *
   * @param {String} link
   * @param {Obra} obra
   */
  static async post(link, obra) {
    const req = await fetch(link, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obra),
    });
    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }
  }

  /**
   *
   * @param {String} link
   * @returns {Promise}
   */
  static async get(link) {
    const req = await fetch(link);
    if (!req.ok) {
      throw new Error(`${req.status}: ${req.statusText}`);
    }
    return req;
  }

  /**
   *
   * @param {String} link
   * @param {Obra} obra
   */
  static async put(link, obra) {
    await fetch(`${link}/${obra.nome}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obra),
    });
  }

  /**
   *
   * @param {String} link
   * @param {Obra} obra
   */

  static async delete(link, obra) {
    await fetch(`${link}/${obra.nome}`, {
      method: 'DELETE',
    });
  }
}

class UI {
  /**
   *
   * @param {Element} input
   * @param {string} message
   * @param {string} statuss
   * @param {string} icon
   */
  static setFieldStatus(input, message, status, icon) {
    const control = input.parentElement;
    const help = control.parentElement.lastElementChild;
    const iconElement = control.lastElementChild;

    input.classList = `input ${status}`;
    help.classList = `help ${status}`;
    help.textContent = message;

    if (icon === null) {
      control.classList.remove('has-icons-right');
      iconElement.classList.add('is-hidden');
    } else {
      control.classList.add('has-icons-right');
      iconElement.classList.remove('is-hidden');
      iconElement.firstElementChild.classList = `fas ${icon}`;
    }
  }

  /**
   *
   * @param {Element} input
   */
  static setFieldBlank(input) {
    this.setFieldStatus(input, null, null, null);
  }

  /**
   *
   * @param {Element} input
   * @param {String} message
   */
  static setFieldError(input, message) {
    this.setFieldStatus(input, message, 'is-danger', 'fa-exclamation-triangle');
  }

  /**
   *
   * @param {Element} input
   */
  static setFieldSuccess(input) {
    this.setFieldStatus(input, null, 'is-success', 'fa-check');
  }

  /**
   *
   * @param {Array} inputs
   */
  static clearFields(inputs) {
    inputs.forEach((input) => {
      input.value = '';
      this.setFieldBlank(input);
    });
  }

  /**
   *
   * @param {Element} container
   * @param {String} message
   * @param {String} status
   * @param {String} icon
   * @param {Number} ms
   */
  static notify(container, message, status, icon, ms) {
    const div = document.createElement('div');
    div.classList = `notification box ${status} mb-0`;

    const button = document.createElement('button');
    button.addEventListener('click', (e) => {
      e.target.parentElement.remove();
    });
    button.classList = 'delete';

    div.appendChild(button);

    const span0 = document.createElement('span');
    span0.classList = 'icon-text is-align-items-center';

    const span1 = document.createElement('span');
    span1.classList = 'icon';

    const i = document.createElement('i');
    i.classList = `fas ${icon}`;
    span1.appendChild(i);

    const span2 = document.createElement('span');
    span2.textContent = message;

    span0.appendChild(span1);
    span0.appendChild(span2);
    div.appendChild(span0);

    container.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, ms);
  }

  /**
   *
   * @param {String} status
   * @param {String} icon
   * @param {Function} call
   * @param {String} ariaLabel
   * @returns {Element}
   */
  static createButton(status, icon, call, ariaLabel) {
    const button = document.createElement('button');
    button.classList = `button ${status}`;
    button.setAttribute('aria-label', ariaLabel);
    const span = document.createElement('span');
    span.classList = 'icon';
    const i = document.createElement('i');
    i.classList = `fas ${icon}`;
    span.appendChild(i);
    button.append(span);
    button.addEventListener('click', () => {
      call(button);
    });
    return button;
  }

  /**
   *
   * @param {String} value
   * @param {String} type
   * @returns {Element}
   */
  static createRowInput(value, type) {
    const input = document.createElement('input');
    input.classList = 'input has-text-centered is-hidden';
    input.setAttribute('value', value);
    input.setAttribute('type', type);
    return input;
  }

  /**
   *
   * @param {String} value
   * @returns {Element}
   */
  static createCell(value) {
    const cell = document.createElement('td');
    const span = document.createElement('span');
    span.textContent = value;
    cell.appendChild(span);
    return cell;
  }

  /**
   *
   * @param {Element} container
   * @param {Obra} obra
   * @param {Function} del
   * @param {Function} edi
   */
  static createRow(container, obra, del, edi) {
    const tr = document.createElement('tr');

    const cellNome = this.createCell(obra.nome);

    const cellUltimo = this.createCell(obra.ultimo);
    cellUltimo.setAttribute('edit', '');
    const inputUltimo = this.createRowInput(obra.ultimo, 'number');
    cellUltimo.appendChild(inputUltimo);

    const cellTotal = this.createCell(obra.total);
    cellTotal.setAttribute('edit', '');
    const inputTotal = this.createRowInput(obra.total, 'number');
    cellTotal.appendChild(inputTotal);

    const opcoes = document.createElement('td');

    const div = document.createElement('div');
    div.classList = 'is-flex is-justify-content-center gap';
    div.appendChild(this.createButton('is-warning', 'fa-pen', edi, 'editar'));
    div.appendChild(this.createButton('is-danger', 'fa-trash', del, 'apagar'));
    opcoes.appendChild(div);

    [cellNome, cellUltimo, cellTotal, opcoes].forEach((td) => {
      tr.appendChild(td);
    });
    container.appendChild(tr);
  }

  /**
   *
   * @param {Element} button
   */
  static deleteRow(button) {
    button.parentElement.parentElement.parentElement.remove();
  }

  /**
   *
   * @param {Element} button
   */
  static editRow(button, link) {
    const tr = button.parentElement.parentElement.parentElement;
    const id = tr.firstElementChild.firstElementChild.textContent;
    const btnGroup = tr.lastElementChild.lastElementChild;
    const btnEdit = btnGroup.firstElementChild;
    const btnDelete = btnGroup.lastElementChild;

    const toggleEdit = () => {
      tr.classList.toggle('is-selected');
      btnEdit.classList.toggle('is-hidden');
      btnDelete.classList.toggle('is-hidden');
      tr.childNodes.forEach((td) => {
        if (td.hasAttribute('edit')) {
          td.firstElementChild.classList.toggle('is-hidden');
          td.lastElementChild.classList.toggle('is-hidden');
        }
      });
    };

    toggleEdit();

    const btnCancel = this.createButton(
      'is-danger',
      'fa-ban',
      () => {
        toggleEdit();
        btnSave.remove();
        btnCancel.remove();
      },
      'cancelar'
    );

    const btnSave = this.createButton(
      'is-info',
      'fa-check',
      () => {
        toggleEdit();

        const arr = [];
        tr.childNodes.forEach((td) => {
          if (td.hasAttribute('edit')) {
            const span = td.firstElementChild.textContent;
            const input = td.lastElementChild.value;
            if (span !== input) {
              td.firstElementChild.textContent = input;
            }
            arr.push(parseFloat(td.firstElementChild.textContent));
          }
        });
        Database.put(link, new Obra(id, ...arr));
        this.notify(
          notifications,
          'Obra editada com sucesso!',
          'is-info',
          'fa-pen',
          3000
        );
        btnSave.remove();
        btnCancel.remove();
      },
      'salvar'
    );
    btnGroup.appendChild(btnCancel);
    btnGroup.appendChild(btnSave);
  }

  /**
   *
   * @param {Element} container
   * @param {String} link
   */
  static async displayObras(container, link) {
    const req = await Database.get(link);
    const json = await req.json();
    json.forEach((obra) => {
      this.createRow(
        container,
        obra,
        (button) => {
          this.deleteRow(button);
          Database.delete(link, obra);
          this.notify(
            notifications,
            'Obra removida com sucesso!',
            'is-danger',
            'fa-times',
            3000
          );
        },
        (button) => {
          this.editRow(button, link);
        }
      );
    });
  }
}

class Validate {
  /**
   *
   * @param {Event} e
   * @returns {Boolean}
   */
  static fieldTypeText(e) {
    if (e.value === '') {
      UI.setFieldError(e, 'Preencha este campo');
      return false;
    }
    UI.setFieldSuccess(e);
    return true;
  }

  /**
   *
   * @param {Event} e
   * @returns {Boolean}
   */
  static fieldTypeNumber(e) {
    if (e.value === '') {
      UI.setFieldError(e, 'Insira um número');
      return false;
    }

    if (parseFloat(e.value) < 0) {
      UI.setFieldError(e, 'Insira um número maior ou igual a zero');
      return false;
    }

    if (e.value.includes('e')) {
      UI.setFieldError(e, 'Insira um número decimal');
      return false;
    }

    UI.setFieldSuccess(e);
    return true;
  }

  static editFieldTypeNumber(e) {
    if (e.value === '') {
      return false;
    }

    if (parseFloat(e.value) < 0) {
      return false;
    }

    if (e.value.includes('e')) {
      return false;
    }
    return true;
  }
}

const form = document.getElementById('form');
const nome = document.getElementById('nome');
const ultimo = document.getElementById('ultimo');
const total = document.getElementById('total');
const button = document.getElementById('submit');
const events = ['invalid', 'input'];
const notifications = document.getElementById('notifications');
const tableBody = document.getElementById('tableBody');
const mockDB = 'http://localhost:3000/obras';

UI.displayObras(tableBody, mockDB).catch((err) => {
  UI.notify(notifications, err, 'is-danger', 'fa-times', 3000);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  nome.focus();

  if (
    Validate.fieldTypeText(nome) &&
    Validate.fieldTypeNumber(ultimo) &&
    Validate.fieldTypeNumber(total)
  ) {
    const obra = new Obra(
      nome.value,
      parseFloat(ultimo.value),
      parseFloat(total.value)
    );

    const del = (button) => {
      UI.deleteRow(button);
      Database.delete(mockDB, obra);
      UI.notify(
        notifications,
        'Obra removida com sucesso!',
        'is-danger',
        'fa-times',
        3000
      );
    };

    const edi = (button) => {
      UI.editRow(button, mockDB);
    };

    Database.post(mockDB, obra)
      .then(() => {
        UI.createRow(tableBody, obra, del, edi);
        UI.notify(
          notifications,
          'Obra adicionada com sucesso!',
          'is-success',
          'fa-check',
          3000
        );
        UI.clearFields([nome, ultimo, total]);
      })
      .catch((err) => {
        UI.notify(notifications, err, 'is-danger', 'fa-times', 3000);
      });
  }
});

button.addEventListener('submit', (e) => {
  e.preventDefault();
});

events.forEach((on) => {
  nome.addEventListener(on, (e) => {
    Validate.fieldTypeText(e.target);
  });

  ultimo.addEventListener(on, (e) => {
    Validate.fieldTypeNumber(e.target);
  });

  total.addEventListener(on, (e) => {
    Validate.fieldTypeNumber(e.target);
  });
});
