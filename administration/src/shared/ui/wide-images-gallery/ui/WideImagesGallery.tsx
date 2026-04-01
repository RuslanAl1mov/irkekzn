import cls from "./WideImagesGallery.module.css";
import cn from "classnames";

import { useState } from "react";


export interface IWideImagesGalleryImage {
    id: number;
    image: string;
    preview?: string;
    is_active: boolean;
    date_created: string;
}

export interface IWideImagesGalleryProps {
    images: IWideImagesGalleryImage[];
}

export const WideImagesGallery = ({ images }: IWideImagesGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState<IWideImagesGalleryImage>(images[0]);


    return (
        <div className={cls.wrapper}>
            <div className={cls.galleryBlock}>
                {images.map((image) => (
                    <div className={cn(cls.galleryItem, selectedImage == image && cls.galleryItemActive)} key={image.id} onClick={() => setSelectedImage(image)}>
                        <img className={cls.galleryItemImage} src={image.image} alt={image.image} />
                    </div>
                ))}
            </div>
            <div className={cls.mainImageBlock}>
                <img className={cls.mainImage} src={selectedImage.image} alt={selectedImage.image} />
            </div>
        </div>
    );
}

