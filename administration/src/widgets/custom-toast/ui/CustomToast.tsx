import React from "react";
import type { ToastContentProps } from "react-toastify";
import cls from "./CustomToast.module.css";

const CIRC = 565.48; // 2πr при r=90

interface CustomToastData {
  message: string;
  title?: string;
  body?: string;
  barColor: string;
  trackColor: string;
  size: number;
  barWidth: number;
  trackWidth: number;
}

// Кастомный Toastify
export const CustomToast: React.FC<ToastContentProps<CustomToastData>> = ({
  closeToast,
  isPaused,
  toastProps,
  data,
}) => {
  const attributes: React.SVGProps<SVGCircleElement> = {};

  if (typeof toastProps.progress === "number") {
    // Контролируемый прогресс (через toast.update)
    attributes.style = {
      transition: "all .1s linear",
      strokeDashoffset: `${CIRC - CIRC * toastProps.progress}px`,
    };
    attributes.onTransitionEnd = () => {
      if (typeof toastProps.progress === "number" && toastProps.progress >= 1) {
        closeToast?.();
      }
    };
  } else {
    // Авто-анимация по таймеру
    const autoCloseDuration =
      toastProps.autoClose === false ? 5000 : (toastProps.autoClose ?? 5000);
    attributes.className = cls.toastAnimate; // Создайте этот класс в CSS
    attributes.style = {
      animationDuration: `${autoCloseDuration}ms`,
      animationPlayState: isPaused ? "paused" : "running",
      strokeDashoffset: `${CIRC}px`, // Начальное значение для анимации
    };
    attributes.onAnimationEnd = () => closeToast?.();
  }

  const message = data?.message ?? "";
  const title = data?.title;
  const barColor = data?.barColor;
  const size = data?.size || 40;
  const barWidth = data?.barWidth || 22;
  const trackColor = data?.trackColor;

  return (
    <div
      className={cls.container}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: "12px",
      }}
    >
      <div className={cls.textBox}>
        {title && (
          <div
            className={cls.title}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {message && (
          <div
            className={cls.text}
            style={{ margin: 0 }}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
      </div>

      {/* Круговой лоадер */}
      <div className={cls.loaderContainer} style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Трек (фон) */}
          <circle
            r="90"
            cx="100"
            cy="100"
            fill="transparent"
            stroke={trackColor}
            strokeWidth={0}
            strokeDasharray={`${CIRC}px`}
            strokeDashoffset="0"
          />
          {/* Прогресс-бар */}
          <circle
            r="90"
            cx="100"
            cy="100"
            fill="transparent"
            stroke={barColor}
            strokeWidth={barWidth}
            strokeLinecap="round"
            strokeDasharray={`${CIRC}px`}
            strokeDashoffset={CIRC}
            {...attributes}
          />
        </svg>
      </div>
    </div>
  );
};