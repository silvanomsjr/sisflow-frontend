// changing this css vars reflects throughout the theme
const DYNAMIC_CSS_VARS = [
  { 'label': '--color-black1', 'value': 'rgb(0,0,0)' },
  { 'label': '--color-black2', 'value': 'rgb(54,52,52)' }, 
  { 'label': '--color-black-placeholder', 'value': 'rgba(0,0,0,0.8)' }, 
  { 'label': '--color-darkblue1', 'value': 'rgb(28,34,86)' }, 
  { 'label': '--color-darkblue2', 'value': 'rgb(39,46,112)' }, 
  { 'label': '--color-gray1', 'value': 'rgb(242,241,241)' }, 
  { 'label': '--color-gray2', 'value': 'rgb(203,203,203)' }, 
  { 'label': '--color-gray3', 'value': 'rgb(167,167,167)' }, 
  { 'label': '--color-lightblue', 'value': 'rgb(33,150,243)' }, 
  { 'label': '--color-white', 'value': 'rgb(255,255,255)' }, 
  { 'label': '--font-size-normal', 'value': '16px' },
  { 'label': '--font-size-title', 'value': '20px' }
]

// must refactor and remove this vars
const COLOR_BLACK1 = "rgb(0,0,0)";
const COLOR_BLACK2 = "rgb(54,52,52)";
const COLOR_DARKBLUE1 = "rgb(28,34,86)";
const COLOR_DARKBLUE2 = "rgb(39,46,112)";
const COLOR_GRAY1 = "rgb(242, 241, 241)";
const COLOR_GRAY2 = "rgb(203,203,203)";
const COLOR_GRAY3 = "rgb(167,167,167)";
const COLOR_LIGHTBLUE = "rgb(33,150,243)";
const COLOR_WHITE = "rgb(255,255,255)";

// text font sizes, normal screens
const TEXT_PAGE_TITLE = "22px";
const TEXT_TITLE = "20px";
const TEXT_NORMAL = "16px";
const TEXT_SMALL = "14px";

// text font sizes, small screens
const SMTEXT_PAGE_TITLE = "23px";
const SMTEXT_TITLE = "20px";
const SMTEXT_NORMAL = "18px";
const SMTEXT_SMALL = "16px";

// interval normal screens to small, used in responsivity
const SM_VIEWPORT_SIZE = 900;

export default {
  DYNAMIC_CSS_VARS,
  COLOR_BLACK1,
  COLOR_BLACK2,
  COLOR_DARKBLUE1,
  COLOR_DARKBLUE2,
  COLOR_GRAY1,
  COLOR_GRAY2,
  COLOR_GRAY3,
  COLOR_LIGHTBLUE,
  COLOR_WHITE,
  TEXT_PAGE_TITLE,
  SMTEXT_PAGE_TITLE,
  TEXT_TITLE,
  SMTEXT_TITLE,
  TEXT_NORMAL,
  SMTEXT_NORMAL,
  TEXT_SMALL,
  SMTEXT_SMALL,
  SM_VIEWPORT_SIZE
};