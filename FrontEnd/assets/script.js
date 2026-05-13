const API_URL = "http://localhost:5678/api";
let allWorks = [];
let categories = [];

async function init() {
  await fetchWorks();
  await fetchCategories();
  renderWorks(allWorks);
  renderFilters();
  checkAdminMode();
  setupModal();
}

async function fetchWorks() {
  try {
    const response = await fetch(`${API_URL}/works`);
    if (response.ok) {
      allWorks = await response.json();
    } else {
      console.error("Erreur lors de la récupération des travaux");
    }
  } catch (error) {
    console.error("Erreur de réseau:", error);
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (response.ok) {
      categories = await response.json();
    } else {
      console.error("Erreur lors de la récupération des catégories");
    }
  } catch (error) {
    console.error("Erreur de réseau:", error);
  }
}

function renderWorks(works) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

function renderFilters() {
  const filtersContainer = document.querySelector(".filters");
  if (!filtersContainer) return;

  filtersContainer.innerHTML = "";

  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.classList.add("filter-btn", "active");
  btnTous.addEventListener("click", () => {
    setActiveFilter(btnTous);
    applyFilters();
  });
  filtersContainer.appendChild(btnTous);

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.classList.add("filter-btn");
    btn.addEventListener("click", () => {
      setActiveFilter(btn);
      applyFilters();
    });
    filtersContainer.appendChild(btn);
  });

  setupSearch();
}

function setActiveFilter(activeBtn) {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

// New function to handle both text search and category filtering
function applyFilters() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  const activeBtn = document.querySelector(".filter-btn.active");
  
  let filteredWorks = allWorks;

  // 1. Filter by category
  if (activeBtn && activeBtn.textContent !== "Tous") {
    const category = categories.find(c => c.name === activeBtn.textContent);
    if (category) {
      filteredWorks = filteredWorks.filter(work => work.categoryId === category.id);
    }
  }

  // 2. Filter by search term
  if (searchTerm) {
    filteredWorks = filteredWorks.filter(work => work.title.toLowerCase().includes(searchTerm));
  }

  renderWorks(filteredWorks);
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    applyFilters();
  });
}

function checkAdminMode() {
  const token = window.sessionStorage.getItem("token");
  if (token) {
    const adminBar = document.getElementById("admin-bar");
    const editBtn = document.getElementById("edit-projects-btn");
    const filtersContainer = document.querySelector(".filters");
    const loginNav = document.getElementById("nav-login");

    if (adminBar) adminBar.style.display = "flex";
    if (editBtn) editBtn.style.display = "flex";
    if (filtersContainer) filtersContainer.style.display = "none";

    if (loginNav) {
      loginNav.innerHTML = '<a href="#">logout</a>';
      loginNav.addEventListener("click", (e) => {
        e.preventDefault();
        window.sessionStorage.removeItem("token");
        window.location.reload();
      });
    }
  }
}

function setupModal() {
  const modal = document.getElementById("modal");
  const editBtn = document.getElementById("edit-projects-btn");
  const closeBtns = document.querySelectorAll(".close-modal");
  const addPhotoBtn = document.querySelector(".add-photo-btn");
  const backBtn = document.querySelector(".back-modal");
  const viewGallery = document.getElementById("modal-view-gallery");
  const viewAdd = document.getElementById("modal-view-add");

  if (!modal || !editBtn) return;

  editBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    renderModalWorks();
    viewGallery.style.display = "block";
    viewAdd.style.display = "none";
  });

  closeBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      modal.style.display = "none";
    }),
  );

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  addPhotoBtn.addEventListener("click", () => {
    viewGallery.style.display = "none";
    viewAdd.style.display = "block";
    populateCategoriesSelect();
  });

  backBtn.addEventListener("click", () => {
    viewAdd.style.display = "none";
    viewGallery.style.display = "block";
  });

  setupAddProjectForm();
}

function renderModalWorks() {
  const modalGallery = document.querySelector(".modal-gallery");
  if (!modalGallery) return;
  modalGallery.innerHTML = "";

  allWorks.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await deleteWork(work.id);
    });

    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    modalGallery.appendChild(figure);
  });
}

async function deleteWork(id) {
  const token = window.sessionStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      allWorks = allWorks.filter((work) => work.id !== id);
      renderWorks(allWorks);
      renderModalWorks();
    } else {
      console.error("Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Erreur réseau:", error);
  }
}

function populateCategoriesSelect() {
  const select = document.getElementById("category");
  if (!select) return;
  select.innerHTML = '<option value=""></option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

function setupAddProjectForm() {
  const form = document.getElementById("add-project-form");
  const imageUpload = document.getElementById("image-upload");
  const imagePreview = document.getElementById("image-preview");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const submitBtn = document.getElementById("submit-project");

  if (!form) return;

  imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        checkFormValidity();
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.style.display = "none";
      checkFormValidity();
    }
  });

  function checkFormValidity() {
    if (
      titleInput.value.trim() !== "" &&
      categorySelect.value !== "" &&
      imageUpload.files.length > 0
    ) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  titleInput.addEventListener("input", checkFormValidity);
  categorySelect.addEventListener("change", checkFormValidity);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = window.sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", imageUpload.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch(`${API_URL}/works`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newWork = await response.json();
        allWorks.push(newWork);
        renderWorks(allWorks);

        form.reset();
        imagePreview.style.display = "none";
        imagePreview.src = "";
        submitBtn.disabled = true;

        document.getElementById("modal-view-add").style.display = "none";
        document.getElementById("modal-view-gallery").style.display = "block";
        renderModalWorks();
      } else {
        console.error("Erreur lors de l'ajout du projet");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  });
}

// Start app
init();
