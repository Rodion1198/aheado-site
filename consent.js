/* Aheado cookie consent (Google Consent Mode v2)
   The consent default is set inline in <head> before gtag.js loads.
   This file shows the banner, stores the choice and lets visitors change it
   via any element with data-cookie-settings. */
(() => {
  const KEY = "aheado-consent";
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  const update = v => { if (typeof gtag === "function") gtag("consent", "update", { analytics_storage: v }); };

  const css = `
.ck{position:fixed;z-index:1000;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));max-width:440px;
  background:var(--card,#FBF8F1);color:var(--ink,#2B2422);border:1px solid var(--line,var(--rule,#E2D9CA));border-radius:18px;
  box-shadow:0 12px 40px rgba(43,31,36,.16);padding:18px 20px;font-family:inherit;font-size:15px;line-height:1.5;font-weight:400;
  opacity:0;transform:translateY(12px);transition:opacity .3s ease,transform .3s ease}
.ck.on{opacity:1;transform:none}
.ck p{margin:0 0 14px}
.ck a{color:var(--accent,#7A3341);text-underline-offset:3px}
.ck-b{display:flex;gap:10px}
.ck button{flex:1;font-family:inherit;font-size:15px;line-height:1;font-weight:600;padding:12px 16px;border-radius:999px;cursor:pointer;
  background:transparent;color:var(--ink,#2B2422);border:1.5px solid var(--ink,#2B2422);transition:background .2s,color .2s}
.ck button:hover{background:var(--ink,#2B2422);color:var(--card,#FBF8F1)}
.ck button:focus-visible{outline:2px solid var(--accent,#7A3341);outline-offset:3px}
@media (max-width:520px){.ck{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));max-width:none}}
@media (prefers-reduced-motion:reduce){.ck{transition:none}}`;

  let box = null;
  function build() {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    box = document.createElement("div");
    box.className = "ck"; box.setAttribute("role", "region"); box.setAttribute("aria-label", "Cookie consent"); box.hidden = true;
    box.innerHTML = `<p>We'd like to use Google Analytics cookies to count visits to this website. The Aheado app itself has no analytics. <a href="/privacy">Privacy Policy</a></p>
      <div class="ck-b"><button type="button" data-v="denied">Decline</button><button type="button" data-v="granted">Accept</button></div>`;
    box.addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (b) choose(b.dataset.v); });
    document.body.appendChild(box);
  }
  function show() {
    if (!box) build();
    box.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add("on")));
  }
  function hide() {
    box.classList.remove("on");
    setTimeout(() => { box.hidden = true; }, 300);
  }
  function clearGaCookies() {
    const host = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").map(c => c.trim().split("=")[0]).filter(n => /^_ga/.test(n)).forEach(n => {
      [host, "." + host, ""].forEach(d => {
        document.cookie = `${n}=; Max-Age=0; path=/${d ? "; domain=" + d : ""}`;
      });
    });
  }
  function choose(v) {
    set(v); update(v);
    if (v === "denied") clearGaCookies();
    hide();
  }

  document.addEventListener("click", e => {
    if (e.target.closest("[data-cookie-settings]")) { e.preventDefault(); show(); }
  });
  if (!get()) show();
})();
