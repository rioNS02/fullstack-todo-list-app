const loginForm = document.getElementById("login-form");
const message = document.querySelector(".message");
const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {
  input.addEventListener("focus", (event) => {
    event.preventDefault();

    message.classList.remove("error-message");
    message.innerHTML = "";
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      message.classList.add("error-message");
      loginForm.reset();
      return (message.innerHTML = data.message);
    }

    localStorage.setItem("token", data.accessToken);
    message.classList.add("success-message");
    window.location = "index.html";
    loginForm.style.cursor = "wait";
    return (message.innerHTML = data.message);
  } catch (error) {
    console.log(error);
  }
});
