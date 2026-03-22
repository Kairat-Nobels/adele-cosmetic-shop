import SocialsList from "../utils-components/SocialsList/SocialsList";
import TwoColoredBlock from "../utils-components/TwoColoredBlock/TwoColoredBlock";
import "./MapSection.scss";
import { useTranslation } from "../../hooks/useTranslation";

function MapSection() {
  const { translate } = useTranslation();

  return (
    <TwoColoredBlock>
      <div className="contacts" id="contacts">
        <h2 className="contacts__title">{translate("common.contacts")}</h2>
        <dl className="contacts__list">
          <dt className="contacts__dt">{translate("contacts.address")}</dt>
          <dd className="contacts__dd">{translate("contacts.addressValue")}</dd>
          <dt className="contacts__dt">{translate("contacts.phone")}</dt>
          <dd className="contacts__dd">{translate("contacts.phoneValue")}</dd>
          <dt className="contacts__dt">E-mail</dt>
          <dd className="contacts__dd">
            <a className="contacts__mail-link" href="mailto:info@maroon.ru">
              jalilovanuraiym04@gmail.com
            </a>
          </dd>
        </dl>
        <SocialsList />
      </div>
      <div className="map-area">
        <iframe
          className="map-area__map"
          src="https://yandex.com/map-widget/v1/?um=constructor%3A51067f03cd50b8954734c535b9be8d3806adac1dddbf60e1a9ad761642f5f619&amp;source=constructor"
          width="500"
          height="400"
          frameBorder="0"
          title={translate("contacts.mapTitle")}
        ></iframe>
      </div>
    </TwoColoredBlock>
  );
}

export default MapSection;
