var maxPages = 4;
var currentPage = 0;
var onPageButtonClick = (index, btn, paginator, pagesCount, onPagination) => {
  if (index === pagesCount - 1) {
    paginator.querySelector('.next-page').setAttribute('disabled', '');
  } else if (index === pagesCount - maxPages - 1) {
    paginator.querySelector('.next-page').removeAttribute('disabled');
  }
  if (index === 0) {
    paginator.querySelector('.prev-page').setAttribute('disabled', '');
  } else if (index > maxPages - 1) {
    paginator.querySelector('.prev-page').removeAttribute('disabled');
  }
  currentPage = Number(index);
  var activeBtn = paginator.querySelector('.active');
  if (btn.className.includes('next-page')) {
    if (activeBtn.nextElementSibling !== btn) {
      activeBtn.classList.remove('active');
      activeBtn.nextElementSibling.classList.add('active');
    } else {
      activeBtn.textContent = Number(activeBtn.textContent) + 1;
      activeBtn.dataset.index = Number(activeBtn.dataset.index) + 1;
      btn = activeBtn.previousElementSibling;
      while (btn && !btn.className.includes('prev-page')) {
        btn.textContent = Number(btn.textContent) + 1;
        btn.dataset.index = Number(btn.dataset.index) + 1;
        btn = btn.previousElementSibling;
      }
    }
  } else if (btn.className.includes('prev-page')) {
    if (activeBtn.previousElementSibling !== btn) {
      activeBtn.classList.remove('active');
      activeBtn.previousElementSibling.classList.add('active');
    } else {
      activeBtn.textContent = Number(activeBtn.textContent) - 1;
      activeBtn.dataset.index = Number(activeBtn.dataset.index) - 1;
      btn = activeBtn.nextElementSibling;
      while (btn && !btn.className.includes('next-page')) {
        btn.textContent = Number(btn.textContent) - 1;
        btn.dataset.index = Number(btn.dataset.index) - 1;
        btn = btn.nextElementSibling;
      }
    }
  } else {
    activeBtn.classList.remove('active');
    btn.classList.add('active');
  }
  onPagination(index);
};
function setupPaginator(paginator, pagesCount, startingPage, onPagination) {
  currentPage = startingPage;
  maxPages = Math.min(maxPages, pagesCount);
  var startingIdx = startingPage <= maxPages - 1 ? 0 : startingPage - (maxPages - 1);
  if (pagesCount > maxPages) {
    paginator.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"prev-page icon arrow-icon\" ".concat(startingPage < maxPages ? "disabled" : "", "><span>prev</span></button>"));
    paginator.children[0].addEventListener('click', e => onPageButtonClick(currentPage - 1, e.target, paginator, pagesCount, onPagination));
  }
  for (var i = startingIdx; i < startingIdx + maxPages; i++) {
    paginator.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"".concat(i === currentPage ? 'active' : '', " page-btn\" data-index=\"").concat(i, "\">").concat(i + 1, "</button>"));
    paginator.children[paginator.children.length - 1].addEventListener('click', e => onPageButtonClick(e.target.dataset.index, e.target, paginator, pagesCount, onPagination));
  }
  if (pagesCount > maxPages) {
    paginator.insertAdjacentHTML('beforeend', "<button type=\"button\" class=\"next-page icon arrow-icon\" ".concat(startingPage === pagesCount - 1 ? "disabled" : "", "><span>next</span></button>"));
    paginator.children[paginator.children.length - 1].addEventListener('click', e => onPageButtonClick(currentPage + 1, e.target, paginator, pagesCount, onPagination));
  }
}
export function getPaginator(pagesCount, startingPage, onPagination) {
  var paginator = document.createElement('div');
  paginator.className = 'paginator';
  setupPaginator(paginator, pagesCount, startingPage, onPagination);
  return {
    paginator,
    resetPaginator: startingPage => {
      paginator.innerHTML = '';
      setupPaginator(paginator, pagesCount, startingPage, onPagination);
    }
  };
}
export function getUrlPageIndex() {
  var currentPageIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  if (location.search) {
    var match = location.search.match(/pageIndex=(\d)+/, 'g');
    if (match && match[1] && Number(match[1]) !== currentPageIndex) {
      return Number(match[1]);
    }
  }
  return 0;
}
export function setUrlPageIndex(index) {
  var newURL = location.origin + location.pathname + "?pageIndex=".concat(index);
  history.pushState({
    path: newURL
  }, document.title, newURL);
}