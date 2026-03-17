import { useEffect, useRef } from "react";
import cls from "./Modal.module.css";
import { Title } from "@/widgets/title";
import { Button } from "@/shared/ui/button";

type ModalProps = {
    title?: string;
    subTitle?: string;
    children?: React.ReactNode;
    saveBtnTitle?: string;
    closeBtnTitle?: string;
    onSaveBtnClick?: () => void;
    onClose?: () => void;
}


export const Modal = ({ title, subTitle, children, saveBtnTitle = "Сохранить", closeBtnTitle = "Закрыть", onSaveBtnClick, onClose }: ModalProps) => {
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) {
            onClose?.();
        }
    }

    return (
        <div
            ref={overlayRef}
            className={cls.overlay}
            onClick={handleOverlayClick}
        >
            <div className={cls.modal}>
                <div className={cls.header}>
                    <Title
                        title={title ?? ""}
                        subTitle={subTitle ?? ""}
                        size="h3"
                        className={cls.titleBlock}
                        titleClassName={cls.title}
                        subTitleClassName={cls.subTitle}
                    />
                </div>

                <div className={cls.content}>
                    {children}
                </div>
                <div className={cls.actions}>
                    {onSaveBtnClick && (
                        <Button type="submit" onClick={onSaveBtnClick}>{saveBtnTitle}</Button>
                    )}
                    {onClose && (
                        <Button type="button" variant="gray" onClick={onClose}>{closeBtnTitle}</Button>
                    )}
                </div>
            </div>
        </div>);
} 
