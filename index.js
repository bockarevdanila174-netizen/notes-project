
const colors = {
  green: "#C2F37D",
  red: "#F37D7D",
  blue: "#7DE1F3",
  yellow: "#F3DB7D",
  purple: "#E77DF3",
};

const model = {
  notes: [],
  isShowOnlyFavorite: false,
  render() {
    view.renderNotes(this.getFavoriteNotes());
    view.renderCount(this.getCountNotes());
    view.renderFilterBox();
  },

  createNote(title, content, color) {
    const note = {
      id: crypto.randomUUID(),
      title: title,
      content: content,
      color: colors[color],
      isFavorite: false,
    };

    this.notes.unshift(note);
    this.render();
  },
  deleteNote(id) {
    this.notes = this.notes.filter((n) => n.id !== id);
    this.render();
  },

  toggleFavorite(id) {
    const note = this.notes.find((n) => n.id === id);
    if (note) {
      note.isFavorite = !note.isFavorite;
      this.render();
    }
  },

  toggleShowOnlyFavorite(value) {
    this.isShowOnlyFavorite = value;
    this.render();
  },
  getFavoriteNotes() {
    return this.isShowOnlyFavorite
      ? this.notes.filter((n) => n.isFavorite)
      : this.notes;
  },
  getCountNotes() {
    return this.getFavoriteNotes().length;
  },
  hasFavoriteNotes() {
    return this.notes.some((n) => n.isFavorite);
  },
};

const view = {
  init() {
    this.list = document.querySelector(".notes-list");
    this.box = document.querySelector(".message-box");
    this.countEl = document.querySelector("#count");
    model.render();

    const form = document.querySelector(".note-form");
    const isFavorite = document.querySelector("#checked");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = form.elements.title.value;
      const content = form.elements.content.value;
      const color = form.elements.color.value;
      const isCreated = controller.createNote(title, content, color);

      if (isCreated) {
        form.reset();
      }
    });
    this.list.addEventListener("click", (e) => {
      if (e.target.closest(".btn-delete")) {
        const id = e.target.closest(".btn-delete").id;
        controller.deleteNote(id);
      }

      if (e.target.closest(".btn-favorite")) {
        const id = e.target.closest(".btn-favorite").id;
        controller.toggleFavorite(id);
      }
    });

    isFavorite.addEventListener("change", (e) => {
      controller.toggleFilter(e.target.checked);
    });
  },
  renderCount(count) {
    this.countEl.innerHTML = `Всего заметок: <span class="count-number">${count}</span>`;
  },
  renderFilterBox() {
  const box = document.querySelector(".filter-box");
  const checkbox = document.querySelector("#checked");
  box.style.display = model.notes.length ? "flex" : "none";
  checkbox.checked = model.isShowOnlyFavorite;
},


  renderNotes(notes) {
    const list = this.list;

    list.innerHTML = "";
    if (notes.length === 0) {
      list.innerHTML = `
      <li class="empty-state">
       У вас нет еще ни одной заметки <br>
       Заполните поля выше и создайте свою первую заметку!
      </li>
    `;
      return;
    }

    notes.forEach((note) => {
      list.innerHTML += `
    <li class="note-item">
    <div class="note-header" style="background-color: ${note.color}">
    <h3 class="note-title">${note.title}</h3>
    <div class="note-actions">
    <button class="btn-favorite" id="${note.id}">
    <img src="./images/icon/${note.isFavorite ? "no-favorite.svg" : "favorite.svg"}"/>
    </button>
    <button class="btn-delete" id="${note.id}">
    <img src="./images/icon/delete.svg"/>
    </button>

    </div>
    </div>
    <p class="note-content">${note.content}</p>
    </li>
    `;
    });
  },
  showMessage(message, error = false) {
    const box = this.box;
    box.innerHTML = "";

    const messageElement = document.createElement("div");

    messageElement.classList.add(error ? "message-error" : "message-done");

    messageElement.innerHTML = `
    <img src="./images/icon/${error ? "warning.svg" : "done.svg"}" class="message-icon">
    <span>${message}</span>
  `;

    box.append(messageElement);

    setTimeout(() => {
      messageElement.remove();
    }, 1500);
  },
};
const controller = {
  createNote(title, content, color) {
    if (title.length === 0) {
      view.showMessage("Введите заголовок", true);
      return false;
    }

    if (title.length > 50) {
      view.showMessage("Максимальная длина заголовка - 50 символов", true);
      return false;
    }
    if (!color) {
      view.showMessage("Выберите цвет заметки", true);
      return false;
    }

    model.createNote(title, content, color);
    view.showMessage("Заметка добавлена!");

    return true;
  },
  deleteNote(id) {
    model.deleteNote(id);
    view.showMessage("Заметка удалена");
  },
  toggleFavorite(id) {
    model.toggleFavorite(id);
  },

  toggleFilter(value) {
    model.toggleShowOnlyFavorite(value);
  },
};

function init() {
  view.init();
}

init();
