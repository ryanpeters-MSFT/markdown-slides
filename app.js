const fileInput = document.getElementById("file-input");
const slideEl = document.getElementById("slide");
const slideIndexEl = document.getElementById("slide-index");
const slideTitleEl = document.getElementById("slide-title");
const deckEl = document.querySelector(".deck");
let dragDepth = 0;

const demoMarkdown = `# Welcome to Markdown Slides

---

## What is this?
A tiny, static slide deck that renders Markdown files.

- No build step
- Keyboard navigation
- Fullscreen support

---

## Code blocks work

\`\`\`js
const deck = "Just drop a file";
console.log(deck);
\`\`\`

---

## Images and links

![Warm landscape](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=900&q=80&auto=format&fit=crop)

[Learn more about Markdown](https://www.markdownguide.org/basic-syntax/)

---

## Thanks!
Press \`F\` for fullscreen.
`;

let slides = [demoMarkdown];
let activeIndex = 0;

marked.setOptions({
  breaks: true,
  gfm: true,
});

function splitSlides(markdown) {
  return markdown
    .split(/^---$/m)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function renderSlide(index) {
  const total = slides.length;
  const safeIndex = ((index % total) + total) % total;
  const raw = slides[safeIndex];
  const html = marked.parse(raw);

  slideEl.innerHTML = html;
  slideEl.classList.remove("reveal");
  void slideEl.offsetWidth;
  slideEl.classList.add("reveal");

  activeIndex = safeIndex;
  slideIndexEl.textContent = `${safeIndex + 1} / ${total}`;

  const headingMatch = raw.match(/^#\s+(.+)/m);
  slideTitleEl.textContent = headingMatch ? headingMatch[1] : "";

  if (document.fullscreenElement === deckEl) {
    deckEl.scrollTop = 0;
  }
}

function isAtDeckBottom() {
  const remaining = deckEl.scrollHeight - (deckEl.scrollTop + deckEl.clientHeight);
  return remaining <= 2;
}

function loadMarkdown(markdown) {
  slides = splitSlides(markdown);
  if (slides.length === 0) {
    slides = ["# No content\nAdd slides separated with ---"]; 
  }
  renderSlide(0);
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

async function loadMarkdownFiles(fileList) {
  const files = Array.from(fileList || []).sort((a, b) => a.name.localeCompare(b.name));
  if (files.length === 0) return;

  try {
    const contents = await Promise.all(files.map((file) => readFileAsText(file)));
    const combined = contents
      .map((text) => splitSlides(text))
      .flat()
      .filter(Boolean);

    slides = combined.length > 0 ? combined : ["# No content\nAdd slides separated with ---"];
    renderSlide(0);
  } catch (error) {
    slides = ["# Failed to load files\nPlease try again."];
    renderSlide(0);
  }
}

function handleFile(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  if (files.length === 1) {
    readFileAsText(files[0]).then(loadMarkdown).catch(() => {
      slides = ["# Failed to load file\nPlease try again."];
      renderSlide(0);
    });
    return;
  }
  loadMarkdownFiles(files);
}

function handleKey(event) {
  if (event.key === "ArrowRight") {
    renderSlide(activeIndex + 1);
  }
  if (event.key === "ArrowLeft") {
    renderSlide(activeIndex - 1);
  }
  if (event.key.toLowerCase() === "f") {
    toggleFullscreen();
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    deckEl.requestFullscreen().catch(() => {});
    return;
  }
  document.exitFullscreen().catch(() => {});
}

function syncPresentationMode() {
  document.body.classList.toggle("presenting", Boolean(document.fullscreenElement));
}

function hasFiles(event) {
  return event.dataTransfer && Array.from(event.dataTransfer.types || []).includes("Files");
}

function handleDragEnter(event) {
  if (!hasFiles(event)) return;
  event.preventDefault();
  dragDepth += 1;
  deckEl.classList.add("dragging");
}

function handleDragLeave(event) {
  if (!hasFiles(event)) return;
  event.preventDefault();
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) {
    deckEl.classList.remove("dragging");
  }
}

function handleDragOver(event) {
  if (!hasFiles(event)) return;
  event.preventDefault();
}

function handleDrop(event) {
  if (!hasFiles(event)) return;
  event.preventDefault();
  dragDepth = 0;
  deckEl.classList.remove("dragging");
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    loadMarkdownFiles(event.dataTransfer.files);
  }
}

fileInput.addEventListener("change", handleFile);
document.addEventListener("keydown", handleKey);
deckEl.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", syncPresentationMode);
deckEl.addEventListener("dragenter", handleDragEnter);
deckEl.addEventListener("dragleave", handleDragLeave);
deckEl.addEventListener("dragover", handleDragOver);
deckEl.addEventListener("drop", handleDrop);
document.addEventListener("dragover", handleDragOver);
document.addEventListener("drop", handleDrop);

loadMarkdown(demoMarkdown);
