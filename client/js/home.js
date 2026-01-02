const nameUser = document.querySelector(".name");
const tableBody = document.querySelector(".table-body");
const container = document.querySelector(".container");

// Using click container = event bubbling
container.addEventListener("click", (event) => {
  // create logout
  if (event.target.className === "logout") {
    event.preventDefault();
    Swal.fire({
      title: "Apakah kamu ingin keluar",
      showDenyButton: true,
      confirmButtonText: "Iya",
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Keluar", "", "success");
        localStorage.removeItem("token");
        window.location = "login.html";
        return;
      }
    });
  }

  /* UPDATE STATUS TASK */
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
  /* UPDATE STATUS TASK */

  /* DELETE TASK */
  const deleteTask = document.querySelectorAll(".delete");

  deleteTask.forEach((buttonDelete) => {
    buttonDelete.addEventListener("click", (event) => {
      event.preventDefault();
      Swal.fire({
        title: "Apakah kamu ingin menghapus task ini?",
        showDenyButton: true,
        confirmButtonText: "Iya",
        denyButtonText: `Tidak`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Dihapus", "", "success");

          // fetching data delete
          const taskID = event.target.closest(".delete").dataset.taskid;
          const token = localStorage.getItem("token");

          const deleteTaskApi = async () => {
            try {
              const response = await fetch(
                `http://localhost:3000/api/v1/tasks/${taskID}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  credentials: "include",
                }
              );

              if (!response.ok) return console.log(response.status);
              window.location.reload();
            } catch (error) {
              console.log(error);
            }
          };
          deleteTaskApi();
        }
      });
      event.stopPropagation();
    });
  });
  /* DELETE TASK */

  /* UPDATE TASK */
  const formUpdateTask = document.querySelector(".form-update-task");
  const modalBoxUpdateTask = document.querySelector(
    ".container-modal-box-update-task"
  );
  const closeUpdateTask = document.querySelector(".close-update-task");
  const updateTask = document.querySelectorAll(".edit");
  updateTask.forEach((buttonEdit) => {
    buttonEdit.addEventListener("click", async (event) => {
      event.preventDefault();
      modalBoxUpdateTask.style.display = "flex";
      // get task form input update task
      const taskID = event.target.closest(".edit").dataset.taskid;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/api/v1/tasks/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) return console.log(response.status);

        const { message, data } = await response.json();

        const tasks = data.find((task) => task.taskID == taskID);
        console.log(tasks);

        const date = tasks.date_due.split("T")[0];
        console.log(date);

        // rendering form update task

        formUpdateTask.innerHTML = `
          <input type="hidden" name="task_id" id="task_id" value="${tasks.taskID}">
        <div>
          <label for="title"> Title : </label>
          <input
            type="text"
            name="title"
            id="title"
            value="${tasks.title}"
            required
          />
        </div>
        <label for="description"> Description : </label>
        <textarea
          class="description"
          name="description"
          id="description"
          rows="5"
          cols="4"
        >
${tasks.description}</textarea
        >
        <div>
          <label for="date"> Date : </label>
          <input type="date" name="date" id="date" value="${date}" required />
        </div>
        <button type="submit" class="update-task">Update task</button>
        `;
      } catch (error) {
        console.log(error);
      }
      // event.stopPropagation();
    });

    // fetching api update task
    formUpdateTask.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = localStorage.getItem("token");
      const taskID = event.target.task_id.value;
      const title = event.target.title.value;
      const description = event.target.description.value;
      const dateDue = event.target.date.value;

      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/tasks/${taskID}`,
          {
            method: "PATCH",
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
          }
        );

        if (!response.ok) return console.log(response.status);

        const data = await response.json();

        Swal.fire("Update task successfull", " ", "success");

        console.log(data);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    });
  });

  // create button close update task
  closeUpdateTask.addEventListener("click", (event) => {
    event.preventDefault();
    modalBoxUpdateTask.style.display = "none";
  });
  /* UPDATE TASK */
});

/* Get user  */
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
/* Get user  */

/* Get task user  */
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
            <td>
              <div class="status-wrapper">
                <span class="status-print">${task.status}</span>
                <div class="status-option">
                  <button class="button-status" type="button" value="${task.taskID}">
                    <img src="./images/icons/up-down-arrow.webp" alt="up down arrow" />
                  </button>
                  <div class="status-bar" data-taskid="${task.taskID}">
                    <button class="status" value="pending">pending</button>
                    <button class="status" value="on_progress">
                      on progress
                    </button>
                    <button class="status" value="done">done</button>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="actions">
                <i class="delete" data-feather="trash-2" width="18px" data-taskid="${task.taskID}"></i>
                <i class="edit" data-feather="edit" width="18px" data-taskid="${task.taskID}"></i>
              </div>
            </td>
          </tr>`;

      feather.replace();
    });
  } catch (error) {
    console.log(error);
  }
};
getTask();
/* Get task user  */

/* Javascript Modal box add task */

// Create button add task
const addTaskButton = document.querySelector(".add-task-button");
const close = document.querySelector(".close-add-task");
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
