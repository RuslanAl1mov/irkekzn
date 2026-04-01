import { useState, useEffect } from "react";
import cls from "./WideImagesGallery.module.css";
import cn from "classnames";

export interface IWideImagesGalleryImage {
    id: number;
    image: string;
    is_active: boolean;
    date_created: string;
}

export interface IWideImagesGalleryProps {
    images: IWideImagesGalleryImage[];
}

export const WideImagesGallery = ({ images }: IWideImagesGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState<IWideImagesGalleryImage>(images[0]);
    const [aspectRatio, setAspectRatio] = useState<string>("16/9");

    // Загружаем первую картинку и определяем её соотношение
    useEffect(() => {
        if (!images) return;

        const img = new Image();
        img.onload = () => {
            setAspectRatio(`${img.width} / ${img.height}`);
        };
        img.src = images[0].image;
    }, [images[0]?.image]);

    return (
        <div className={cls.wrapper} style={{ '--image-ratio': aspectRatio } as React.CSSProperties}>
            <div className={cls.galleryBlock}>
                {images.map((image) => (
                    <div
                        className={cn(cls.galleryItem, selectedImage == image && cls.galleryItemActive)}
                        key={image.id}
                        onClick={() => setSelectedImage(image)}
                    >
                        <img className={cls.galleryItemImage} src={image.image} alt={image.image} />
                    </div>
                ))}
            </div>
            <div className={cls.mainImageBlock}>
                <img className={cls.mainImage} src={selectedImage.image} alt={selectedImage.image} />
            </div>
        </div>
    );
};