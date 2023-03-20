import { testFileBrowserStyle } from "./style";

export class TestFileBrowser extends HTMLElement {
  constructor() {
    super();
    this.init();
    this.addEventListeners();
  }

  init() {
    this.events = {
      close: new CustomEvent("test-file-browser.changed", {
        bubbles: true,
        detail: { opened: false }
      }),
      open: new CustomEvent("test-file-browser.changed", {
        bubbles: true,
        detail: { opened: true }
      })
    };

    this.startText = this.innerHTML || "Выберите файл";

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
    <div class="files">
    <span class="files-text">${this.startText}</span>
    <div class="files-expand" style="display: none">
    <ul class="files-list"></ul>
    </div>      
  </div> 

     <label class="test">
       <input multiple class="native-file-input" type="file">
       <button class="add-files">+</button>
     </label>
 
     ${testFileBrowserStyle}  
    `;

    this.el = {
      nativeFileInput: this.shadowRoot.querySelector(".native-file-input"),
      addFiles: this.shadowRoot.querySelector(".add-files"),
      files: this.shadowRoot.querySelector(".files"),
      filesText: this.shadowRoot.querySelector(".files-text"),
      list: this.shadowRoot.querySelector(".files-list"),
      closes: this.shadowRoot.querySelectorAll(".files-list-item-close")
    };
  }

  addEventListeners() {
    document.addEventListener("click", (event) => {
      const withinBoundaries = event.composedPath().includes(this.el.list);

      if (this.opened && !withinBoundaries) {
        this.opened = false;
      }
    });

    this.el.nativeFileInput.addEventListener("change", () => {
      const { files } = this.el.nativeFileInput;
      this.addFilesToInput(files);
    });

    this.addEventListener("click", (event) => event.stopPropagation());
    this.el.list.addEventListener("click", (event) => event.stopPropagation());

    this.el.files.addEventListener("click", (event) => {
      if (this.el.nativeFileInput.files.length > 0) {
        this.opened = !this.opened;
      }
    });

    this.el.addFiles.addEventListener("click", () => {
      if (!this.el.addFiles.classList.contains("add-files--disabled"))
        this.el.nativeFileInput.click();
    });

    this.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.target.classList.add("blur-effect");
    });

    this.addEventListener("dragleave", (event) => {
      event.target.classList.remove("blur-effect");
    });

    this.addEventListener("drop", (event) => {
      const { files } = event.dataTransfer;
      this.el.nativeFileInput.files = files;
      console.log(files);
      this.addFilesToInput(files);
      event.preventDefault();
      event.target.classList.remove("blur-effect");
    });
  }

  addFilesToInput(files) {
    this.el.list.innerHTML = this.createFileList(files);
    this.addEventListenersToCloseButtons();
    this.updateInputText();
    this.checkLimits();
    if (files.length === 0) this.opened = false;
  }

  checkLimits() {
    const { files } = this.el.nativeFileInput;
    const size = this.getFileListSize(files);

    const limitByFilesCount = this.maxFiles > 0 && files.length > this.maxFiles;
    const limitBySize = this.maxSize > 0 && size > this.maxSize;

    if (limitByFilesCount || limitBySize)
      this.el.addFiles.classList.add("add-files--disabled");
    else this.el.addFiles.classList.remove("add-files--disabled");
  }

  updateInputText() {
    const { files } = this.el.nativeFileInput;
    const count = files.length;

    this.el.filesText.innerHTML =
      count > 0
        ? `${count} ${this.geFiletPron(count)}, ${this.getFileListSizePrettified(
            files
          )}`
        : this.startText;

    if (!this.el.filesText.classList.contains("files-text--has"))
      this.el.filesText.classList.add("files-text--has");
    if (count === 0) this.el.filesText.classList.remove("files-text--has");
  }

  geFiletPron(count) {
    if (count === 1) return "файл";
    if (count > 1 && count < 5) return "файла";
    if (count === 5) return "файлов";
  }

  addEventListenersToCloseButtons() {
    this.el.closes = this.shadowRoot.querySelectorAll(".files-list-item-close");

    Array.from(this.el.closes).map((close, index) =>
      close.addEventListener("click", (event) => {
        const newFileList = this.removeFileFromFileList(index);
        this.el.list.innerHTML = this.createFileList(newFileList);

        this.addEventListenersToCloseButtons();
        this.updateInputText();
        this.checkLimits();

        if (newFileList.length === 0) this.opened = false;
      })
    );
  }

  removeFileFromFileList(index) {
    const dt = new DataTransfer();

    const { files } = this.el.nativeFileInput;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (index !== i) dt.items.add(file);
    }

    this.el.nativeFileInput.files = dt.files;

    return dt.files;
  }

  getFileListSizePrettified(files) {
    const prettifiedSize = (bytes, decimals = 0) => {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Б", "Кб", "Мб", "Гб", "Тб", "Пб", "Еб", "Зб", "Иб"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const sum = this.getFileListSize(files);

    return prettifiedSize(sum);
  }

  getFileListSize = (files) =>
    Array.from(files).reduce((sum, file) => sum + file.size, 0);

  createFileList(list) {
    let result = "";
    const items = Array.from(list).reduce((result, { name }, index) => {
      return (
        result +
        `
          <li class="files-list-item">
            <div class="files-list-item-text">
              ${name}
            </div>
            <div class="files-list-item-close">&times;</div>
          </li>
        `
      );
    }, result);

    return items;
  }

  get opened() {
    return this.getAttribute("opened") !== null;
  }

  set opened(value) {
    if (!!value) {
      this.setAttribute("opened", "");
    } else {
      this.removeAttribute("opened");
    }
  }

  get files() {
    return this.el.nativeFileInput.files;
  }

  get maxFiles() {
    return Number(this.getAttribute("max-files")) || 0;
  }

  get maxSize() {
    return Number(this.getAttribute("max-size")) || 0;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case "opened":
        const opened = newVal !== null;
        const content = this.shadowRoot.querySelector(".files-expand");
        const display = opened ? "block" : "none";
        content.style.display = display;
        this.shadowRoot.dispatchEvent(this.events[opened ? "open" : "close"]);
        break;
      case "max-files":
        this.checkLimits();
        break;
      case "max-size":
        this.checkLimits();
        break;
      default:
        break;
    }
  }

  static get observedAttributes() {
    return ["opened", "max-files", "max-size"];
  }
}

if (!customElements.get("test-file-browser")) {
  customElements.define("test-file-browser", TestFileBrowser);
}
