
console.log("Cookies", document.cookie);
document.addEventListener("DOMContentLoaded", () => {

    // Sidebar toggle
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");

    const openClasses = ["w-[264px]", "min-w-[264px]", "opacity-100"];
    const collapsedClasses = ["w-0", "min-w-0", "opacity-0"];

    toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        if (isExpanded) {
            sidebar.classList.remove(...openClasses);
            sidebar.classList.add(...collapsedClasses);
            toggleBtn.setAttribute("aria-expanded", "false");
        } else {
            sidebar.classList.remove(...collapsedClasses);
            sidebar.classList.add(...openClasses);
            toggleBtn.setAttribute("aria-expanded", "true");
        }
    });
    // 

    // searchbar
    const searchToggleBtn = document.getElementById("searchToggle");
    const searchBox = document.getElementById("searchBox");
    const wrapper = document.getElementById("searchWrapper");

    searchToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // Show as dropdown on mobile
        searchBox.classList.toggle("max-lg:hidden");
        searchBox.classList.toggle("absolute");
        searchBox.classList.toggle("right-0");
        searchBox.classList.toggle("w-64");
        searchBox.classList.toggle("z-50");
    });

    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            // Reset to hidden on mobile
            searchBox.classList.add("max-lg:hidden");
            searchBox.classList.remove("absolute", "tw-6a7f3474", "w-64", "z-50");
        }
    });

    // profile dropdown
    const toggle = document.getElementById("dropdown-toggle");
    const menu = document.getElementById("dropdown-menu");
    const links = menu.querySelectorAll(".dropdown-item");

    function show() {
        menu.classList.remove("hidden");
        menu.classList.add("block");
        toggle.setAttribute("aria-expanded", "true");
    }

    function hide() {
        menu.classList.add("hidden");
        menu.classList.remove("block");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        isExpanded ? hide() : show();
    });

    // Close on Escape key (Essential for WCAG)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hide();
            toggle.focus();
        }
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== toggle) hide();
    });

    // Close when a link is clicked
    links.forEach(link => link.addEventListener("click", hide));
    // 

    // collapsible submenus
    document.querySelectorAll(".collapsible-toggle").forEach((toggle) => {

        toggle.addEventListener("click", function () {
            const menu = this.nextElementSibling; // the submenu <ul>
            const arrowIcon = this.querySelector(".arrow");
            const isOpen = menu.offsetHeight !== 0;

            if (isOpen) {
                menu.style.maxHeight = "0px";
                arrowIcon.classList.add("-rotate-90");
                this.setAttribute("aria-expanded", "false");
            } else {
                menu.style.maxHeight = menu.scrollHeight + "px";
                arrowIcon.classList.remove("-rotate-90");
                this.setAttribute("aria-expanded", "true");
            }
        });
    });

});