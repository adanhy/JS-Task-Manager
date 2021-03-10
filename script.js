class Task {
  constructor(id, text, isComplete) {
    this.id = id;
    this.text = text;
    this.dateCreated = new Date().toLocaleDateString();
    this.isImportant = false;
    this.isComplete = isComplete;
  }
}

class ToDoList {
  constructor() {
    this.arr = [];
    this.itemCount = 0;
  }

  getNewID() {
    this.itemCount++;
    return this.itemCount;
  }

  updateTextById(txt, idd) {
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].id == idd) {
        this.arr[i].text = txt;
        return true;
      }
    }
    return false;
  }

  createTask(text, isComplete) {
    this.arr.push(new Task(this.getNewID(), text, isComplete));
    return true;
  }

  deleteTaskById(idd) {
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].id == idd) {
        this.arr.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  flipIsCompleteById(id) {
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].id === id) {
        this.arr[i].isComplete
          ? (this.arr[i].isComplete = false)
          : (this.arr[i].isComplete = true);
        return true;
      }
    }
    return false;
  }

  flipIsImportantById(id) {
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].id === id) {
        this.arr[i].isComplete
          ? (this.arr[i].isImportant = false)
          : (this.arr[i].isImportant = true);
        return true;
      }
    }
    return false;
  }
}

var TD = new ToDoList();

window.onload = function () {
  const array = JSON.parse(localStorage.getItem("array"));
  const count = JSON.parse(localStorage.getItem("counter"));
  console.log(array, count);
  if (array != undefined) {
    console.log(`loading`);

    TD.arr = array;
    TD.itemCount = count;

    console.log(TD.arr);
    console.log(TD.itemCount);
    refresh();
  }
};

window.addEventListener("unload", (event) => {
  localStorage.setItem("array", JSON.stringify(TD.arr));
  localStorage.setItem("counter", JSON.stringify(TD.itemCount));
});

document.querySelector(`#addtask`).addEventListener(`click`, () => {
  const tasktext = document.querySelector(`#tasktext`);

  if (tasktext.style.display === `none`) {
    tasktext.style.display = `flex`;
    document.querySelector(`#textarea`).focus();
  } else tasktext.style.display = `none`;
});

document.querySelector(`#add`).addEventListener(`click`, () => {
  let text = document.querySelector(`#textarea`).value;
  TD.createTask(text, false);
  document.querySelector(`#textarea`).value = "";
  refresh();
});

document.querySelector(`#cancel`).addEventListener(`click`, () => {
  document.querySelector(`#textarea`).value = "";
});

//

function refresh() {
  const list = document.querySelector(`#tasks`);
  list.innerHTML = "";
  TD.arr.forEach((v) => {
    const line = document.createElement(`div`);
    line.classList.add(`line`);
    line.setAttribute("dataid", v.id);

    line.innerHTML = `<div class="side"><i class="fas fa-star"></i><div class="task">${v.text}</div></div><div class="side"> <label class="date">
    ${v.dateCreated}
    </label><button class="delete">Delete</button><button class="edit">Edit</button></div>`;
    list.appendChild(line);
  });

  document.querySelectorAll(`.delete`).forEach((el) => {
    el.addEventListener("click", (event) => {
      const line = event.target.closest(`.line`);
      console.log(line.getAttribute(`dataid`));
      TD.deleteTaskById(line.getAttribute(`dataid`));
      refresh();
    });
  });

  document.querySelectorAll(`.edit`).forEach((el) => {
    el.addEventListener("click", (event) => {
      const line = event.target.closest(`.line`);
      const task = line.querySelector(`.task`);
      const txt = task.textContent;
      const txtarea = document.createElement(`textarea`);
      txtarea.textContent = txt;
      txtarea.classList.add(`smalltxt`);
      task.replaceWith(txtarea);

      editbtn = line.querySelector(`.edit`);
      const confirmbtn = document.createElement(`btn`);
      confirmbtn.classList.add(`add`);
      confirmbtn.textContent = `Confirm`;
      editbtn.replaceWith(confirmbtn);

      txtarea.focus();
      const val = txtarea.value;
      txtarea.value = ``;
      txtarea.value = val;

      confirmbtn.addEventListener(`click`, (e) => {
        const iddd = line.getAttribute(`dataid`);
        TD.updateTextById(txtarea.value, iddd);

        txtarea.remove();
        confirmbtn.remove();
        refresh();
      });
    });
  });
}
