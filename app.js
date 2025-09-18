// Import Firebase config
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

initializeApp(firebaseConfig);

// LOGIN
document.getElementById("loginBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("formPage").style.display = "block";
  } else {
    alert("Username / Password salah!");
  }
});
