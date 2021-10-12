export function isExtensionPopup(): boolean {
  return !new URLSearchParams(window.location.search).has('action');
}
