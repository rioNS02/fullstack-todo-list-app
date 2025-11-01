const registerForm = document.getElementById("login-form");
const message = document.querySelector(".message");
const inputs = document.querySelectorAll(".input");

inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    message.innerHTML = "";
    message.classList.remove("error-message");
  });
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstnameValue = event.target.firstname.value;
  const lastnameValue = event.target.lastname.value;
  const usernameValue = event.target.username.value;
  const emailValue = event.target.email.value;
  const passwordValue = event.target.password.value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstnameValue,
        lastname: lastnameValue,
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
      }),
    });

    if (!response.ok) {
      const data = await response.json();

      message.classList.add("error-message");
      registerForm.reset();
      return (message.innerHTML = data.message);
    }
    message.classList.add("success-message");
    registerForm.reset();
    return (message.innerHTML = data.message);
  } catch (error) {
    console.log(error);
  }
});
