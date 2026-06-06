(function () {
  function createLoader() {
    if (document.getElementById("pageLoader")) return;
    const loader = document.createElement("div");
    loader.id = "pageLoader";
    loader.className = "page-loader is-visible";
    loader.setAttribute("aria-live", "polite");
    loader.innerHTML = `
      <div class="loader-bg"></div>
      <div class="loader-card">
        <div class="loader-emblem">
          <img src="assets/img/logo-crimescope.png" alt="GeoSafe Yogyakarta" />
        </div>
        <div class="loader-copy">
          <span>GeoSafe Yogyakarta</span>
          <strong>Memuat data spasial...</strong>
          <small id="loaderHint">Menyiapkan peta, analisis, dan dashboard</small>
        </div>
        <div class="loader-bar"><i></i></div>
      </div>`;
    document.body.prepend(loader);
  }

  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      loader.classList.remove("is-visible");
    }, 420);
    window.setTimeout(() => loader.remove(), 1050);
  }

  function showTransitionLoader(label) {
    createLoader();
    const loader = document.getElementById("pageLoader");
    const hint = document.getElementById("loaderHint");
    if (loader) {
      loader.classList.remove("is-hidden");
      loader.classList.add("is-visible", "is-transitioning");
    }
    if (hint && label) hint.textContent = label;
  }

  function wirePageTransitions() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute("href") || "";
      const target = link.getAttribute("target");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || target === "_blank") return;
      let url;
      try { url = new URL(href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        const text = (link.textContent || "").trim() || "halaman";
        showTransitionLoader(`Membuka ${text}...`);
        window.setTimeout(() => { window.location.href = url.href; }, 520);
      });
    });
  }

  function initCommon() {
    createLoader();
    const page = document.body.dataset.page;

    document.querySelectorAll(".navlinks a").forEach((a) => {
      if (a.dataset.page === page) a.classList.add("active");
    });

    const mobileToggle = document.getElementById("mobileToggle");
    const navlinks = document.getElementById("navlinks");
    if (mobileToggle && navlinks) {
      mobileToggle.addEventListener("click", () => navlinks.classList.toggle("open"));
      navlinks.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => navlinks.classList.remove("open"));
      });
    }

    const cursorGlow = document.getElementById("cursorGlow");
    if (cursorGlow) {
      window.addEventListener("pointermove", (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      });
    }

    wirePageTransitions();
    window.addEventListener("load", hideLoader);
    window.GeoSafeLoader = { show: showTransitionLoader, hide: hideLoader };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCommon);
  } else {
    initCommon();
  }
})();
