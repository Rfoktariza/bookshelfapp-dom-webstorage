document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBuku();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function checkStatusBook() {
  const isCheckComplete = document.getElementById("finish");
  if (isCheckComplete.checked) {
     return true;
  }
  return false;
}

function addBuku() {
  const judulBuku = document.getElementById("judul").value;
  const penulisBuku = document.getElementById("penulis").value;
  const tahun = parseInt (document.getElementById("tahun").value);
  const isComplete = checkStatusBook();

  const generatedID = generateId();
  const bukuObject = generateTodoObject(generatedID, judulBuku, penulisBuku, tahun, isComplete);
  todos.push(bukuObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}



function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedList = document.getElementById("todos");

  const completedList = document.getElementById("completed-todos");
  uncompletedList.innerHTML = "";
  completedList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeBuku(todoItem);
    if (!todoItem.isComplete) {
      uncompletedList.append(todoElement);
    } else completedList.append(todoElement);
  }
});

function makeBuku(bukuObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bukuObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bukuObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = bukuObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("list-container");
  container.append(textContainer);
  container.setAttribute("id", `todo-${bukuObject.id}`);

  if (bukuObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(bukuObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(bukuObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bukuObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");

    removeButton.addEventListener("click", function () {
      removeTaskFromCompleted(bukuObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");

    editButton.addEventListener("click", function () {
      editTask(bukuObject.id);
    });

    container.append(checkButton, removeButton);
  }
  return container;
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
  const confirmation = confirm("Kamu yakin hapus data buku ini?");
  if (confirmation == true) {
    document.dispatchEvent(new Event(RENDER_EVENT));

    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

// function dialogRemove() {}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function localDataDromStorage() {
  const serializedData = localStorage.getItem(STROGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "save-todo";
const STORAGE_KEY = "BOOKSHELF_APP";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser belum di dukung local storage ya");
    return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById("searchBook").addEventListener("submit", function (event) {
  event.preventDefault();

  const searchBook = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookList = document.querySelectorAll(".inner");

  for (const books of bookList) {
    if (books.innerText.toLowerCase().includes(searchBook)) {
      books.parentElement.style.display = "flex";
    } else {
      books.parentElement.style.display = "none";
    }
  }
});
