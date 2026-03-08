import cn from "classnames";
import { type CSSProperties, useRef, useState } from "react";
import { toast } from "react-toastify";

import CopyIcon from "@/assets/icons/copy.svg?react";
import UserImage from "@/assets/app/user.jpg";
import { useI18n } from "@/shared/lib/i18n/hooks";
import { useClickOutside } from "@/shared/lib/react";

import cls from "./VirtualCell.module.css";

type SourceGalleryItem = {
  id: number;
  name?: string | null;
  icon?: string | null;
};

type CellFunctionProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: () => void;
};

type VirtualCellProps = {
  title?: string;
  secTitle?: string | null | undefined;
  img?: string | null;
  sourcesGalery?: SourceGalleryItem[];
  extraNum?: number;
  align?: "start" | "center" | "end";
  status?: "active" | "archived" | "negative";
  isCopible?: boolean;
  coloredBlockStyle?: CSSProperties;
  textColor?: string;
  functions?: CellFunctionProps[];
};

export const VirtualCell = ({
  title,
  secTitle,
  img,
  sourcesGalery,
  extraNum,
  align = "start",
  status,
  isCopible,
  coloredBlockStyle,
  textColor,
  functions,
}: VirtualCellProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpenCopyMenu, setIsOpenCopyMenu] = useState(false);
  const { t } = useI18n();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = UserImage;
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Скопировано в буфер обмена", {
            toastId: `copy-clipboard-message-${title}-${secTitle}`,
          });
          setIsOpenCopyMenu(false);
        })
        .catch(() => { });
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  useClickOutside(rootRef, () => setIsOpenCopyMenu(false), { capture: true });

  return (
    <div
      ref={rootRef}
      className={cls.wrapper}
      style={{ justifyContent: align }}
    >
      {functions && functions.length && (
        <div className={cls.wrapper} style={{ justifyContent: align }}>
          {functions &&
            functions.map((funct, i) => {
              const FunctionIcon = funct.icon;
              return (
                <div
                  key={i}
                  className={cls.functionBlock}
                  onClick={(e) => {
                    e.stopPropagation();
                    funct.onClick();
                  }}
                  title={funct.title}
                >
                  <FunctionIcon className={cls.functionIcon} />
                </div>
              );
            })}
        </div>
      )}

      {isCopible && (title || secTitle) && (
        <button
          className={cn(cls.copyBtn, isOpenCopyMenu && cls.copyBtn_Active)}
          type="button"
          aria-label={t("table.cell.copy")}
          aria-haspopup="menu"
          onClick={(e) => {
            e.stopPropagation();
            if (title && secTitle) {
              setIsOpenCopyMenu((v) => !v);
            } else if (title) {
              handleCopy(title);
            } else if (secTitle) {
              handleCopy(secTitle);
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <CopyIcon className={cls.copyIcon} />
        </button>
      )}

      {/* Круглешок статуса */}
      {status && (
        <div
          className={cn(
            cls.status,
            status === "active"
              ? cls.status__active
              : status === "archived"
                ? cls.status__archived
                : status === "negative"
                  ? cls.status__negative
                  : ""
          )}
        />
      )}

      {/* Галерея источников */}
      {sourcesGalery && sourcesGalery.length > 0 ? (
        <div className={cls.iconsGalery}>
          {sourcesGalery.map((source) => {
            return (
              <img
                key={source.id}
                title={source.name ?? undefined}
                className={cls.iconsGaleryIcon}
                src={source.icon || ""}
                alt={source.name ?? undefined}
              />
            );
          })}
        </div>
      ) : null}

      {/* Кргулешок с цифоркой или буквой */}
      {extraNum != undefined &&
        (() => {
          if (extraNum > 0)
            return <div className={cls.roundedNum}>+{extraNum}</div>;
          else if (extraNum == 0 && sourcesGalery && sourcesGalery.length == 0)
            return <>—</>;
        })()}

      {/* Круглая картинка */}
      {img && <img className={cls.img} src={img} onError={handleImageError} />}

      {/* Заголовок и подзаголовок */}
      {(title || secTitle) && (
        <div className={cls.titlesBlock} style={coloredBlockStyle}>
          {title && (
            <div
              className={cn(cls.title, isOpenCopyMenu && cls.copyTitleMenyBtn)}
              style={{ textAlign: align, color: textColor }}
              title={title}
              onClick={(e) => {
                if (isOpenCopyMenu) {
                  e.stopPropagation();
                  handleCopy(title);
                }
              }}
              onMouseDown={(e) => {
                if (isOpenCopyMenu) e.stopPropagation();
              }}
            >
              {title}
            </div>
          )}
          {secTitle != null && secTitle != undefined && (
            <div
              className={cn(
                cls.secondaryTitle,
                isOpenCopyMenu && cls.copySecTitleMenyBtn
              )}
              title={secTitle}
              style={{ textAlign: align }}
              onClick={(e) => {
                if (isOpenCopyMenu) {
                  e.stopPropagation();
                  handleCopy(secTitle);
                }
              }}
              onMouseDown={(e) => {
                if (isOpenCopyMenu) e.stopPropagation();
              }}
            >
              {secTitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
