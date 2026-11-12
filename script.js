const defaultItems = [
  {
    title: 'Lost Student ID Card',
    category: 'Cards',
    status: 'lost',
    location: 'Library',
    date: 'Today',
    description: 'Black student ID with name and photo, last seen near the reading hall.'
  },
  {
    title: 'Found Backpack',
    category: 'Bags',
    status: 'found',
    location: 'Hostel Gate',
    date: 'Yesterday',
    description: 'Blue backpack with notebooks and a USB cable found near the hostel entrance.'
  },
  {
    title: 'Missing Water Bottle',
    category: 'Accessories',
    status: 'resolved',
    location: 'Cafeteria',
    date: '2 days ago',
    description: 'White steel bottle recovered and returned to the owner after verification.'
  },
  {
    title: 'Found Wallet',
    category: 'Wallets',
    status: 'found',
    location: 'Bus Stop',
    date: 'Today',
    description: 'Brown leather wallet with a few cash notes and student ID tucked inside.'
  }
];

const itemGrid = document.querySelector('.item-grid');
const emptyMessage = document.querySelector('.empty-message');
const searchInput = document.querySelector('#searchInput');
const categoryFilter = document.querySelector('#categoryFilter');
const reportForm = document.querySelector('.report-form');
const formMessage = document.querySelector('.form-message');

let items = [...defaultItems];

function getStatusLabel(status) {
  switch (status) {
    case 'lost':
      return 'Lost';
    case 'found':
      return 'Found';
    case 'resolved':
      return 'Resolved';
    default:
      return 'Unknown';
  }
}

function createItemCard(item) {
  const article = document.createElement('article');
  article.className = 'item-card';

  const itemTop = document.createElement('div');
  itemTop.className = 'item-top';

  const category = document.createElement('span');
  category.className = 'item-category';
  category.textContent = item.category;

  const status = document.createElement('span');
  status.className = `status status-${item.status}`;
  status.textContent = getStatusLabel(item.status);

  const title = document.createElement('h3');
  title.textContent = item.title;

  const description = document.createElement('p');
  description.className = 'item-description';
  description.textContent = item.description;

  const meta = document.createElement('div');
  meta.className = 'item-meta';
  meta.innerHTML = `
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Reported:</strong> ${item.date}</p>
  `;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const detailsBtn = document.createElement('button');
  detailsBtn.type = 'button';
  detailsBtn.className = 'small-button';
  detailsBtn.textContent = 'View details';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'small-button delete';
  deleteBtn.textContent = 'Remove';

  detailsBtn.addEventListener('click', () => {
    alert(`${item.title}\n\n${item.description}\n\nLocation: ${item.location}\nStatus: ${getStatusLabel(item.status)}`);
  });

  deleteBtn.addEventListener('click', () => {
    items = items.filter(entry => entry.title !== item.title || entry.location !== item.location);
    renderItems();
  });

  actions.appendChild(detailsBtn);
  actions.appendChild(deleteBtn);

  itemTop.appendChild(category);
  itemTop.appendChild(status);

  article.appendChild(itemTop);
  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(meta);
  article.appendChild(actions);

  return article;
}

function renderItems() {
  if (!itemGrid) return;

  const query = (searchInput?.value || '').trim().toLowerCase();
  const selectedCategory = categoryFilter?.value || 'all';

  const filteredItems = items.filter(item => {
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  itemGrid.innerHTML = '';

  if (filteredItems.length === 0) {
    if (emptyMessage) {
      emptyMessage.style.display = 'block';
    }
    return;
  }

  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }

  filteredItems.forEach(item => {
    itemGrid.appendChild(createItemCard(item));
  });
}

if (searchInput) {
  searchInput.addEventListener('input', renderItems);
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', renderItems);
}

if (reportForm) {
  reportForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(reportForm);
    const title = (formData.get('title') || '').toString().trim();
    const category = (formData.get('category') || '').toString().trim();
    const status = (formData.get('status') || 'lost').toString().trim();
    const location = (formData.get('location') || '').toString().trim();
    const description = (formData.get('description') || '').toString().trim();

    if (!title || !category || !location || !description) {
      if (formMessage) {
        formMessage.textContent = 'Please fill in all the required fields.';
      }
      return;
    }

    const newItem = {
      title,
      category,
      status,
      location,
      date: 'Just now',
      description
    };

    items.unshift(newItem);
    renderItems();
    reportForm.reset();

    if (formMessage) {
      formMessage.textContent = 'Report submitted successfully.';
    }
  });
}

renderItems();
