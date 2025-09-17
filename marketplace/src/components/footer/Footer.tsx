import cn from "classnames";
import style from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerColsBlock}>
        {/* Колонка 1 */}
        <div className={style.footerContainer}>
          <ul className={style.list}>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>О компании</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>О нас</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Отзывы</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Блог</a>
            </li>
          </ul>
        </div>

        {/* Колонка 2 */}
        <div className={style.footerContainer}>
          <ul className={style.list}>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Реквизиты организации</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Оплата и доставка</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>ПОДГОНКА И ГАРАНТИЙНЫЙ РЕМОНТ</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Возврат</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Программа лояльности</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Вопрос-ответ</a>
            </li>
          </ul>
        </div>

        {/* Колонка 3 */}
        <div className={style.footerContainer}>
          <ul className={style.list}>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Контакты</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Контакты магазинов</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>WhatsApp</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Эл. почта</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Telegram</a>
            </li>
          </ul>
        </div>

        {/* Колонка 4 */}
        <div className={style.footerContainer}>
          <ul className={style.list}>
            <li className={style.listComp}>
              <a href="/" className={style.listLink}>Подписка на новости</a>
            </li>
            <li className={style.listComp}>
              <a href="/" className={cn(style.listLink, style.listText)}>
                Получайте советы стилистов, вдохновляйтесь образами блогеров и следуйте за модой с нами.
              </a>
            </li>
            <li className={style.listComp}>
              <input placeholder="Введите ваш e-mail" className={style.listInput} />
            </li>
            <li className={style.listComp}>
              <button className={style.listButton}>ПОДПИСАТЬСЯ</button>
            </li>
          </ul>
        </div>
      </div>

      <div className={style.copyrightBlock}>
        © 2014-2025 IRKE Kazan
      </div>
    </footer>
  );
};

export default Footer;
