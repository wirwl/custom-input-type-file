export const testFileBrowserStyle = `
<style>
     *, *::before, *::after {
       box-sizing: border-box;
       margin: 0;
       padding: 0;
     }

     :host {
       display: inline-flex;
       user-select: none;       
     }

     :host(.blur-effect) {
       filter: blur(1px);
       backdrop-filter: blur(1px);      
     }

     .native-file-input {
       display: none;
     }

     .add-files {
       display: flex;
       justify-content: center;
       align-items: center;
       width: 40px;
       height: 40px;
       font-weight: 700;
       font-size: 25px;
       border: 2px solid black;
       border-radius: 5px;
       cursor: pointer;
       background: transparent;
     }

     .add-files--disabled {
       cursor: not-allowed;
       color: gray;
       border: 2px solid gray;       
     }

     .files {
       display: flex;
       position: relative;
       padding: 8px 10px;
       border: 2px solid black;
       border-radius: 5px;       
       margin-right: 10px;              
       height: 40px;
       width: 195px;
       font-weight: 600;      
     }

     .files-text {
      align-self: center;      
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: gray;
     }

     .files-text--has {
      color: black;
     }

     .files-expand {
       position: absolute;
       left: -2px;
       top: 36px;
       color: black;
       border: 2px solid black;
       width: calc(100% + 4px);
       border-top: none;
     }

     .files-list {
       list-style: none;
     }
     
     .files-list-item {
       padding: 8px 5px 8px 10px;
       white-space: nowrap;
       display: flex;
       justify-content: space-between;
       align-items: center;
       height: 29px;
     }

     .files-list-item-close {            
      color: red;
      font-size: 40px;
      font-weight: 400;            
      cursor: pointer;
     }

     .files-list-item:hover {
       background: #8080804F;
     }

     .files-list-item-text {
      max-width: 93%;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
     }     

     :host([opened]) .files {       
       border-bottom-left-radius: 0;
       border-bottom-right-radius: 0;
       border-bottom: none;
     }

     :host([opened]) .files-expand {       
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;      
    }

     :host([opened]) .files-text {
       color: green;
     }
   </style>
`;
