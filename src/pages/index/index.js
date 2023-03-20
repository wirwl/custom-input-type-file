import "../components/test-file-browser/test-file-browser";

document.querySelector(".verify").addEventListener("click", () => {
  const files = document.querySelector("test-file-browser").files;
  console.log(files);
  document.querySelector(".count").innerHTML = `Кол-во: ${files.length}`;
});

document.querySelector(".max-files").addEventListener("click", () => {
  const files = document.querySelector("test-file-browser");
  files.setAttribute("max-files", 5);
});

document.querySelector(".max-size").addEventListener("click", () => {
  const files = document.querySelector("test-file-browser");
  files.setAttribute("max-size", 41457206);
});
