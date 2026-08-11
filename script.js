document.addEventListener("DOMContentLoaded", () => {
  const stylesheetHref = document.querySelector('link[rel="stylesheet"]')?.getAttribute("href") || "";
  const insidePagesFolder = stylesheetHref.startsWith("../");
  const pagePrefix = insidePagesFolder ? "" : "pages/";

  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    if (!menu.querySelector('a[href$="adviser.html"]')) {
      const adviserLink = document.createElement("a");
      adviserLink.href = `${pagePrefix}adviser.html`;
      adviserLink.textContent = "Meet Our Adviser";
      menu.appendChild(adviserLink);
    }
  });

  const navList = document.querySelector(".nav-list");
  if (navList && !navList.querySelector('a[href$="contact.html"]')) {
    const contactItem = document.createElement("li");
    contactItem.innerHTML = `<a class="nav-link" href="${pagePrefix}contact.html">Contact</a>`;
    const resourcesItem = navList.querySelector(".nav-cta")?.closest("li");
    navList.insertBefore(contactItem, resourcesItem || null);
  }

  const footerLinks = document.querySelector(".footer-links");
  if (footerLinks && !footerLinks.querySelector('a[href$="contact.html"]')) {
    const contactLink = document.createElement("a");
    contactLink.href = `${pagePrefix}contact.html`;
    contactLink.textContent = "Contact";
    const resourcesLink = footerLinks.querySelector('a[href$="login.html"]');
    footerLinks.insertBefore(contactLink, resourcesLink || null);
  }

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-dropdown-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const dropdown = button.closest(".nav-dropdown");
      const open = dropdown.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  document.querySelectorAll("[data-faq-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const answer = document.getElementById(button.getAttribute("aria-controls"));
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      answer?.classList.toggle("is-open", !open);
    });
  });

  const gallery = document.querySelector("[data-hero-gallery]");
  if (gallery) {
    const slides = [...gallery.querySelectorAll("[data-gallery-slide]")];
    const dots = [...document.querySelectorAll("[data-gallery-dot]")];
    const count = gallery.querySelector("[data-gallery-count]");
    const previousButton = document.querySelector("[data-gallery-prev]");
    const nextButton = document.querySelector("[data-gallery-next]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let rotationTimer;

    const showSlide = (nextIndex) => {
      current = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));
      dots.forEach((dot, index) => {
        const active = index === current;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (count) count.textContent = `${current + 1} / ${slides.length}`;
    };

    const stopRotation = () => window.clearInterval(rotationTimer);
    const startRotation = () => {
      stopRotation();
      if (!reducedMotion && slides.length > 1) {
        rotationTimer = window.setInterval(() => showSlide(current + 1), 6500);
      }
    };

    previousButton?.addEventListener("click", () => {
      showSlide(current - 1);
      startRotation();
    });
    nextButton?.addEventListener("click", () => {
      showSlide(current + 1);
      startRotation();
    });
    dots.forEach((dot, index) => dot.addEventListener("click", () => {
      showSlide(index);
      startRotation();
    }));

    const layeredHero = gallery.closest(".layered-hero");
    layeredHero?.addEventListener("pointerenter", stopRotation);
    layeredHero?.addEventListener("pointerleave", startRotation);
    layeredHero?.addEventListener("focusin", stopRotation);
    layeredHero?.addEventListener("focusout", (event) => {
      if (!layeredHero.contains(event.relatedTarget)) startRotation();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopRotation();
      else startRotation();
    });

    showSlide(0);
    startRotation();
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const formStatus = document.querySelector("[data-contact-status]");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (contactForm.action.includes("YOUR_FORM_ID")) {
        formStatus.textContent = "Add your Formspree form ID before using this form. See CONTACT-SETUP.md.";
        formStatus.className = "contact-form-status error";
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
      formStatus.textContent = "";
      formStatus.className = "contact-form-status";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Form submission failed");
        contactForm.reset();
        formStatus.textContent = "Thank you! Your message was sent to MSJ DECA.";
        formStatus.className = "contact-form-status success";
      } catch (error) {
        formStatus.textContent = "Your message could not be sent. Please try again or email msjdeca@gmail.com.";
        formStatus.className = "contact-form-status error";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send message";
      }
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const colors = ["#0474c4", "#5379ae", "#a8c4ec", "#06457f", "#2c444c", "#a7c4bb"];
    let lastBurst = 0;

    window.addEventListener("pointermove", (event) => {
      const now = performance.now();
      if (now - lastBurst < 42 || event.pointerType === "touch") return;
      lastBurst = now;

      const dot = document.createElement("span");
      dot.className = "confetti-dot";
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      dot.style.setProperty("--confetti-color", colors[Math.floor(Math.random() * colors.length)]);
      dot.style.setProperty("--drift-x", `${Math.random() * 24 - 12}px`);
      dot.style.setProperty("--drift-y", `${16 + Math.random() * 24}px`);
      dot.style.transform = `rotate(${Math.random() * 90}deg)`;
      document.body.appendChild(dot);
      window.setTimeout(() => dot.remove(), 700);
    }, { passive: true });
  }
});
