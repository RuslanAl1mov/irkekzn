import style from "./CategoryCard.module.css";

interface CategoryCardProps {
  id: string | number; // идентификатор категории
  title: string;       // название категории
  image: string;       // ссылка на картинку
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, title, image }) => {
  return (
    <div className={style.card} key={id}>
      <a href="/" className={style.imageWrapper}>
        <img src={image} alt={title} className={style.image} />
        <div className={style.imageCover}>
          <div className={style.imgTitle}>{title}</div>
        </div>
      </a>
    </div>
  );
};

export default CategoryCard;
