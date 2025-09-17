import style from "./ProductCard.module.css";

interface ProductCardProps {
  badge?: string;          // может быть не передан
  title: string;           // название товара
  price: string | number;  // цена (может быть строкой или числом)
  colors: string[];        // массив цветов в HEX/rgb
  image: string;           // путь к картинке
}

const ProductCard: React.FC<ProductCardProps> = ({ badge = "Новинка", title, price, colors, image }) => {
  return (
    <div className={style.card}>
      <a href="/" className={style.imageWrapper}>
        <img src={image} alt={title} className={style.image} />
        <div className={style.imageCover}>
          <div className={style.coverTopBlock}>
            <p className={style.badge}>{badge}</p>
          </div>
        </div>
      </a>

      <div className={style.productInfoBlock}>
        <a href="/" className={style.title}>{title}</a>
        <p className={style.price}>{price}</p>
        <div className={style.colors}>
          {colors.map((c, i) => (
            <span key={i} className={style.color} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
