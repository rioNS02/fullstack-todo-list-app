const nameUser = document.querySelector(".name");
const tableBody = document.querySelector(".table-body");
const container = document.querySelector(".container");

// Using click container = event bubbling
container.addEventListener("click", (event) => {
  // create logout
  const logOut = event.target.closest(".logout");
  if (logOut) {
    event.preventDefault();

    localStorage.removeItem("token");
    window.location = "login.html";
    return;
  }
  //create click button status
  const buttonStatus = event.target.closest(".button-status");
  if (buttonStatus) {
    event.preventDefault();
    const statusOption = event.target.closest(".status-option");
    const statusBar = statusOption.querySelector(".status-bar");
    console.log(statusBar);

    statusBar.classList.toggle("show-status-bar");
    return;
  }

  // Create button status bar
  if (event.target.className === "status") {
    const statusBar = event.target.closest(".status-bar");
    statusBar.classList.remove("show-status-bar");
    const statusTask = event.target.value;
    const taskID = event.target.closest(".status-bar").dataset.taskid;
    console.log(statusTask, taskID);

    // Update task status
    const updateStatusTask = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.log("Token not found");

      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/tasks/${taskID}/status`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: statusTask }),
            credentials: "include",
          }
        );
        if (!response.ok) console.log(response.status);

        const data = await response.json();
        console.log(data);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };
    updateStatusTask();
  }
});

const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("token not found");
  }
  try {
    const response = await fetch("http://localhost:3000/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) console.log(response.status);

    // console.log(response);
    const { data, message } = await response.json();

    // Check response found

    data.map((user) => {
      // console.log(user);

      nameUser.innerHTML = user.first_name;
    });
  } catch (error) {
    console.log(error);
  }
};
getUser();

// Get task user login
const getTask = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Token not found");
    window.location = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/v1/tasks/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) return console.log(data.message);

    const tasks = data.data;
    console.log(tasks);

    tasks.map((task) => {
      console.log(task);

      // Change date due to date
      const date = new Date(task.date_due);
      const asiaDate = date.toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
      });

      tableBody.innerHTML += `
            <tr>
              <td class="title">${task.title}</td>
              <td class="description">${task.description}</td>
              <td>${asiaDate}</td>
              <td class="status">
                <span class="status-print">${task.status}</span>
                <div class="status-option">
                  <button class="button-status" type="button" value="${task.taskID}">
                    <img
                      src="./images/icons/up-down-arrow.webp"
                      alt="up down arrow"
                    />
                  </button>
                  <div class="status-bar" data-taskid="${task.taskID}">
                    <button class="status" value="pending">pending</button>
                    <button class="status" value="on_progress">
                      on progress
                    </button>
                    <button class="status" value="done">done</button>
                  </div>
                </div>
              </td>
            </tr>`;
    });
  } catch (error) {
    console.log(error);
  }
};
getTask();

/* Javascript Modal box add task */

// Create button add task
const addTaskButton = document.querySelector(".add-task-button");
const close = document.querySelector(".close");
const modalBoxTask = document.querySelector(".container-modal-box-task");

addTaskButton.addEventListener("click", (event) => {
  event.preventDefault();
  modalBoxTask.style.display = "flex";
});

// Create button close

close.addEventListener("click", (event) => {
  event.preventDefault();
  modalBoxTask.style.display = "none";
});

// Add add task function
const formAddTask = document.querySelector(".form-add-task");

formAddTask.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Get value form input
  const title = event.target.title.value;
  const description = event.target.description.value;
  const dateDue = event.target.date.value;
  // Get token
  const token = localStorage.getItem("token");
  if (!token) return console.log("Token not found");

  // post task
  try {
    const response = await fetch("http://localhost:3000/api/v1/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        date_due: dateDue,
      }),
      credentials: "include",
    });

    if (!response.ok) return console.log(response.status);

    const data = await response.json();
    console.log(data);

    window.location.reload();
  } catch (error) {
    console.log(error);
  }
});
