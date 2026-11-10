// Canvas-only helper: with ?annotate=1 in the URL, number the elements listed in
// window.ANNOTATIONS ([selector, label] pairs) and show a legend. Used to produce
// annotated evidence screenshots; absent from the real app.
(function () {
  // ?focus=1: focus the active nav item so a screenshot shows the accent focus ring
  // (keyboard state; AC-004.2). Chromium applies :focus-visible to script focus
  // when the page has had no pointer interaction.
  if (/[?&]focus=1/.test(location.search)) {
    var f = document.querySelector('.nav a[aria-current="page"]') || document.querySelector(".nav a");
    if (f) f.focus();
  }
  if (!/[?&]annotate=1/.test(location.search)) return;
  var items = window.ANNOTATIONS || [];
  var legend = document.createElement("ol");
  legend.className = "ann-legend";
  items.forEach(function (it, i) {
    var el = document.querySelector(it[0]);
    if (!el) return;
    var r = el.getBoundingClientRect();
    var b = document.createElement("span");
    b.className = "ann-badge";
    b.textContent = String(i + 1);
    b.style.left = Math.max(0, r.left + window.scrollX - 22) + "px";
    b.style.top = r.top + window.scrollY - 2 + "px";
    document.body.appendChild(b);
    var li = document.createElement("li");
    li.textContent = it[1];
    legend.appendChild(li);
  });
  document.body.appendChild(legend);
})();
