import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { auth, db, googleProvider } from "./firebase-config.js";

const SCHOOL_DOMAIN = "@fusdk12.net";
const PERSONAL_TESTER_EMAIL = "jiayuanfu23981@gmail.com";

function isVerifiedSchoolAccount(user) {
  return Boolean(
    user?.emailVerified &&
    user.email?.toLowerCase().endsWith(SCHOOL_DOMAIN)
  );
}

function isSchoolAccount(user) {
  const email = user?.email?.toLowerCase();
  return Boolean(
    user?.emailVerified &&
    (email?.endsWith(SCHOOL_DOMAIN) || email === PERSONAL_TESTER_EMAIL)
  );
}

async function isOfficerAdmin(user) {
  if (!isVerifiedSchoolAccount(user)) return false;
  const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
  return adminSnapshot.exists() && adminSnapshot.data().active !== false;
}

async function loginWithSchoolGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  if (!isSchoolAccount(credential.user)) {
    await signOut(auth);
    throw new Error("Please use a verified @fusdk12.net account or the approved tester account.");
  }
  return credential.user;
}

async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}

function requireSchoolUser({ onAllowed, onDenied } = {}) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      const returnTo = encodeURIComponent(window.location.pathname.split("/").pop() || "resources.html");
      window.location.replace(`login.html?returnTo=${returnTo}`);
      return;
    }

    if (!isSchoolAccount(user)) {
      await signOut(auth);
      onDenied?.("Only verified school accounts and the approved tester account can access this page.");
      window.location.replace("login.html?error=domain");
      return;
    }

    document.querySelectorAll("[data-account-email]").forEach((element) => {
      element.textContent = user.email;
    });
    document.querySelectorAll("[data-protected]").forEach((element) => {
      element.hidden = false;
    });
    onAllowed?.(user);
  });
}

document.querySelectorAll("[data-logout]").forEach((button) => {
  button.addEventListener("click", logout);
});

export {
  auth,
  db,
  isOfficerAdmin,
  isSchoolAccount,
  loginWithSchoolGoogle,
  logout,
  requireSchoolUser
};
