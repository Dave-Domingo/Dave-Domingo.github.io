// Renders resume.pdf onto a canvas at exactly the container's width, with
// no toolbar or thumbnail sidebar -- Chrome's native <object> PDF viewer
// couldn't be made to hide its own chrome without breaking its fit-to-width
// zoom (tried #toolbar=0, #navpanes=0, #view=FitH; all unreliable), so this
// renders the page directly via PDF.js instead of embedding that viewer.

(function () {
  if (typeof pdfjsLib === "undefined") return;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  var canvas = document.getElementById("resume-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var pdfDoc = null;
  var renderTimer = null;

  function renderPage() {
    if (!pdfDoc) return;
    pdfDoc.getPage(1).then(function (page) {
      var containerWidth = canvas.parentElement.clientWidth;
      var unscaledViewport = page.getViewport({ scale: 1 });
      var scale = containerWidth / unscaledViewport.width;
      var pixelRatio = window.devicePixelRatio || 1;
      var viewport = page.getViewport({ scale: scale * pixelRatio });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.height = viewport.height / pixelRatio + "px";

      page.render({ canvasContext: ctx, viewport: viewport });
    });
  }

  pdfjsLib.getDocument("resume.pdf").promise.then(function (pdf) {
    pdfDoc = pdf;
    renderPage();
  });

  window.addEventListener("resize", function () {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderPage, 150);
  });
})();
