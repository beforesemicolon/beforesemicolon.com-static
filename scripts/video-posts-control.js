var htmlContent = videoId => "\n\t<div id=\"player\"></div>\n\t<div class=\"playing-options\">\n\t\t<a href=\"https://www.youtube.com/watch?v=".concat(videoId, "\" class=\"yt-link\" target=\"_blank\">Watch on Youtube Instead</a>\n\t\t<button class=\"close-btn\">close</button>\n\t</div>\n");
var getHeight = width => Math.round(width / 16 * 9);
var playState = {
  3: 'BUFFERING',
  5: 'CUED',
  0: 'ENDED',
  2: 'PAUSED',
  1: 'PLAYING',
  '-1': 'UNSTARTED'
};
function handleVideoPost(post, videoId, container) {
  var title = (post.querySelector('h3') || post.querySelector('h2')).textContent;
  doOnProductionOnly(() => gtag('event', 'video-clicked', {
    'event_category': 'video',
    'event_action': 'click',
    'event_label': title
  }));
  var {
    innerWidth
  } = window;
  var width = innerWidth > 640 ? 1280 : innerWidth > 480 ? 640 : innerWidth > 320 ? 480 : innerWidth > 120 ? 320 : 120;
  width = width >= innerWidth - 50 ? innerWidth - 50 : width;
  var height = getHeight(width);
  var videoPlayer = document.createElement('div');
  videoPlayer.id = 'player-wrapper';
  videoPlayer.style = "width: ".concat(width, "px; height: ").concat(height, "px");
  videoPlayer.innerHTML = htmlContent(videoId);
  container.appendChild(videoPlayer);
  var ytLink = container.querySelector('.yt-link');
  if (ytLink) {
    ytLink.addEventListener('click', () => {
      doOnProductionOnly(() => gtag('event', 'video-clicked', {
        'event_category': 'video',
        'event_action': 'click',
        'event_label': 'watch on youtube - ' + title
      }));
    });
  }
  var player = new YT.Player('player', {
    width,
    height,
    videoId,
    playerVars: {
      modestbranding: 1,
      showinfo: 0
    },
    events: {
      'onReady': () => {},
      'onStateChange': () => {}
    }
  });
  var close = e => {
    if (e.target === container || e.currentTarget.className.includes('close-btn')) {
      player.stopVideo();
      container.style.display = 'none';
      videoPlayer.remove();
      window.removeEventListener('resize', close);
    }
  };
  container.querySelector('.close-btn').addEventListener('click', close);
  window.addEventListener('resize', close);
}
var onVideoClick = e => {
  e.preventDefault();
  var post = e.currentTarget;
  var playerContainer = document.getElementById('player-container');
  playerContainer.style.display = 'block';
  handleVideoPost(post, post.dataset.videoId, playerContainer);
};
export function setupVideoPosts() {
  var videoPosts = document.querySelectorAll('[data-video-id]');
  videoPosts.forEach(post => {
    post.removeEventListener('click', onVideoClick);
    post.addEventListener('click', onVideoClick);
  });
}
export function setupVideoPlayer() {
  var scriptTag = document.createElement('script');
  scriptTag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(scriptTag);
  var playerContainer = document.createElement('div');
  playerContainer.id = 'player-container';
  playerContainer.innerHTML = "\n\t\t<div class=\"ad-wrapper\"\n\t\t\tstyle=\"\n\t\t\t\tposition: absolute; top: 5px; left: 50%; z-index: 1;\n\t\t\t\ttransform: translateX(-50%);\n\t\t\t\tmax-width: 1280px; width: 100%;\n\t\t\t\tdisplay: flex; justify-content: center;\">\n\t\t\t<ins class=\"adsbygoogle\"\n\t     style=\"display:inline-block;width:1200px;height:100px\"\n\t     data-ad-client=\"ca-pub-5455847849143562\"\n\t     data-ad-slot=\"1187121250\"></ins>\n\t\t</div>\n\t";
  document.body.append(playerContainer);
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {}
}