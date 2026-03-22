import { AppRoute } from "../../../utils/consts";
import AnimatedButton from "../../utils-components/AnimatedButton/AnimatedButton";
import "./OurHistorySection.scss";
import { useTranslation } from "../../../hooks/useTranslation";

function OurHistorySection() {
  const { translate } = useTranslation();

  return (
    <section className="our-history" id="about">
      <div className="our-history__wrapper">
        <p className="our-history__text">
          {translate("main.ourHistory.quote")}
        </p>
        <AnimatedButton
          text={translate("main.ourHistory.buttonText")}
          onClick={AppRoute.AboutThisPage}
        />
      </div>
    </section>
  );
}

export default OurHistorySection;
