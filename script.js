// CampusFind - Lost & Found Management System

const STORAGE_KEY = "campusFindReports";

// Demo records shown when the website is opened for the first time.
const demoReports = [
  {
    id: 1,
    name: "Black Backpack",
    category: "Accessories",
    type: "Lost",
    location: "College Library",
    description: "Black backpack with a blue keychain.",
    student: "Demo Student",
    contact: "student@example.com",
    date: new Date().toLocaleDateString(),
    resolved: false
  },
  {
    id: 2,
    name: "Scientific Calculator",
    category: "Electronics",
    type: "Found",
    location: "Computer Lab",
    description: "A calculator found on the second desk.",
    student: "Demo Student",
    contact: "student@example.com",
    date: new Date().toLocaleDateString(),
    resolved: false
  },
  {
    id: 3,
    name: "Blue Notebook",
    category: "Books & Notes",
    type: "Lost",
    location: "Room 204",
    description: "Blue notebook with handwritten class notes.",
    student: "Demo Student",
    contact: "student@example.com",
    date: new Date().toLocaleDateString(),
    resolved: false
  }
];

let reports;

try {
  const savedReports = localStorage.getItem(STORAGE_KEY);
  reports = savedReports ? JSON.parse(savedReports) : demoReports;

  if (!Array.isArray(reports)) {
    reports = demoReports;
  }
} catch (error) {
  reports = demoReports;
}

// Save reports in browser storage.
function saveReports() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

// Prevent user-entered text from being treated as HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

// Update dashboard numbers.
function updateStatistics() {
  document.getElementById("totalCount").textContent =
    reports.length;

  document.getElementById("lostCount").textContent =
    reports.filter(item => item.type === "Lost" && !item.resolved).length;

  document.getElementById("foundCount").textContent =
    reports.filter(item => item.type === "Found" && !item.resolved).length;

  document.getElementById("resolvedCount").textContent =
    reports.filter(item => item.resolved).length;
}

// Display reports on the page.
function displayReports() {
  const grid = document.getElementById("itemGrid");
  const searchValue =
    document.getElementById("searchInput").value.toLowerCase().trim();
  const filterValue =
    document.getElementById("filterSelect").value;

  const filteredReports = reports.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchValue) ||
      item.location.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue);

    let matchesFilter = true;

    if (filterValue === "Lost") {
      matchesFilter = item.type === "Lost" && !item.resolved;
    } else if (filterValue === "Found") {
      matchesFilter = item.type === "Found" && !item.resolved;
    } else if (filterValue === "Resolved") {
      matchesFilter = item.resolved;
    }

    return matchesSearch && matchesFilter;
  });

  grid.innerHTML = filteredReports.map(item => {
    const status = item.resolved ? "Resolved" : item.type;
    const statusClass = item.resolved
      ? "status-resolved"
      : item.type === "Lost" ? "status-lost" : "status-found";

    return `
      <article class="item-card">
        <div class="item-top">
          <span class="item-category">
            ${escapeHTML(item.category)}
          </span>
          <span class="status ${statusClass}">
            ${status}
          </span>
        </div>

        <h3>${escapeHTML(item.name)}</h3>

        <p class="item-description">
          ${escapeHTML(item.description)}
        </p>

        <div class="item-meta">
          <p>📍 ${escapeHTML(item.location)}</p>
          <p>👤 ${escapeHTML(item.student)}</p>
          <p>📅 ${escapeHTML(item.date)}</p>
          <p>✉ ${escapeHTML(item.contact)}</p>
        </div>

        <div class="card-actions">
          ${
            item.resolved
              ? ""
              : `<button class="small-button"
                   data-action="resolve" data-id="${item.id}">
                   Mark Resolved
                 </button>`
          }
          <button class="small-button delete"
            data-action="delete" data-id="${item.id}">
            Delete
          </button>
        </div>
      </article>
    `;
  }).join("");

  document.getElementById("emptyMessage").style.display =
    filteredReports.length === 0 ? "block" : "none";

  updateStatistics();
}

// Handle new report submission.
document.getElementById("reportForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const newReport = {
    id: Date.now(),
    name: document.getElementById("itemName").value.trim(),
    category: document.getElementById("itemCategory").value,
    type: document.getElementById("itemType").value,
    location: document.getElementById("itemLocation").value.trim(),
    description: document.getElementById("itemDescription").value.trim(),
    student: document.getElementById("studentName").value.trim(),
    contact: document.getElementById("studentContact").value.trim(),
    date: new Date().toLocaleDateString(),
    resolved: false
  };

  reports.unshift(newReport);
  saveReports();
  displayReports();

  this.reset();

  document.getElementById("formMessage").textContent =
    "Your report has been submitted successfully!";

  document.getElementById("items").scrollIntoView({
    behavior: "smooth"
  });
});

// Search reports.
document.getElementById("searchInput").addEventListener(
  "input", displayReports
);

// Filter reports.
document.getElementById("filterSelect").addEventListener(
  "change", displayReports
);

// Handle Resolve and Delete buttons.
document.getElementById("itemGrid").addEventListener("click", function(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "resolve") {
    const item = reports.find(report => report.id === id);

    if (item) {
      item.resolved = true;
      saveReports();
      displayReports();
    }
  }

  if (action === "delete") {
    const confirmed = confirm(
      "Are you sure you want to delete this report?"
    );

    if (confirmed) {
      reports = reports.filter(report => report.id !== id);
      saveReports();
      displayReports();
    }
  }
});

// Save initial demo records and show the website.
saveReports();
displayReports();
