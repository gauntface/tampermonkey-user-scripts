// ==UserScript==
// @name         GitHub PR Draft Only
// @namespace    https:///www.gaunt.dev
// @version      0.1
// @description  Only show a draft PR button
// @author       Matt Gaunt-Seo
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const PROCESSED_CLASS = 'gaunt_dev_processed';
  let convertStringToHTML = function (str) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(str, 'text/html');
      return doc.body.firstChild;
  };

  new MutationObserver((_, observer) => {
      console.log('Hi Matt');
      const initialGroupedButtons = document.querySelector('.BtnGroup:has([name="draft"], [name="gist[public]"])');
      if (!initialGroupedButtons || initialGroupedButtons.classList.contains(PROCESSED_CLASS)) {
          return false;
      }

      initialGroupedButtons.classList.add(PROCESSED_CLASS);

      const newBtns = [];
      for (const dropdownItem of initialGroupedButtons.querySelectorAll('.select-menu-item')) {
          let title = dropdownItem.querySelector('.select-menu-item-heading').textContent.trim();
          const description = dropdownItem.querySelector('.description').textContent.trim();
          const radioButton = dropdownItem.querySelector('input[type=radio]');
          const classList = ['btn', 'ml-2', 'tooltipped', 'tooltipped-s'];

          if (/\bdraft\b/i.test(title)) {
              title = 'Create draft PR';
              classList.push('btn-primary');
          } else {
              continue;
          }

          const btn = convertStringToHTML(`<button
              data-disable-invalid
              class="${classList.join(' ')}"
              aria-label="${description}"
              type="submit"
              name="${radioButton.name}"
              value="${radioButton.value}"
          >
          ${title}
          </button>`
          );
          newBtns.push(btn);
      }

      while (initialGroupedButtons.firstChild) {
          initialGroupedButtons.removeChild(initialGroupedButtons.firstChild);
      }

      for (const b of newBtns) {
          initialGroupedButtons.append(b);
      }

  }).observe(document.documentElement, {childList: true, subtree: true});
})();