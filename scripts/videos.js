import { setupVideoPlayer, setupVideoPosts } from './video-posts-control.js';
import { getPaginator, getUrlPageIndex, setUrlPageIndex } from './paginator.js';
window.onload = () => {
  addSearchField(setupVideoPosts);
  startDarkModeFunctionality(addDarkModeButton());
  activateMenu();
  setupVideoPlayer();
  setupVideoPosts();
  loadData('videos').then(videos => {
    videos.shift();
    var videosContainer = document.querySelector('.video-section');
    var perPage = Number(videosContainer.dataset.videoLimit);
    var pagedVideos = [];
    var currentPageIndex = getUrlPageIndex();
    for (var i = 0; i < videos.length; i += perPage) {
      pagedVideos.push(videos.slice(i, i + perPage));
    }
    if (currentPageIndex !== 0) {
      loadPageVideos(pagedVideos[currentPageIndex], videosContainer);
    }
    var {
      paginator,
      resetPaginator
    } = getPaginator(pagedVideos.length, currentPageIndex, index => {
      if (currentPageIndex !== index) {
        setUrlPageIndex(index);
        loadPageVideos(pagedVideos[index], videosContainer);
      }
      currentPageIndex = index;
    });
    window.addEventListener('popstate', () => {
      if (!location.search) {
        currentPageIndex = 0;
      } else {
        currentPageIndex = getUrlPageIndex(currentPageIndex);
      }
      loadPageVideos(pagedVideos[currentPageIndex], videosContainer);
      resetPaginator(currentPageIndex);
    });
    videosContainer.querySelector('.more-btn').remove();
    videosContainer.appendChild(paginator);
  });
};
function loadPageVideos(videos, container) {
  container.querySelectorAll('.video-post').forEach(post => post.remove());
  var content = '';
  videos.forEach(video => {
    content += "\n\t\t<a href=\"".concat(video.url, "\" class=\"video-post\" data-video-id=\"").concat(video.id, "\" rel=\"noopener\">\n\t\t    <div class=\"post-thumbnail\">\n\t\t        <img src=\"").concat(video.thumbnails.standard.url, "\" alt=\"").concat(video.title, "\">\n\t\t    </div>\n\t\t    <div class=\"post-details\">\n\t\t        <p class=\"post-playlists\"><b>").concat(video.playlists.join(', '), "</b></p>\n\t\t        <h3>").concat(video.title, "</h3>\n\t\t        <p class=\"post-description\">").concat(video.description, "</p>\n\t\t    </div>\n\t\t</a>\n\t\t");
  });
  var latestVideos = container.querySelector('.latest-video');
  latestVideos.insertAdjacentHTML('afterend', content);
  setupVideoPosts();
  latestVideos.nextElementSibling.scrollIntoView({
    block: 'start',
    behavior: 'smooth'
  });
}