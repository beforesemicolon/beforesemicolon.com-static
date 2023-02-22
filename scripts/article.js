window.onload = () => {
  startDarkModeFunctionality(addDarkModeButton());
  activateMenu();
  setShareLinkBtn();
  updateURL();
  if (document.body.dataset.env && document.body.dataset.env === 'production') {
    setAdsense();
  }
};
function updateURL() {
  var article = document.querySelector('article');
  var title = article.dataset.title;
  var newURL = location.origin + "/blog/".concat(title);
  history.pushState({
    path: newURL
  }, document.title, newURL);
}
function setAdsense() {
  var titles = document.querySelectorAll('article h4, article h3');
  var ad = '<ins class="adsbygoogle"\n' + '     style="display:block; text-align:center;"\n' + '     data-ad-layout="in-article"\n' + '     data-ad-format="fluid"\n' + '     data-ad-client="ca-pub-5455847849143562"\n' + '     data-ad-slot="1793625917"></ins>';
  if (titles.length >= 3) {
    titles[2].insertAdjacentHTML('beforebegin', ad);
  } else if (titles.length === 1) {
    titles[0].insertAdjacentHTML('beforebegin', ad);
  } else if (titles.length) {
    titles[1].insertAdjacentHTML('beforebegin', ad);
  }
  var wrapper = document.querySelector('.main-wrapper');
  var observer = new MutationObserver(function () {
    wrapper.style.height = '';
  });
  observer.observe(wrapper, {
    attributes: true,
    attributeFilter: ['style']
  });
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {}
}
function setShareLinkBtn() {
  var shareLinkBtns = document.querySelectorAll('.share-btn[data-type="share-link"]');
  var metaURL = document.head.querySelector('meta[property="og:url"]');
  var url = metaURL.getAttribute('content');
  shareLinkBtns.forEach(btn => {
    var txt = btn.textContent;
    var timer;
    btn.addEventListener('click', () => {
      clearTimeout(timer);
      navigator.clipboard.writeText(url).then(() => {
        btn.textContent = 'link copied';
        timer = setTimeout(() => btn.textContent = txt, 1500);
      }).catch(() => {
        btn.textContent = 'copy failed';
        timer = setTimeout(() => btn.textContent = txt, 1500);
      });
    });
  });
}