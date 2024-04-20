// We are forcing the app view to a mobile size of 425x800.
//
// If changing the size, make sure to also change the corresponding values in the following files:
// - Breakpoints.js (this file)
// - public/app.css
// - App.scss
//
// For this change, unused breakpoints are set to `INFINITE_BREAKPOINT`, which invalidates them.
// This is because we did not want to remove all unused app breakpoints, in case we would like to
// return to a normal desktop view in the future.

export const MAX_WIDTH_BREAKPOINT = 425;
export const MAX_HEIGHT_BREAKPOINT = 800;
export const INFINITE_BREAKPOINT = 99999;

export const BREAKPOINTS = {
    DESKTOP_HEIGHT: `@media(min-height: ${MAX_HEIGHT_BREAKPOINT}px)`,
    MOBILE: `@media(max-width: ${INFINITE_BREAKPOINT}px)`,
    DESKTOP_SMALL: `@media(min-width: ${INFINITE_BREAKPOINT}px)`,
    DESKTOP_MEDIUM: `@media(min-width:  ${INFINITE_BREAKPOINT}px)`,
    // Panels in fluent switch to an overlay at 480 and have a width of 340px,
    // so size to panel if less than 480
    PANEL_OVERRIDE: `@media(min-width: ${INFINITE_BREAKPOINT}px)`,
    SEARCH_OVERRIDE: '@media(max-width: 600px)',
    // The keyboard opening in Android will bring the height below 400px
    ANDROID_KEYBOARD_OVERRIDE: '@media(min-height: 400px)',
};
