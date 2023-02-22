import { setupVideoPlayer, setupVideoPosts } from './video-posts-control.js';
window.onload = () => {
  addSearchField(setupVideoPosts);
  startDarkModeFunctionality(addDarkModeButton());
  activateMenu();
  setupVideoPlayer();
  setupVideoPosts();
};