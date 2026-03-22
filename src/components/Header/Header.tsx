import "./Header.scss";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoSvg from "../../images/adele.png";
import cartSvg from "../../images/cart.svg";
import { useCart } from "../../context/CartContext";
import burger from "../../images/burger.svg";
import close from "../../images/close.svg";
import SocialsList from "../utils-components/SocialsList/SocialsList";
import Nav from "../Nav/Nav";
import { AppRoute } from "../../utils/consts";
import { useTranslation } from "../../hooks/useTranslation";

function Header() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isMenuColored, setIsMenuColored] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [scroll, setScroll] = useState(0);
  const { cartItems } = useCart();
  const { changeLang, currentLang } = useTranslation();

  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setScroll(window.scrollY);
    setWindowWidth(window.innerWidth);
    const handleScroll = () => {
      setScroll(window.scrollY);
    };
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuColored(isMenuOpened);
  }, [isMenuOpened]);

  const closeMenu = () => {
    setIsMenuOpened(false);
  };
  useEffect(() => {
    const onClick = (evt: MouseEvent) => {
      if (
        // eslint-disable-next-line operator-linebreak
        headerRef.current &&
        !headerRef.current.contains(evt.target as HTMLElement)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function handleBurgerClick() {
    setIsMenuOpened(!isMenuOpened);
  }
  return (
    <header
      ref={headerRef}
      className={`header ${isMenuColored || scroll > 0 ? "header_colored" : ""
      }`}
    >
      <Link className="header__logo-link" to={"/"}>
        <img className="header__logo" alt="Логотип Adele" src={logoSvg} />
      </Link>
      <button className="header__burger-button" onClick={handleBurgerClick}>
        <img alt="Кнопка меню" src={isMenuOpened ? close : burger} />
      </button>
      <div
        className={`header__nav-area ${isMenuOpened ? "header__nav-area_open" : ""
        }`}
      >
        <Nav type="header" onClickLinks={closeMenu} />
        <div className="langSwitcher">
          <button
            onClick={() => changeLang("ru")}
            className={`langButton ${currentLang === "ru" ? "active" : ""}`}
          >
            RU
          </button>
          <button
            onClick={() => changeLang("kg")}
            className={`langButton ${currentLang === "kg" ? "active" : ""}`}
          >
            KG
          </button>
        </div>
        {windowWidth <= 800 && <SocialsList />}
      </div>
      <div className="header__buttons-area">
        <Link className="header__button" to={AppRoute.Cart}>
          <img className="header__button-icon" alt="Корзина" src={cartSvg} />
          {cartItems.length > 0 && (
            <span className="header__cart-badge">{cartItems.length}</span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
