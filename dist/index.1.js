(()=>{"use strict";class e extends HTMLElement{constructor(){super(),this.init(),this.addEventListeners()}init(){this.events={close:new CustomEvent("test-file-browser.changed",{bubbles:!0,detail:{opened:!1}}),open:new CustomEvent("test-file-browser.changed",{bubbles:!0,detail:{opened:!0}})},this.startText=this.innerHTML||"Выберите файл",this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`\n    <div class="files">\n    <span class="files-text">${this.startText}</span>\n    <div class="files-expand" style="display: none">\n    <ul class="files-list"></ul>\n    </div>      \n  </div> \n\n     <label class="test">\n       <input multiple class="native-file-input" type="file">\n       <button class="add-files">+</button>\n     </label>\n \n     \n<style>\n     *, *::before, *::after {\n       box-sizing: border-box;\n       margin: 0;\n       padding: 0;\n     }\n\n     :host {\n       display: inline-flex;       \n     }\n\n     :host(.blur-effect) {\n       filter: blur(1px);\n       backdrop-filter: blur(1px);      \n     }\n\n     .native-file-input {\n       display: none;\n     }\n\n     .add-files {\n       display: flex;\n       justify-content: center;\n       align-items: center;\n       width: 40px;\n       height: 40px;\n       font-weight: 700;\n       font-size: 25px;\n       border: 2px solid black;\n       border-radius: 5px;\n       cursor: pointer;\n       background: transparent;\n     }\n\n     .add-files--disabled {\n       cursor: not-allowed;\n       color: gray;\n       border: 2px solid gray;       \n     }\n\n     .files {\n       display: flex;\n       position: relative;\n       padding: 8px 10px;\n       border: 2px solid black;\n       border-radius: 5px;       \n       margin-right: 10px;              \n       height: 40px;\n       width: 195px;\n       font-weight: 600;    \n       user-select: none;\n     }\n\n     .files-text {\n      align-self: center;      \n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      color: gray;\n     }\n\n     .files-text--has {\n      color: black;\n     }\n\n     .files-expand {\n       position: absolute;\n       left: -2px;\n       top: 36px;\n       color: black;\n       border: 2px solid black;\n       width: calc(100% + 4px);\n       border-top: none;\n     }\n\n     .files-list {\n       list-style: none;\n     }\n     \n     .files-list-item {\n       padding: 8px 5px 8px 10px;\n       white-space: nowrap;\n       display: flex;\n       justify-content: space-between;\n       align-items: center;\n       height: 29px;\n     }\n\n     .files-list-item-close {            \n      color: red;\n      font-size: 40px;\n      font-weight: 400;            \n      cursor: pointer;\n     }\n\n     .files-list-item:hover {\n       background: #8080804F;\n     }\n\n     .files-list-item-text {\n      max-width: 93%;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      cursor: default;\n     }     \n\n     :host([opened]) .files {       \n       border-bottom-left-radius: 0;\n       border-bottom-right-radius: 0;\n       border-bottom: none;\n     }\n\n     :host([opened]) .files-expand {       \n      border-bottom-left-radius: 5px;\n      border-bottom-right-radius: 5px;      \n    }\n\n     :host([opened]) .files-text {\n       color: green;\n     }\n   </style>\n  \n    `,this.el={nativeFileInput:this.shadowRoot.querySelector(".native-file-input"),addFiles:this.shadowRoot.querySelector(".add-files"),files:this.shadowRoot.querySelector(".files"),filesText:this.shadowRoot.querySelector(".files-text"),list:this.shadowRoot.querySelector(".files-list"),closes:this.shadowRoot.querySelectorAll(".files-list-item-close")}}addEventListeners(){document.addEventListener("click",(e=>{const t=e.composedPath().includes(this.el.list);this.opened&&!t&&(this.opened=!1)})),this.el.nativeFileInput.addEventListener("change",(()=>{const{files:e}=this.el.nativeFileInput;this.addFilesToInput(e)})),this.addEventListener("click",(e=>e.stopPropagation())),this.el.list.addEventListener("click",(e=>e.stopPropagation())),this.el.files.addEventListener("click",(e=>{this.el.nativeFileInput.files.length>0&&(this.opened=!this.opened)})),this.el.addFiles.addEventListener("click",(()=>{this.el.addFiles.classList.contains("add-files--disabled")||this.el.nativeFileInput.click()})),this.addEventListener("dragover",(e=>{e.preventDefault(),e.target.classList.add("blur-effect")})),this.addEventListener("dragleave",(e=>{e.target.classList.remove("blur-effect")})),this.addEventListener("drop",(e=>{const{files:t}=e.dataTransfer;this.el.nativeFileInput.files=t,console.log(t),this.addFilesToInput(t),e.preventDefault(),e.target.classList.remove("blur-effect")}))}addFilesToInput(e){this.el.list.innerHTML=this.createFileList(e),this.addEventListenersToCloseButtons(),this.updateInputText(),this.checkLimits(),0===e.length&&(this.opened=!1)}checkLimits(){const{files:e}=this.el.nativeFileInput,t=this.getFileListSize(e),s=this.maxFiles>0&&e.length>this.maxFiles,i=this.maxSize>0&&t>this.maxSize;s||i?this.el.addFiles.classList.add("add-files--disabled"):this.el.addFiles.classList.remove("add-files--disabled")}updateInputText(){const{files:e}=this.el.nativeFileInput,t=e.length;this.el.filesText.innerHTML=t>0?`${e.length} файлов, ${this.getFileListSizePrettified(e)}`:this.startText,this.el.filesText.classList.contains("files-text--has")||this.el.filesText.classList.add("files-text--has"),0===t&&this.el.filesText.classList.remove("files-text--has")}addEventListenersToCloseButtons(){this.el.closes=this.shadowRoot.querySelectorAll(".files-list-item-close"),Array.from(this.el.closes).map(((e,t)=>e.addEventListener("click",(e=>{const s=this.removeFileFromFileList(t);this.el.list.innerHTML=this.createFileList(s),this.addEventListenersToCloseButtons(),this.updateInputText(),this.checkLimits(),0===s.length&&(this.opened=!1)}))))}removeFileFromFileList(e){const t=new DataTransfer,{files:s}=this.el.nativeFileInput;for(let i=0;i<s.length;i++){const n=s[i];e!==i&&t.items.add(n)}return this.el.nativeFileInput.files=t.files,t.files}getFileListSizePrettified(e){return((e,t=0)=>{if(!+e)return"0 Bytes";const s=t<0?0:t,i=Math.floor(Math.log(e)/Math.log(1024));return`${parseFloat((e/Math.pow(1024,i)).toFixed(s))} ${["Б","Кб","Мб","Гб","Тб","Пб","Еб","Зб","Иб"][i]}`})(this.getFileListSize(e))}getFileListSize=e=>Array.from(e).reduce(((e,t)=>e+t.size),0);createFileList(e){return Array.from(e).reduce(((e,{name:t},s)=>e+`\n          <li class="files-list-item">\n            <div class="files-list-item-text">\n              ${t}\n            </div>\n            <div class="files-list-item-close">&times;</div>\n          </li>\n        `),"")}get opened(){return null!==this.getAttribute("opened")}set opened(e){e?this.setAttribute("opened",""):this.removeAttribute("opened")}get files(){return this.el.nativeFileInput.files}get maxFiles(){return Number(this.getAttribute("max-files"))||0}get maxSize(){return Number(this.getAttribute("max-size"))||0}attributeChangedCallback(e,t,s){switch(e){case"opened":const e=null!==s,t=e?"block":"none";this.shadowRoot.querySelector(".files-expand").style.display=t,this.shadowRoot.dispatchEvent(this.events[e?"open":"close"]);break;case"max-files":case"max-size":this.checkLimits()}}static get observedAttributes(){return["opened","max-files","max-size"]}}customElements.get("test-file-browser")||customElements.define("test-file-browser",e),document.querySelector(".verify").addEventListener("click",(()=>{const e=document.querySelector("test-file-browser").files;console.log(e),document.querySelector(".count").innerHTML=`Кол-во: ${e.length}`})),document.querySelector(".max-files").addEventListener("click",(()=>{document.querySelector("test-file-browser").setAttribute("max-files",5)})),document.querySelector(".max-size").addEventListener("click",(()=>{document.querySelector("test-file-browser").setAttribute("max-size",41457206)}))})();