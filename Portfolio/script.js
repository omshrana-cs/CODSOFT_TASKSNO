// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        });
    });
}

// Automatically update the footer year
const year = document.querySelector("#year");

if (year) {
    year.textContent = new Date().getFullYear();
}

// Reveal sections smoothly as the visitor scrolls
const revealTargets = document.querySelectorAll(
    ".section-heading, .about-main-card, .mini-card, .skill-card, .project-card, .contact-panel"
);

revealTargets.forEach((element) => {
    element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealTargets.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealTargets.forEach((element) => {
        element.classList.add("visible");
    });
}

// Highlight the navigation link for the visible section
const sectionLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    sectionLinks.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${entry.target.id}`
                        );
                    });
                }
            });
        },
        { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach((section) => {
        activeObserver.observe(section);
    });
}
