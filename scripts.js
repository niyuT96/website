const loadSections = async () => {
  const includes = document.querySelectorAll("[data-include]");
  const tasks = Array.from(includes).map(async (section) => {
    const response = await fetch(section.dataset.include);
    if (!response.ok) {
      throw new Error(`Failed to load ${section.dataset.include}`);
    }
    const html = await response.text();
    section.outerHTML = html;
  });

  await Promise.all(tasks);
};

const loadJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
};

const loadJsonWithFallback = async (paths) => {
  for (const path of paths) {
    const response = await fetch(path);
    if (response.ok) {
      return response.json();
    }
  }
  throw new Error(`Failed to load ${paths.join(", ")}`);
};

const renderSite = (data) => {
  if (!data) return;

  if (data.pageTitle) {
    document.title = data.pageTitle;
  }

  document.querySelectorAll("[data-site-text]").forEach((element) => {
    const key = element.dataset.siteText;
    if (key && Object.prototype.hasOwnProperty.call(data, key)) {
      element.textContent = data[key];
    }
  });

  document.querySelectorAll("[data-site-placeholder]").forEach((element) => {
    const key = element.dataset.sitePlaceholder;
    if (key && Object.prototype.hasOwnProperty.call(data, key)) {
      element.setAttribute("placeholder", data[key]);
    }
  });

};

const renderProjects = (projects) => {
  const cardsContainer = document.querySelector("[data-project-cards]");
  const modalsContainer = document.querySelector("[data-project-modals]");
  if (!cardsContainer || !modalsContainer) return;

  cardsContainer.innerHTML = "";
  modalsContainer.innerHTML = "";

  (projects || []).forEach((project) => {
    if (!project || !project.id) return;

    const card = document.createElement("article");
    card.className = "card project-card";
    card.dataset.modal = `project-${project.id}`;
    card.setAttribute("role", "button");
    card.tabIndex = 0;

    const image = document.createElement("img");
    image.className = "project-image";
    image.src = project.preview || "";
    image.alt = project.previewAlt || `${project.title || "Project"} preview`;
    card.appendChild(image);

    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = project.tag || "";

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = project.meta || "";

    cardTop.append(tag, meta);
    card.appendChild(cardTop);

    const title = document.createElement("h3");
    title.textContent = project.title || "";

    const summary = document.createElement("p");
    summary.textContent = project.summary || "";

    card.append(title, summary);
    cardsContainer.appendChild(card);

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = `project-${project.id}`;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", `project-${project.id}-title`);

    const panel = document.createElement("div");
    panel.className = "modal-panel";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "modal-close";
    closeButton.dataset.modalClose = "true";
    closeButton.setAttribute("aria-label", "Close dialog");
    closeButton.textContent = "X";

    const kicker = document.createElement("p");
    kicker.className = "modal-kicker";
    kicker.textContent = project.tag || "";

    const modalTitle = document.createElement("h3");
    modalTitle.id = `project-${project.id}-title`;
    modalTitle.textContent = project.title || "";

    const details = document.createElement("p");
    details.className = "muted";
    details.textContent = project.details || "";

    const list = document.createElement("ul");
    list.className = "modal-list";

    (project.list || []).forEach((item) => {
      const listItem = document.createElement("li");
      const text = String(item || "");
      const separatorIndex = text.indexOf(":");
      if (separatorIndex > 0) {
        const label = document.createElement("strong");
        label.textContent = text.slice(0, separatorIndex + 1) + " ";
        listItem.appendChild(label);
        listItem.append(text.slice(separatorIndex + 1).trim());
      } else {
        listItem.textContent = text;
      }
      list.appendChild(listItem);
    });

    panel.append(closeButton, kicker, modalTitle, details, list);
    modal.appendChild(panel);
    modalsContainer.appendChild(modal);
  });
};

const renderExperience = (experiences) => {
  const timeline = document.querySelector("[data-experience-timeline]");
  if (!timeline) return;

  timeline.innerHTML = "";

  (experiences || []).forEach((experience) => {
    if (!experience) return;

    const item = document.createElement("div");
    item.className = "timeline-item";

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = experience.time || "";

    const content = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = experience.title || "";

    const company = document.createElement("p");
    company.textContent = experience.company || "";

    const summaryLines = Array.isArray(experience.summary)
      ? experience.summary
      : String(experience.summary || "").split(/\r?\n+/).filter(Boolean);

    content.append(title, company);

    if (summaryLines.length) {
      const list = document.createElement("ul");
      list.className = "timeline-list";
      summaryLines.forEach((line) => {
        const listItem = document.createElement("li");
        listItem.textContent = line;
        list.appendChild(listItem);
      });
      content.appendChild(list);
    }

    item.append(time, content);
    timeline.appendChild(item);
  });
};

const renderSkills = (groups) => {
  const cardsContainer = document.querySelector("[data-skills-cards]");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";

  (groups || []).forEach((group) => {
    if (!group) return;

    const card = document.createElement("article");
    card.className = "card skills-card";

    const title = document.createElement("h3");
    title.textContent = group.title || "";

    const list = document.createElement("ul");
    if (group.layout === "tags") {
      list.classList.add("skills-tags");
    }
    (group.items || []).forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.appendChild(listItem);
    });

    card.append(title, list);
    cardsContainer.appendChild(card);
  });
};

