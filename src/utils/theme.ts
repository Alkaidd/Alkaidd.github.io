export function changeCssVar(isMobile: boolean) {
  if (isMobile) {
    document.documentElement.style.setProperty('--nav-width', '60px')
  } else {
    document.documentElement.style.setProperty('--nav-width', '300px')
  }
}
