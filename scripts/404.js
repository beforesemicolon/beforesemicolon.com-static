import { setupVideoPosts } from './video-posts-control.js';
window.onload = () => {
  addSearchField(setupVideoPosts);
  startDarkModeFunctionality(addDarkModeButton());
  activateMenu();
};