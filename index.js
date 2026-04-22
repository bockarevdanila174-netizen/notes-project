// const MOCK_NOTES = [
//   {
//     id: crypto.randomUUID(),
//     title: "Работа с формами",
//     content: "контент",
//     color: "green",
//     isFavorite: false,
//   },
// ];
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
    const notes = this.getFavoriteNotes();
    view.renderNotes(notes);
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
//   toggleFilter(value) {
//   this.isShowOnlyFavorite = value;
//   this.render();
// }
hasFavoriteNotes() {
  return this.notes.some(n => n.isFavorite);
}
};

const view = {
  init() {
    this.list = document.querySelector(".notes-list");
    this.box = document.querySelector(".message-box");
    model.render();

    const count = document.querySelector("#count");
    const form = document.querySelector(".note-form");
    const list = document.querySelector(".notes-list");
    const isFavorite = document.querySelector("#checked");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = form.elements.title.value;
      const content = form.elements.content.value;
      const color = form.elements.color.value;

      controller.createNote(title, content, color);
      form.reset();
    });
    list.addEventListener("click", (e) => {
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
    const countEl = document.querySelector("#count");
    countEl.innerHTML = `Всего заметок: <span class="count-number">${count}</span>`;
    // countEl.textContent = `Всего заметок: ${count}`;
  },
  renderFilterBox() {
  const box = document.querySelector(".filter-box");
  box.style.display = model.notes.length ? "flex" : "none";
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
  // showMessage(message, error = false) {
  //   const box = this.box;
  //   box.innerHTML = "";

  //   const messageElement = document.createElement("span");

  //   box.classList.remove("message-error", "message-done");

  //   if (error) {
  //     messageElement.classList.add("message-error");
  //   } else {
  //     messageElement.classList.add("message-done");
  //   }

  //   messageElement.textContent = message;
  //   box.append(messageElement);

  //   setTimeout(() => {
  //     messageElement.remove();
  //   }, 1500);
  // },
  showMessage(message, error = false) {
  const box = this.box;
  box.innerHTML = "";

  const messageElement = document.createElement("div");

  messageElement.classList.add(
    error ? "message-error" : "message-done"
  );

  messageElement.innerHTML = `
    <img src="./images/icon/${error ? "warning.svg" : "done.svg"}" class="message-icon">
    <span>${message}</span>
  `;

  box.append(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, 1500);
}
};
const controller = {
  createNote(title, content, color) {
    if (title.length === 0) {
      view.showMessage("Введите заголовок", true);
      return;
    }

    if (title.length > 50) {
      view.showMessage("Максимальная длина заголовка - 50 символов", true);
      return;
    }

    model.createNote(title, content, color);
    view.showMessage("Заметка добавлена!");
  },
  deleteNote(id) {
    model.deleteNote(id);
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
