import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { auth, isSchoolAccount, loginWithSchoolGoogle } from "./auth.js";

const loginButton = document.querySelector("[data-login]");
const status = document.querySelector("[data-auth-status]");
const params = new URLSearchParams(window.location.search);
const requestedPage = params.get("returnTo");
const safePages = new Set(["resources.html", "quiz.html", "admin.html"]);
const destination = safePages.has(requestedPage) ? requestedPage : "resources.html";

if (params.get("error") === "domain") {
  status.textContent = "That Google account is not approved for member access.";
  status.classList.add("error");
}

onAuthStateChanged(auth, (user) => {
  if (isSchoolAccount(user)) window.location.replace(destination);
});

loginButton?.addEventListener("click", async () => {
  loginButton.disabled = true;
  status.textContent = "Opening Google sign-in…";
  status.classList.remove("error");

  try {
    await loginWithSchoolGoogle();
    window.location.replace(destination);
  } catch (error) {
    status.textContent = error.message || "Sign-in did not work. Please try again.";
    status.classList.add("error");
    loginButton.disabled = false;
  }
});
