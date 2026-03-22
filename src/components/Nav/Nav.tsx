import "./Nav.scss";
import { Link, useLocation } from "react-router-dom";
import { MouseEventHandler } from "react";
import { AppRoute } from "../../utils/consts";
import { useTranslation } from "../../hooks/useTranslation";

type NavProps = {
  type: "header" | "footer";
  onClickLinks?: MouseEventHandler<HTMLAnchorElement>;
};

function Nav({ type, onClickLinks }: NavProps) {
  const { pathname } = useLocation();
  const { translate } = useTranslation();
  return (
    <nav className={`nav nav_type_${type}`}>
      <ul className={`nav__list nav__list_type_${type}`}>
        <li className={`nav__item nav__item_type_${type}`}>
          <Link
            onClick={onClickLinks}
            className={`nav__link nav__link_type_${type}`}
            to={AppRoute.Catalog}
          >
            {translate("common.catalog")}
          </Link>
        </li>
        <li className={`nav__item nav__item_type_${type}`}>
          <Link
            onClick={onClickLinks}
            className={`nav__link nav__link_type_${type}`}
            to={
              pathname === AppRoute.Main
                ? AppRoute.AboutThisPage
                : AppRoute.About
            }
          >
            {translate("common.about")}
          </Link>
        </li>
        <li className={`nav__item nav__item_type_${type}`}>
          <Link
            onClick={onClickLinks}
            className={`nav__link nav__link_type_${type}`}
            to={
              pathname === AppRoute.Main || pathname === AppRoute.Catalog
                ? AppRoute.ContactsThisPage
                : AppRoute.Contacts
            }
          >
            {translate("common.contacts")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
