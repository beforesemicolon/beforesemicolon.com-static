function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var env = document.body.dataset.env;
function doOnProductionOnly(cb) {
  if (env !== 'development') {
    cb();
  }
}
function addDarkModeButton() {
  var controlBar = document.querySelector('.control-bar');
  if (controlBar) {
    controlBar.insertAdjacentHTML('beforeend', '<button type="button" class="dark-light-btn icon dark-mode-icon" aria-label="dark mode toggle"><span>Dark Mode</span></button>');
    var darkModeBtn = controlBar.querySelector('.dark-light-btn');
    if (localStorage.getItem('color-mode') === 'light') {
      darkModeBtn.classList.add('inactive');
    }
    return darkModeBtn;
  }
  return null;
}
var searchContent = function searchContent() {
  var term = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return Promise.all([loadData('videos'), loadData('articles')]).then(items => items.flat().filter(item => {
    var str = "".concat(item.title, " ").concat(item.description || '', " ").concat(item.intro || '', " ").concat(item.playlistName || '').toLowerCase();
    return str.search(term.toLowerCase()) >= 0;
  }));
};
var handlePositionSearchContainer = (searchContainer, _ref) => {
  var {
    top: headerTop,
    height: headerHeight
  } = _ref;
  if (window.innerWidth <= 650) {
    var {
      left
    } = searchContainer.getBoundingClientRect();
    var {
      top
    } = searchContainer.parentNode.getBoundingClientRect();
    if (top <= headerTop + headerHeight) {
      requestAnimationFrame(() => {
        searchContainer.classList.add('sticky');
        searchContainer.style.position = 'fixed';
        searchContainer.style.top = headerTop + headerHeight + 'px';
        searchContainer.style.left = left + 'px';
        searchContainer.style.width = "calc(100% - ".concat(left * 2, "px)");
        searchContainer.style.zIndex = '1000';
      });
    } else if (searchContainer.className.includes('sticky')) {
      searchContainer.classList.remove('sticky');
      searchContainer.removeAttribute('style');
    }
  } else if (searchContainer.className.includes('sticky')) {
    searchContainer.classList.add('sticky');
    searchContainer.removeAttribute('style');
  }
};
var createSearchResultItem = item => {
  return "\n\t\t<a class=\"search-result\" href=\"".concat(item.url, "\" ").concat(item.channelId ? "data-video-id=\"".concat(item.id, "\"") : '', " rel=\"noopener\">\n\t\t\t<div class=\"thumbnail-wrapper\">\n\t\t\t\t\t<div class=\"post-thumbnail\">\n\t\t\t        <img src=\"").concat(item.thumbnail || item.thumbnails.medium.url, "\" alt=\"").concat(item.title, "\">\n\t\t\t    </div>\n\t\t\t</div>\n\t\t\t<div class=\"post-details\">\n\t\t\t\t\t<h3>").concat(item.title, "</h3>\n\t\t\t\t\t<p>").concat(item.intro || item.description, "</p>\n\t\t\t</div>\n\t\t</a>\n\t");
};
var handleSearchInput = (wrapper, setupVideos) => {
  var searchResultsContainer = document.createElement('div');
  searchResultsContainer.id = 'search-results';
  var block = wrapper.querySelector('section') || wrapper.querySelector('article');
  var visible = false;
  var attachResultsContainer = () => {
    document.querySelector('main').addEventListener('scroll', attachResultsContainer, {
      passive: true
    });
    window.addEventListener('resize', attachResultsContainer);
  };
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (e) {
      var {
        value
      } = e.target;
      if (value.length >= 3) {
        searchResultsContainer.innerHTML = "<h2>Search Results for \"".concat(value, "\"</h2><p class=\"search-desc\">Searching...</p>");
        if (!visible) {
          block.insertAdjacentElement('beforebegin', searchResultsContainer);
          visible = true;
          attachResultsContainer();
          block.style.display = 'none';
        }
        searchContent(value).then(results => {
          if (results.length) {
            searchResultsContainer.innerHTML = "<h2>Search Results for \"".concat(value, "\"</h2>\n\t\t\t\t\t\t\t\t").concat(results.map(createSearchResultItem).join(''), "\n\t\t\t\t\t\t");
            setupVideos();
          } else {
            searchResultsContainer.innerHTML = "<h2>Search Results for \"".concat(value, "\"</h2><p class=\"search-desc\">Nothing Found!</p>");
          }
          doOnProductionOnly(() => gtag('event', 'search-performed', {
            'event_category': 'search',
            'event_action': 'input',
            'event_label': "search: ".concat(value)
          }));
        }).catch(() => {
          searchResultsContainer.innerHTML = "<h2>Search Results for \"".concat(value, "\"</h2><p class=\"search-desc\">Nothing Found!</p>");
        });
      } else if (visible) {
        visible = false;
        searchResultsContainer.remove();
        block.removeAttribute('style');
      }
    });
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
};
function addSearchField(videoSetup) {
  var searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
    var header = document.querySelector('header');
    var aside = document.querySelector('aside');
    var wrapper = document.querySelector('.content-wrapper');
    searchContainer.insertAdjacentHTML('afterbegin', '<label class="search-widget side-widget icon search-icon" aria-label="search">' + '<input type="search" placeholder="Search..." required>' + '<button type="button" class="clear-btn icon close-icon"><span>x</span></button>' + '</label>');
    if (aside) {
      aside.style.paddingTop = '150px';
    }
    var handlePositioning = () => handlePositionSearchContainer(searchContainer, header.getBoundingClientRect());
    var scrollContainerToView = () => wrapper.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
    handlePositioning();
    searchContainer.querySelector('.clear-btn').addEventListener('click', e => {
      e.target.previousElementSibling.value = '';
      var searchResults = document.getElementById('search-results');
      searchResults.nextElementSibling.removeAttribute('style');
      searchResults.remove();
      scrollContainerToView();
    });
    document.querySelector('main').addEventListener('scroll', handlePositioning, {
      passive: true
    });
    window.addEventListener('resize', handlePositioning);
    var input = searchContainer.querySelector('input');
    input.addEventListener('input', handleSearchInput(wrapper, videoSetup));
    input.addEventListener('focus', scrollContainerToView);
    return searchContainer.querySelector('.search-widget');
  }
  return null;
}
function startDarkModeFunctionality(toggle) {
  if (toggle) {
    var html = document.querySelector('html');
    toggle.addEventListener('click', () => {
      var newColorMode = html.getAttribute('color-mode') === 'light' ? 'dark' : 'light';
      html.setAttribute('color-mode', newColorMode);
      toggle.classList.toggle('inactive');
      localStorage.setItem('color-mode', newColorMode);
    });
  }
}
function activateMenu() {
  var nav = document.querySelector('nav');
  if (nav) {
    nav.addEventListener('click', e => {
      if (window.innerWidth <= 1024 && e.target === nav) {
        nav.classList.toggle('active');
        if (!nav.className.includes('active')) {
          nav.blur();
        }
      }
    });
    document.body.addEventListener('click', e => {
      if (!nav.contains(e.target) && nav.className.includes('active')) {
        nav.classList.remove('active');
      }
    });
  }
}
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
function loadData(type) {
  return fetch("/api/".concat(type)).then(res => res.json());
}