const renderEducation = (items) => {
  const list = document.querySelector("[data-education-list]");
  if (!list) return;

  list.innerHTML = "";

  (items || []).forEach((item) => {
    if (!item) return;

    const entry = document.createElement("div");

    const degree = document.createElement("h3");
    degree.textContent = item.degree || "";

    const school = document.createElement("p");
    school.textContent = item.school || "";

    const period = document.createElement("p");
    period.className = "muted";
    period.textContent = item.period || "";

    entry.append(degree, school, period);
    list.appendChild(entry);
  });
};

const setupProjectsCarousel = () => {
  const cardsContainer = document.querySelector("[data-project-cards]");
  if (!cardsContainer || cardsContainer.closest(".projects-carousel")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "projects-carousel";

  const controls = document.createElement("div");
  controls.className = "projects-controls";

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.setAttribute("aria-label", "Scroll projects left");
  prevButton.textContent = "\u2039";

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Scroll projects right");
  nextButton.textContent = "\u203A";

  controls.append(prevButton, nextButton);
  cardsContainer.classList.add("projects-track");

  const parent = cardsContainer.parentElement;
  parent.insertBefore(wrapper, cardsContainer);
  wrapper.append(cardsContainer, controls);

  const updateButtons = () => {
    const maxScroll = cardsContainer.scrollWidth - cardsContainer.clientWidth;
    const atStart = cardsContainer.scrollLeft <= 0;
    const atEnd = cardsContainer.scrollLeft >= maxScroll - 1;
    prevButton.disabled = atStart;
    nextButton.disabled = atEnd;
  };

  const scrollByAmount = (direction) => {
    const amount = Math.min(cardsContainer.clientWidth * 0.9, 480);
    cardsContainer.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  prevButton.addEventListener("click", () => scrollByAmount(-1));
  nextButton.addEventListener("click", () => scrollByAmount(1));
  cardsContainer.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
};

let modalListenersBound = false;

const initProjectModals = () => {
  const closeModal = (modal) => {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  };

  if (!modalListenersBound) {
    document.addEventListener("click", (event) => {
      const closeButton = event.target.closest("[data-modal-close]");
      if (closeButton) {
        const currentModal = closeButton.closest(".modal");
        if (currentModal) closeModal(currentModal);
        return;
      }

      const trigger = event.target.closest("[data-modal]");
      if (!trigger) return;
      const modal = document.getElementById(trigger.dataset.modal);
      if (!modal) return;
      modal.classList.add("is-open");
      document.body.classList.add("no-scroll");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        const trigger = event.target.closest("[data-modal]");
        if (!trigger) return;
        event.preventDefault();
        const modal = document.getElementById(trigger.dataset.modal);
        if (!modal) return;
        modal.classList.add("is-open");
        document.body.classList.add("no-scroll");
        return;
      }
      if (event.key !== "Escape") return;
      const openModal = document.querySelector(".modal.is-open");
      if (openModal) closeModal(openModal);
    });

    modalListenersBound = true;
  }

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });
};

const supportedLangs = new Set(["de", "en"]);
const defaultLang = "de";
const storageKey = "siteLang";

const getInitialLang = () => {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");
  if (supportedLangs.has(urlLang)) {
    return urlLang;
  }
  const stored = localStorage.getItem(storageKey);
  if (supportedLangs.has(stored)) {
    return stored;
  }
  return defaultLang;
};

const setActiveLangButton = (lang) => {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const loadLanguageData = async (lang) => {
  const suffix = supportedLangs.has(lang) ? `.${lang}` : "";
  const withFallback = (name) => [
    `data/${name}${suffix}.json`,
    `data/${name}.json`
  ];

  const [site, projects, experiences, skills, education] = await Promise.all([
    loadJsonWithFallback(withFallback("site")),
    loadJsonWithFallback(withFallback("projects")),
    loadJsonWithFallback(withFallback("experience")),
    loadJsonWithFallback(withFallback("skills")),
    loadJsonWithFallback(withFallback("education"))
  ]);

  renderSite(site);
  renderProjects(projects);
  renderExperience(experiences);
  renderSkills(skills);
  renderEducation(education);
  setupProjectsCarousel();
  initProjectModals();
  document.documentElement.lang = lang;
};

const initLanguageSwitcher = () => {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", async () => {
      const lang = button.dataset.lang;
      if (!supportedLangs.has(lang)) return;
      localStorage.setItem(storageKey, lang);
      setActiveLangButton(lang);
      await loadLanguageData(lang);
    });
  });
};

const initMobileNav = () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const nav = document.querySelector(".nav");
  if (!toggle || !navLinks || !nav) return;

  const setOpen = (isOpen) => {
    navLinks.classList.toggle("is-open", isOpen);
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  toggle.addEventListener("click", () => {
    const isOpen = !navLinks.classList.contains("is-open");
    setOpen(isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("is-open")) return;
    if (event.target.closest(".nav")) return;
    setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      setOpen(false);
    }
  });
};

const initPage = async () => {
  await loadSections();
  initMobileNav();
  initLanguageSwitcher();
  const lang = getInitialLang();
  setActiveLangButton(lang);
  await loadLanguageData(lang);
};

initPage().catch((error) => console.error(error));
