export default function centerHorizontally(element: HTMLElement | null): void {
  if (!element) return;

  const windowWidth = document.documentElement.clientWidth;
  const elementWidth = element.offsetWidth;

  element.style.left = `${(windowWidth - elementWidth) / 2}px`;
  element.style.right = "auto";
}
