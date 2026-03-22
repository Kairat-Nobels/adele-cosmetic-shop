import "./SocialsList.scss";

import facebook from "../../../images/facebook.svg";
import instagram from "../../../images/instagram.svg";
import twitter from "../../../images/twitter.svg";

function ContactsList() {
  return (
    <ul className={"contacts-list"}>
      <li className="contacts-list__item">
        <a className="contacts-list__link" href="#">
          <img className="contacts-list__picture" src={facebook} />
        </a>
      </li>
      <li className="contacts-list__item">
        <a
          className="contacts-list__link"
          target="_blank"
          href="https://www.instagram.com/bakir0va_k?igsh=bThzdzlpZ2ZkcXM0&utm_source=qr"
          rel="noreferrer"
        >
          <img className="contacts-list__picture" src={instagram} />
        </a>
      </li>
      <li className="contacts-list__item">
        <a className="contacts-list__link" href="#">
          <img className="contacts-list__picture" src={twitter} />
        </a>
      </li>
    </ul>
  );
}

export default ContactsList;
