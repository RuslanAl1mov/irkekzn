export const setupSmoothScroll = () => {
  // Ищем все ссылки, начинающиеся на '#'
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const hrefValue = this.getAttribute('href');
      
      // Если это просто "#", не блокируем поведение ссылки
      if (!hrefValue || hrefValue === '#') {
        return;
      }

      // Иначе пробуем плавно скроллить
      e.preventDefault();
      try {
        const target = document.querySelector(hrefValue);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      } catch (error) {
        console.warn(
          `Невозможно проскроллить до '${hrefValue}': некорректный селектор.`,
          error
        );
      }
    });
  });
};
