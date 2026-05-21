let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
  const storedTasks = localStorage.getItem('todoTasks');
  if (storedTasks) {
    return JSON.parse(storedTasks);
  } else {
    saveTasks(items);
    return items;
  }
}

function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;
//
  deleteButton.addEventListener('click', function() {
    clone.remove();
    const index = items.indexOf(item);
    if (index > -1) {
      items.splice(index, 1);
      saveTasks(items);
    }
  });
//
  duplicateButton.addEventListener('click', function() {
    items.unshift(item);
    const newItem = createItem(item);
    listElement.prepend(newItem);
    saveTasks(items);
  });
//
  editButton.addEventListener('click', function() {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();

    function handleBlur() {
      textElement.setAttribute('contenteditable', 'false');
      const newText = textElement.textContent.trim();
      if (newText) {
        const index = items.indexOf(item);
        if (index > -1) {
          items[index] = newText;
          saveTasks(items);
          item = newText;
        }
      }
      textElement.removeEventListener('blur', handleBlur);
    }

    textElement.addEventListener('blur', handleBlur);
  });

  return clone;
}
//
function getTasksFromDOM() {
  const taskElements = listElement.querySelectorAll('.to-do__item-text');
  const tasks = [];
  taskElements.forEach(element => {
    tasks.push(element.textContent);
  });
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

items = loadTasks();

items.forEach(item => {
  const listItem = createItem(item);
  listElement.append(listItem);
});

formElement.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const newTask = inputElement.value.trim();
  
  if (newTask) {
    items.unshift(newTask);
    const listItem = createItem(newTask);
    listElement.prepend(listItem);
    saveTasks(items);
    inputElement.value = '';
  }
});