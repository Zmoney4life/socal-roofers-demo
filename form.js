/* Mindframe construction demo-site - generic lead wizard + reviews renderer.
   Fully driven by window.SITE (see site-config.js, generated from client.json).
   Demo build: on submit it routes to thank-you.html. Nothing is stored or sent.
   To capture real leads, replace the body of submitLead() below. */
(function () {
  var S = window.SITE || {};
  var F = S.form || {};
  var STEPS = F.steps || [];
  var TOTAL = STEPS.length;
  var PRIMARY = (S.theme && S.theme.primary) || "#2563eb";
  var ACCENT = (S.theme && S.theme.accent) || "#ebad25";
  var PHONE = (S.business && S.business.phone) || "";
  var BRAND = (S.business && S.business.name) || "";
  var mount = document.getElementById("estimate-form");

  var state = { step: 1, disqualified: false, answers: {} };

  var OPT = "flex items-center justify-between px-4 py-3.5 rounded-lg border text-left text-sm font-medium transition-all cursor-pointer";
  var INPUT = "w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none transition-colors bg-white placeholder-gray-400 text-gray-800 brand-focus";
  var LABEL = "text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function stepDef() { return STEPS[state.step - 1] || {}; }

  /* ---------- pieces ---------- */

  function optionButton(opt, selected) {
    var cls = OPT + (selected
      ? " brand-border brand-tint brand-text"
      : " border-gray-200 bg-white text-gray-800 brand-hover-border");
    var ring = "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 " +
      (selected ? "brand-border" : "border-gray-400");
    var dot = selected ? '<span class="w-2.5 h-2.5 rounded-full brand-bg"></span>' : "";
    var left = opt.emoji
      ? '<span class="flex items-center gap-3"><span class="text-lg" aria-hidden="true">' + opt.emoji + "</span><span>" + esc(opt.label) + "</span></span>"
      : "<span>" + esc(opt.label) + "</span>";
    return '<button type="button" data-opt="' + esc(opt.label) + '" class="' + cls + '">' +
      left + '<span class="' + ring + '">' + dot + "</span></button>";
  }

  function progressBar() {
    var pct = Math.round((state.step / TOTAL) * 100);
    return '<div><div class="flex justify-between text-xs text-gray-500 mb-1.5">' +
      "<span>Step " + state.step + " of " + TOTAL + "</span><span>" + pct + "% complete</span></div>" +
      '<div class="w-full bg-gray-200 rounded-full h-1.5">' +
      '<div class="h-1.5 rounded-full transition-all duration-500" style="width:' + pct + "%;background:" + PRIMARY + '"></div>' +
      "</div></div>";
  }

  var CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M20 6 9 17l-5-5"></path></svg>';

  function consentRow(field, marketing) {
    var checked = !!state.answers[field];
    var box = "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors " +
      (checked ? "brand-bg brand-border" : "border-gray-400 bg-white");
    var word = marketing ? "Marketing and Promotional" : "Automated Reminders and Service Based";
    return '<label class="flex items-start gap-3 cursor-pointer">' +
      '<button type="button" data-consent="' + field + '" class="' + box + '">' + (checked ? CHECK : "") + "</button>" +
      '<span class="text-xs text-gray-600 leading-relaxed">I agree to receive ' + word +
      " messages from " + esc(BRAND) + (marketing ? "" : ",") + " at the phone number provided above. " +
      "This agreement isn't a condition of any purchase. Msg &amp; data rates may apply, message frequencies vary. " +
      "Text <strong>HELP</strong> to <strong>" + esc(PHONE) + "</strong> for assistance, reply <strong>STOP</strong> or OUT to opt out or unsubscribe at any time.</span></label>";
  }

  function continueButton(disabled) {
    return '<button type="button" data-continue="1"' + (disabled ? " disabled" : "") +
      ' class="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40" style="background:' + PRIMARY + '">Continue <span aria-hidden="true">&rarr;</span></button>';
  }

  /* ---------- step renderers ---------- */

  function renderChoice(d) {
    var html = '<div class="flex flex-col gap-2 fade-in">' +
      '<p class="text-sm font-bold text-[#1a1a1a]">' + esc(d.q) + "</p>";
    (d.options || []).forEach(function (o) {
      html += optionButton(o, state.answers[d.field] === o.label);
    });
    return html + "</div>";
  }

  function renderText(d) {
    var val = state.answers[d.field] || "";
    var ac = d.autocomplete && acEnabled();
    var input = '<input type="' + (d.inputType || "text") + '" data-field="' + esc(d.field) +
      '" value="' + esc(val) + '" placeholder="' + esc(d.placeholder || "") +
      '" class="' + INPUT + '" autocomplete="off" autocorrect="off" spellcheck="false"' +
      (ac ? ' data-ac="1" role="combobox" aria-autocomplete="list" aria-expanded="false"' : "") +
      " />";
    if (ac) {
      input = '<div class="ac-wrap">' + input +
        '<ul class="ac-list" data-ac-list role="listbox" hidden></ul></div>' +
        '<p class="ac-hint">Pick your address or type it in.</p>';
    }
    return '<div class="flex flex-col gap-3 fade-in"><div>' +
      '<label class="' + LABEL + '">' + esc(d.q) + ' <span class="text-red-500">*</span></label>' +
      (d.help ? '<p class="text-xs text-gray-500 mb-2">' + esc(d.help) + "</p>" : "") +
      input +
      "</div>" + continueButton(!val) + "</div>";
  }

  /* ---------- address autocomplete ----------
     Suggestions are an assist, never a requirement: the field keeps whatever the
     visitor typed, so an address the provider does not know still submits fine.
     With no provider or no API key configured this is inert and the field
     behaves as a plain text input. */

  var AC = F.address || {};

  function acEnabled() {
    return !!(AC.provider && AC.provider !== "none" && AC.apiKey);
  }

  function acQuery(q, signal) {
    if (AC.provider === "google") {
      var body = { input: q };
      if (AC.country && AC.country.length) body.includedRegionCodes = AC.country;
      if (AC.bias) {
        // Google rejects anything over 50km with INVALID_ARGUMENT
        var radius = Math.min(AC.bias.radiusMeters || 50000, 50000);
        body.locationBias = { circle: {
          center: { latitude: AC.bias.lat, longitude: AC.bias.lon },
          radius: radius } };
      }
      return fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST", signal: signal,
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": AC.apiKey },
        body: JSON.stringify(body)
      }).then(function (r) { if (!r.ok) throw new Error("ac"); return r.json(); })
        .then(function (j) {
          return (j.suggestions || []).map(function (s) {
            return s.placePrediction && s.placePrediction.text && s.placePrediction.text.text;
          }).filter(Boolean);
        });
    }
    if (AC.provider === "geoapify") {
      var u = "https://api.geoapify.com/v1/geocode/autocomplete?format=json&limit=5" +
        "&text=" + encodeURIComponent(q) + "&apiKey=" + encodeURIComponent(AC.apiKey);
      if (AC.country && AC.country.length) u += "&filter=countrycode:" + AC.country.join(",");
      if (AC.bias) u += "&bias=proximity:" + AC.bias.lon + "," + AC.bias.lat;
      return fetch(u, { signal: signal })
        .then(function (r) { if (!r.ok) throw new Error("ac"); return r.json(); })
        .then(function (j) {
          return (j.results || []).map(function (x) { return x.formatted; }).filter(Boolean);
        });
    }
    return Promise.resolve([]);
  }

  function attachAutocomplete(input) {
    var list = mount.querySelector("[data-ac-list]");
    if (!list) return;
    var items = [], active = -1, timer = null, ctrl = null, lastQuery = "";

    function close() {
      list.hidden = true; list.innerHTML = ""; items = []; active = -1;
      input.setAttribute("aria-expanded", "false");
    }

    function paint() {
      list.innerHTML = items.map(function (t, i) {
        return '<li class="ac-item" role="option" data-i="' + i + '" aria-selected="' +
          (i === active ? "true" : "false") + '">' + esc(t) + "</li>";
      }).join("");
      list.hidden = items.length === 0;
      input.setAttribute("aria-expanded", items.length ? "true" : "false");
      list.querySelectorAll(".ac-item").forEach(function (li) {
        // mousedown, not click: it fires before blur so the pick is not lost
        li.addEventListener("mousedown", function (ev) {
          ev.preventDefault();
          choose(parseInt(li.getAttribute("data-i"), 10));
        });
      });
    }

    function choose(i) {
      if (i < 0 || i >= items.length) return;
      input.value = items[i];
      state.answers[input.getAttribute("data-field")] = items[i];
      lastQuery = items[i];
      var cont = mount.querySelector("[data-continue]");
      if (cont) cont.disabled = !items[i];
      close();
    }

    function search() {
      var q = input.value.trim();
      // Every request is billable, so do not fire on fragments that could not
      // produce a useful suggestion anyway.
      if (q.length < (AC.minChars || 6) || q === lastQuery) { close(); return; }
      if (ctrl) ctrl.abort();
      ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      acQuery(q, ctrl && ctrl.signal).then(function (res) {
        if (input.value.trim() !== q) return;   // user kept typing
        items = res.slice(0, 5); active = -1; paint();
      }).catch(function () { /* offline, bad key, quota: stay a plain text field */ });
    }

    input.addEventListener("input", function () {
      lastQuery = "";
      clearTimeout(timer);
      timer = setTimeout(search, AC.debounceMs || 350);
    });

    input.addEventListener("keydown", function (ev) {
      if (list.hidden || !items.length) {
        if (ev.key === "Enter") ev.preventDefault();
        return;
      }
      if (ev.key === "ArrowDown") { ev.preventDefault(); active = (active + 1) % items.length; paint(); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); active = (active - 1 + items.length) % items.length; paint(); }
      else if (ev.key === "Enter") { ev.preventDefault(); if (active >= 0) choose(active); else close(); }
      else if (ev.key === "Escape") { close(); }
    });

    input.addEventListener("blur", function () { setTimeout(close, 120); });
  }

  function renderContact(d) {
    var a = state.answers;
    var ok = a.firstName && a.lastName && a.phone && (d.requireEmail === false || a.email);
    var emailBlock = d.requireEmail === false ? "" :
      '<div><label class="' + LABEL + '">Email Address <span class="text-red-500">*</span></label>' +
      '<input type="email" data-field="email" value="' + esc(a.email) + '" placeholder="john@email.com" class="' + INPUT + '" /></div>';
    return '<div class="flex flex-col gap-4 fade-in">' +
      '<div><p class="text-xs font-bold uppercase tracking-widest mb-1" style="color:' + ACCENT + '">Step ' + state.step + " &middot; " + esc(d.eyebrow || "Almost Done!") + "</p>" +
      '<p class="text-lg font-bold text-[#1a1a1a]" style="font-family:var(--font-heading)">' + esc(d.q) + "</p>" +
      (d.sub ? '<p class="text-xs text-gray-500 mt-1">' + esc(d.sub) + "</p>" : "") + "</div>" +
      '<div class="grid grid-cols-2 gap-3">' +
      '<div><label class="' + LABEL + '">First Name <span class="text-red-500">*</span></label>' +
      '<input type="text" data-field="firstName" value="' + esc(a.firstName) + '" placeholder="John" class="' + INPUT + '" /></div>' +
      '<div><label class="' + LABEL + '">Last Name <span class="text-red-500">*</span></label>' +
      '<input type="text" data-field="lastName" value="' + esc(a.lastName) + '" placeholder="Smith" class="' + INPUT + '" /></div></div>' +
      '<div><label class="' + LABEL + '">Phone Number <span class="text-red-500">*</span></label>' +
      '<input type="tel" data-field="phone" value="' + esc(a.phone) + '" placeholder="' + esc(d.phonePlaceholder || "(555) 555-1234") + '" class="' + INPUT + '" /></div>' +
      emailBlock +
      consentRow("smsConsent1", false) + consentRow("smsConsent2", true) +
      '<button type="button" data-submit="1"' + (ok ? "" : " disabled") +
      ' class="mt-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40" style="background:' + PRIMARY + '">' +
      esc(F.submitLabel || "Get My Free Estimate") + ' <span aria-hidden="true">&rarr;</span></button>' +
      '<p class="text-xs text-gray-400 text-center">' + esc(F.reassurance || "No obligation · Free estimate · Licensed & insured") + "</p></div>";
  }

  function contactValid() {
    var d = stepDef(), a = state.answers;
    return !!(a.firstName && a.lastName && a.phone && (d.requireEmail === false || a.email));
  }

  function renderDisqualified() {
    var dq = F.disqualify || {};
    return '<div class="flex flex-col gap-4 fade-in text-center py-4">' +
      '<p class="text-4xl" aria-hidden="true">' + (dq.emoji || "👋") + "</p>" +
      '<p class="text-lg font-bold text-[#1a1a1a]" style="font-family:var(--font-heading)">' + esc(dq.heading || "Thanks for stopping by") + "</p>" +
      '<p class="text-sm text-gray-500 leading-relaxed">' + esc(dq.body || "We work directly with property owners, so we are not the right fit right now. Feel free to pass us along to whoever owns the property.") + "</p>" +
      '<button type="button" data-restart="1" class="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">&larr; Start over</button></div>';
  }

  function stepBody() {
    var d = stepDef();
    if (d.type === "text") return renderText(d);
    if (d.type === "contact") return renderContact(d);
    return renderChoice(d);
  }

  /* ---------- shell ---------- */

  function render() {
    if (!mount) return;
    if (state.disqualified) {
      mount.innerHTML = '<div class="flex flex-col gap-5">' + renderDisqualified() + "</div>";
      wire();
      return;
    }
    var back = state.step > 1
      ? '<button type="button" data-back="1" class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors self-start"><span aria-hidden="true">&larr;</span> Back</button>'
      : "";
    mount.innerHTML =
      '<div class="flex flex-col gap-5">' +
      '<div class="text-center">' +
      '<h3 class="text-lg font-bold text-[#1a1a1a] leading-snug" style="font-family:var(--font-heading)">' + esc(F.title || "Request A Free Estimate") + "</h3>" +
      '<p class="text-sm text-gray-500 mt-1.5 leading-relaxed">' + esc(F.subtitle || "") + "</p></div>" +
      progressBar() + stepBody() + back +
      "</div>";
    wire();
  }

  function advance() { state.step = Math.min(state.step + 1, TOTAL); render(); }
  function goBack() { state.step = Math.max(state.step - 1, 1); render(); }

  function submitLead() {
    /* DEMO: no capture. To go live, POST state.answers to a webhook here
       (e.g. a GoHighLevel inbound webhook) and then redirect. */
    window.location.href = "thank-you.html";
  }

  function wire() {
    mount.querySelectorAll("[data-opt]").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = stepDef();
        var label = b.getAttribute("data-opt");
        state.answers[d.field] = label;
        var picked = (d.options || []).filter(function (o) { return o.label === label; })[0];
        render();
        setTimeout(function () {
          if (picked && picked.disqualify) { state.disqualified = true; render(); }
          else advance();
        }, 220);
      });
    });

    mount.querySelectorAll("[data-field]").forEach(function (inp) {
      inp.addEventListener("input", function () {
        state.answers[inp.getAttribute("data-field")] = inp.value;
        var cont = mount.querySelector("[data-continue]");
        if (cont) cont.disabled = !state.answers[stepDef().field];
        var sub = mount.querySelector("[data-submit]");
        if (sub) sub.disabled = !contactValid();
      });
      if (inp.getAttribute("data-ac")) attachAutocomplete(inp);
    });

    var cont = mount.querySelector("[data-continue]");
    if (cont) cont.addEventListener("click", function () { if (!cont.disabled) advance(); });

    mount.querySelectorAll("[data-consent]").forEach(function (c) {
      c.addEventListener("click", function () {
        var f = c.getAttribute("data-consent");
        state.answers[f] = !state.answers[f];
        render();
      });
    });

    var sub = mount.querySelector("[data-submit]");
    if (sub) sub.addEventListener("click", function () { if (!sub.disabled) submitLead(); });

    var back = mount.querySelector("[data-back]");
    if (back) back.addEventListener("click", goBack);

    var restart = mount.querySelector("[data-restart]");
    if (restart) restart.addEventListener("click", function () {
      state = { step: 1, disqualified: false, answers: {} };
      render();
    });
  }

  render();

  /* ---------- reviews ---------- */
  var grid = document.getElementById("reviews-grid");
  if (grid) {
    var STAR = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="2" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>';
    var stars = STAR + STAR + STAR + STAR + STAR;
    grid.innerHTML = (S.reviews || []).map(function (r) {
      return '<div class="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white p-6 flex flex-col gap-4">' +
        '<div class="flex gap-0.5">' + stars + "</div>" +
        '<p class="text-gray-600 text-sm leading-relaxed italic">"' + esc(r.text) + '"</p>' +
        '<div class="mt-auto"><p class="font-semibold text-[#1a1a1a] text-sm">' + esc(r.name) + "</p>" +
        '<p class="text-xs text-gray-500">' + esc(r.sub || r.city || "") + "</p></div></div>";
    }).join("");
  }
})();
