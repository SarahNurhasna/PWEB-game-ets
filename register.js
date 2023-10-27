const registerButton = document.getElementById("register-button");
const email = document.getElementById("email").value;
const password = document.getElementById("pass").value;
const repeatPassword = document.getElementById("pass-repeat").value;
const fullname = document.getElementById("user").value;
const form = document.getElementById("register-form");

form.addEventListener("submit", (e) => {
  e.preDefault();
  validate();
  // submitForm(e);
});

const validate = () => {
  // Validasi nama
  if (fullname.trim() === "") {
    alert("Name must be filled in.");
    e.preDefault();
    return;
  }

  // Validasi email
  if (email.value === "") {
    alert("Emailmust be filled in.");
    e.preDefault();
    return;
  }

  // Validasi password
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const digitRegex = /[0-9]/;
  const symbolRegex = /[@#$%^&+=-_/|!]/;
  if (password.length < 8 || !uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !digitRegex.test(password) || !symbolRegex.test(password)) {
    alert("Password does not meet criteria. Make sure it has uppercase letters, lowercase letters, numbers, and symbols, and is at least 8 characters long.");
    e.preDefault();
    return;
  }

  // Validasi kata sandi yang sama
  if (password.value === "") {
    alert("Password must be filled in.");
    e.preDefault();
    return;
  } else if (password !== repeatPassword) {
    alert("Passwords doesn't match.");
    e.preDefault();
    return;
  }
};

function submitForm(e) {
  e.preDefault();
  var form = document.getElementById("register-form");

  var payload = {
    name: form.querySelector("#user").value,
    email: form.querySelector("#email").value,
    password: form.querySelector("#pass").value,
  };

  fetch("https://ets-pemrograman-web-f.cyclic.app/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error("Register failed");
      }
      return response.json();
    })
    .then((result) => {
      if (result.status === "success") {
        alert("Register success");
        console.log("result from server ", result);
        window.location.href = "./index.html";
      } else if (result.status === "failed" && result.error === "email telah terdaftar") {
        alert("Email ini sudah terdaftar. Silakan gunakan email lain.");
      } else {
        alert("Pendaftaran gagal: " + result.message);
      }
    })
    .catch((error) => {
      alert(error);
      console.error("error ", error);
    });
}

var myform = document.addEventListener("form");

myform.addeListener("submit", submitForm);
