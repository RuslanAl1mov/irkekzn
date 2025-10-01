import style from "./AppContentSection.module.css";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";

// Контексты
import { useAside } from "context/AsideContext";

interface AppContentSectionProps {
  children: ReactNode;
}

const AppContentSection: React.FC<AppContentSectionProps> = ({ children }) => {
  const { openAside } = useAside();
  const location = useLocation();

  const [isHidden, setIsHidden] = useState(false);
  const [currentChildren, setCurrentChildren] = useState<ReactNode>(children);
  const prevPathRef = useRef(location.pathname); // Сохраняет предыдущий путь

  // Обработчик окончания перехода (transitionend)
  const handleTransitionEnd = () => {
    if (isHidden) {
      // После завершения анимации исчезновения обновляем контент и запускаем анимацию появления
      setCurrentChildren(children);
      setIsHidden(true);
      prevPathRef.current = location.pathname;
    }
  };

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      // Если маршрут изменился, запускаем анимацию исчезновения
      setIsHidden(false);
    }
  }, [location.pathname]);

  return (
    <section
      className={cn(style.ContentSection, openAside && style.ContentSection__Small, isHidden && style.ContentSection__Hide)}
      onTransitionEnd={handleTransitionEnd}
    >
      {currentChildren}
    </section>
  );
};

export default AppContentSection;
