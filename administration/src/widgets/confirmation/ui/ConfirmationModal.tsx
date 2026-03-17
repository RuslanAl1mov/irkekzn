import { useEffect, useRef } from "react";
import cn from "classnames";
import cls from "./ConfirmationModal.module.css";
import { Title } from "@/widgets/title";
import { Button } from "@/shared/ui/button";
import { useConfirmationStore } from "../model/store";


export const ConfirmationModal = () => {
    const {
        isOpen,
        type,
        title,
        subTitle,
        confirmBtnTitle,
        closeBtnTitle,
        confirmBtnVariant,
        closeBtnVariant,
        hideConfirmBtn,
        hideCloseBtn,
        closeOnConfirm,
        children,
        onConfirm,
        onClose,
        close,
    } = useConfirmationStore();
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose?.();
                close();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [close, isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) {
            onClose?.();
            close();
        }
    };

    if (!isOpen) return null;

    const handleConfirmBtnClick = () => {
        onConfirm?.();

        if (closeOnConfirm) {
            close();
        }
    };

    const handleCloseBtnClick = () => {
        onClose?.();
        close();
    };

    return (
        <div
            ref={overlayRef}
            className={cls.overlay}
            onClick={handleOverlayClick}
        >
            <div className={cls.modal} role="dialog" aria-modal="true" aria-label={title}>
                <div className={cn(cls.header, cls[type])}>
                    <Title
                        title={title}
                        size="h3"
                        className={cls.titleBlock}
                        titleClassName={cls.title}
                        subTitleClassName={cls.subTitle}
                    />
                </div>

                <div className={cls.content}>
                    <p className={cls.subTitle}>
                        {subTitle}
                    </p>
                    {children}
                </div>

                <div className={cls.actions}>
                    {!hideCloseBtn && (
                        <Button type="button" variant={closeBtnVariant} onClick={handleCloseBtnClick}>
                            {closeBtnTitle}
                        </Button>
                    )}
                    {!hideConfirmBtn && (
                        <Button type="button" variant={confirmBtnVariant} onClick={handleConfirmBtnClick}>
                            {confirmBtnTitle}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
