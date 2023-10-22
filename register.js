const registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", function (event) {
  // Mendapatkan nilai input dari formulir
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  const repeatPassword = document.getElementById("pass-repeat").value;
  const fullname = document.getElementById("user").value;

  // Validasi email
  if (email.value === "") {
    alert("Email harus diisi.");
    event.preventDefault();
    return;
  }

  // Validasi password
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const digitRegex = /[0-9]/;
  const symbolRegex = /[@#$%^&+=!]/;
  if (password.length < 8 || !uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !digitRegex.test(password) || !symbolRegex.test(password)) {
    alert("Password tidak memenuhi kriteria. Pastikan memiliki huruf besar, huruf kecil, angka, dan simbol, dan panjang minimal 8 karakter.");
    event.preventDefault();
    return;
  }

  // Validasi nama
  if (fullname.trim() === "") {
    alert("Nama harus diisi.");
    event.preventDefault();
    return;
  }
  // Validasi kata sandi yang sama
  if (password !== repeatPassword) {
    alert("Password dan Ulangi Password harus sama.");
    event.preventDefault();
    return;
  }

  // Data yang akan dikirim ke server
  const data = {
    name: fullname,
    email: email,
    password: password,
  };

  submitForm(event);
});

function submitForm(event) {
  event.preventDefault();
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

var form = document.getElementById("register-form");

form.addEventListener("Register", submitForm);
