/**
 * Возвращает координаты, необходимые для позиционирования элемента
 * (например, модального окна) точно по центру текущего viewport.
 *
 * @param {number} elemWidth  - ширина элемента (px)
 * @param {number} elemHeight - высота элемента (px)
 * @returns {{ x: number, y: number }} координаты для свойства `defaultPosition`
 *
 * Пример:
 *   const { x, y } = getCenterPosition(420, 280);
 *   <Draggable defaultPosition={{ x, y }} ... />
 */
export function getCenterPosition(elemWidth, elemHeight) {
  return {
    x: (window.innerWidth - elemWidth) / 2,
    y: (window.innerHeight - elemHeight) / 2,
  };
}