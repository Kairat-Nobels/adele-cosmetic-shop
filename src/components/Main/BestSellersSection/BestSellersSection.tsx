import useCurrentWidth from "../../../hooks/useCurrentWidth";
import { useTranslation } from "../../../hooks/useTranslation";
import { AppRoute } from "../../../utils/consts";
import AnimatedButton from "../../utils-components/AnimatedButton/AnimatedButton";
import "./BestSellersSection.scss";
import SwiperBestsellers from "./SwiperBestsellers/SwiperBestsellers";

function BestSellersSection() {
  const width = useCurrentWidth();
  const { translate } = useTranslation();

  const button = (
    <AnimatedButton
      onClick={AppRoute.Catalog}
      text={translate("common.viewAll")}
    />
  );

  return (
    <section className="bestsellers">
      <div className="bestsellers__description-area">
        <h2 className="bestsellers__title">
          {translate("main.bestsellers.title")}
        </h2>
        <p className="bestsellers__text">
          {translate("main.bestsellers.description")}
        </p>
        {width > 450 && button}
      </div>
      <SwiperBestsellers width={width} />
      {width <= 450 && button}
    </section>
  );
}

export default BestSellersSection;
