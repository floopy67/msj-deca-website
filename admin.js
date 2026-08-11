import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { db, isOfficerAdmin, requireSchoolUser } from "./auth.js";

const gate = document.querySelector("[data-admin-gate]");
const workspace = document.querySelector("[data-admin-workspace]");
const form = document.querySelector("[data-resource-form]");
const formTitle = document.querySelector("[data-form-title]");
const submitButton = document.querySelector("[data-submit-resource]");
const cancelButton = document.querySelector("[data-cancel-edit]");
const list = document.querySelector("[data-admin-resource-list]");
const message = document.querySelector("[data-admin-message]");
let editingId = null;
let resourceCache = [];

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = "Add a resource";
  submitButton.textContent = "Publish resource";
  cancelButton.hidden = true;
}

function validHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function renderAdminList() {
  list.replaceChildren();
  if (!resourceCache.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No resources have been published yet.";
    list.appendChild(empty);
    return;
  }

  resourceCache.forEach((resource) => {
    const row = document.createElement("article");
    row.className = "admin-resource";
    const title = document.createElement("h3");
    title.textContent = resource.title;
    const detail = document.createElement("p");
    detail.textContent = `${resource.category || "General"} · ${resource.description || "No description"}`;
    const actions = document.createElement("div");
    actions.className = "resource-card-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "button button-small";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editingId = resource.id;
      form.elements.title.value = resource.title || "";
      form.elements.category.value = resource.category || "";
      form.elements.description.value = resource.description || "";
      form.elements.driveUrl.value = resource.driveUrl || "";
      formTitle.textContent = "Edit resource";
      submitButton.textContent = "Save changes";
      cancelButton.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "button button-small danger-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      if (!window.confirm(`Delete “${resource.title}”? This cannot be undone.`)) return;
      try {
        await deleteDoc(doc(db, "resources", resource.id));
        setMessage("Resource deleted.");
        await loadAdminResources();
      } catch (error) {
        setMessage("The resource could not be deleted.", true);
        console.error(error);
      }
    });

    actions.append(editButton, deleteButton);
    row.append(title, detail, actions);
    list.appendChild(row);
  });
}

async function loadAdminResources() {
  const snapshot = await getDocs(query(collection(db, "resources"), orderBy("createdAt", "desc")));
  resourceCache = snapshot.docs.map((resourceDocument) => ({ id: resourceDocument.id, ...resourceDocument.data() }));
  renderAdminList();
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const resource = {
    title: formData.get("title").trim(),
    category: formData.get("category").trim(),
    description: formData.get("description").trim(),
    driveUrl: formData.get("driveUrl").trim(),
    updatedAt: serverTimestamp()
  };

  if (!validHttpsUrl(resource.driveUrl)) {
    setMessage("Please enter a complete HTTPS Google Drive link.", true);
    return;
  }

  submitButton.disabled = true;
  try {
    if (editingId) {
      await updateDoc(doc(db, "resources", editingId), resource);
      setMessage("Resource updated.");
    } else {
      await addDoc(collection(db, "resources"), { ...resource, createdAt: serverTimestamp() });
      setMessage("Resource published.");
    }
    resetForm();
    await loadAdminResources();
  } catch (error) {
    setMessage("The resource could not be saved. Confirm that this account is listed as an admin.", true);
    console.error(error);
  } finally {
    submitButton.disabled = false;
  }
});

cancelButton?.addEventListener("click", resetForm);

requireSchoolUser({
  onAllowed: async (user) => {
    try {
      if (!(await isOfficerAdmin(user))) {
        gate.textContent = "Your school account can view resources, but it is not on the officer admin list.";
        return;
      }
      gate.hidden = true;
      workspace.hidden = false;
      await loadAdminResources();
    } catch (error) {
      gate.textContent = "Admin permissions could not be checked. Confirm your Firebase setup.";
      console.error(error);
    }
  }
});
