const registerForm = document.getElementById("login-form");
const message = document.querySelector(".message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // const firstname = document.getElementById("firstname").value;
  // const lastname = document.getElementById("lastname").value;
  // const username = document.getElementById("username").value;
  // const email = document.getElementById("email").value;
  // const password = document.getElementById("password").value;

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

      return (message.innerHTML = data.message);
    }
    return (message.innerHTML = data.message);

    window.location.href();
  } catch (error) {
    console.log(error);
  }
});
