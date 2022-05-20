import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { scrollInfoArray } from './script/scrollInfo';

const setLayoutByInnerHeight = setLayout(document)(scrollInfoArray);

window.addEventListener(
  'resize',
  () => setLayoutByInnerHeight(window.innerHeight),
);

setLayoutByInnerHeight(window.innerHeight);
