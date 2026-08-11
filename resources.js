import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { db, isOfficerAdmin, requireSchoolUser } from "./auth.js";

const resourceGrid = document.querySelector("[data-resource-grid]");
const emptyState = document.querySelector("[data-empty-state]");
const searchInput = document.querySelector("[data-resource-search]");
const categorySelect = document.querySelector("[data-resource-category]");
const adminLink = document.querySelector("[data-admin-link]");
let resources = [];

function safeDriveUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function renderResources() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const filtered = resources.filter((resource) => {
    const searchable = `${resource.title || ""} ${resource.description || ""} ${resource.category || ""}`.toLowerCase();
    return (!search || searchable.includes(search)) && (!category || resource.category === category);
  });

  resourceGrid.replaceChildren();
  emptyState.hidden = filtered.length > 0;

  filtered.forEach((resource) => {
    const card = document.createElement("article");
    card.className = "resource-card";

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "resource-category";
    categoryLabel.textContent = resource.category || "General";

    const title = document.createElement("h3");
    title.textContent = resource.title || "Untitled resource";

    const description = document.createElement("p");
    description.textContent = resource.description || "No description provided.";

    const actions = document.createElement("div");
    actions.className = "resource-card-actions";
    const driveUrl = safeDriveUrl(resource.driveUrl);
    if (driveUrl) {
      const link = document.createElement("a");
      link.className = "button button-primary button-small";
      link.href = driveUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open in Google Drive ↗";
      actions.appendChild(link);
    }

    card.append(categoryLabel, title, description, actions);
    resourceGrid.appendChild(card);
  });
}

async function loadResources(user) {
  try {
    adminLink.hidden = !(await isOfficerAdmin(user));
    const snapshot = await getDocs(query(collection(db, "resources"), orderBy("createdAt", "desc")));
    resources = snapshot.docs.map((resourceDocument) => ({ id: resourceDocument.id, ...resourceDocument.data() }));

    const categories = [...new Set(resources.map((resource) => resource.category).filter(Boolean))].sort();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
    renderResources();
  } catch (error) {
    emptyState.hidden = false;
    emptyState.textContent = "Resources could not be loaded. Check your Firebase configuration and Firestore rules.";
    console.error(error);
  }
}

searchInput?.addEventListener("input", renderResources);
categorySelect?.addEventListener("change", renderResources);
requireSchoolUser({ onAllowed: loadResources });
