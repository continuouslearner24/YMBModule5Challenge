let tasks = [];
function getRandomId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
$("#dueDate").datepicker({});
$(".lane").droppable({
  accept: ".draggable",
  drop: dropTask,
});

function addTask() {
  console.log("this is clicking");
  // getting tasks from local storage
  let tasksFromStorage = localStorage.getItem("tasks");
  tasks = JSON.parse(tasksFromStorage) || [];
  console.log(tasks);
  // new task
  const newTask = {};
  if ($("#title").val() != "" && $("#dueDate").val() != "" && $("#desc").val() != "") {
    newTask.id = getRandomId();
    newTask.title = $("#title").val();
    newTask.dueDate = $("#dueDate").val();
    newTask.desc = $("#desc").val();
    newTask.status = "To-Do";
    // add new task to tasks
    tasks.push(newTask);
    // save tasks to local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // showTask
    showTask();
    // clear
    $("#title").val("");
    $("#dueDate").val("");
    $("#desc").val("");
  } else {
    alert("Please fill all of the fields!");
  }
}

function taskToCard(t) {
  const taskToCard = `<div class="card taskToCard draggable mb-2" data-task-id="${t.id}" id="${t.id}"><div class="card-body"><h5 class="card-title">${t.title}</h5><h6 class="card-subtitle mb-2 text-muted">${t.dueDate}</h6><p class="card-text">${t.desc}</p><a href="#" class="card-link">Update</a><a href="#" onclick="deleteTask(${t.id})" class="card-link">Delete</a></div></div>`;
  return taskToCard;
}

function deleteTask(id) {
  console.log(id.id);
  // getting tasks from local storage
  let tasksFromStorage = localStorage.getItem("tasks");
  tasks = JSON.parse(tasksFromStorage) || [];
  console.log(tasks);
  for (let task of tasks) {
    if (task.id === id.id) {
      task.status = "Archive";
      console.log(task);
    }
  }
  // save tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  showTask();
}

function showTask() {
  // getting tasks from local storage
  let tasksFromStorage = localStorage.getItem("tasks");
  tasks = JSON.parse(tasksFromStorage) || [];
  console.log(tasks);
  // clear
  $("#toDoCards").empty();
  $("#toDayCards").empty();
  $("#toDoneCards").empty();
  const now = dayjs();
  // get each task individually
  for (let task of tasks) {
    console.log(task);
    if (task.status === "To-Do") {
      $("#toDoCards").append(taskToCard(task));
    } else if (task.status === "To-Day") {
      $("#toDayCards").append(taskToCard(task));
    } else if (task.status === "To-Done") {
      $("#toDoneCards").append(taskToCard(task));
    }
    let tdd = dayjs(task.dueDate, "DD/MM/YYYY");
    console.log(now.isSame(tdd, "day"), now.isAfter(tdd, "day"), now.isBefore(tdd, "day"))
    if (now.isSame(tdd, "day")) {
      console.log($(this));
      $("#"+task.id).addClass("border border-warning").removeClass("border-danger border-white");
    } else if (now.isAfter(tdd)) {
      $("#"+task.id).addClass("border border-danger").removeClass("border-warning border-white");
    } else if (now.isBefore(tdd)) {
      $("#"+task.id).addClass("border border-white").removeClass("border-danger border-warning");
    }
  }

  // draggable
  $(".draggable").draggable({
    zIndex: 999,
    helper: function (e) {
      const original = $(e.target).hasClass("ui-draggable") ? $(e.target) : $(e.target).closest(".ui-draggable");
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

showTask();

function dropTask(event, ui) {
  // getting tasks from local storage
  let tasksFromStorage = localStorage.getItem("tasks");
  tasks = JSON.parse(tasksFromStorage) || [];
  console.log(tasks);

  const taskId = ui.draggable[0].dataset.taskId;
  console.log("task Id " + taskId);
  console.log(event.target);
  const newStatus = event.target.id;
  console.log("new status " + newStatus);

  for (let task of tasks) {
    if (task.id === taskId) {
      task.status = newStatus;
      console.log(task);
    }
  }

  // save tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  showTask();
}
