import "./FillFormSection.scss";
import picture from "../../../images/fill-form-pic.png";
import TwoColoredBlock from "../../utils-components/TwoColoredBlock/TwoColoredBlock";
import AnimatedButton from "../../utils-components/AnimatedButton/AnimatedButton";
import { AppRoute } from "../../../utils/consts";
import { useTranslation } from "../../../hooks/useTranslation";

function FillFormSection() {
  const { translate } = useTranslation();

  return (
    <TwoColoredBlock>
      <div className="fill-form-colored">
        <h2 className="fill-form-colored__title">
          {translate("main.fillForm.title")}
        </h2>
        <p className="fill-form-colored__text">
          {translate("main.fillForm.description1")}
        </p>
        <p className="fill-form-colored__text">
          {translate("main.fillForm.description2")}
        </p>
        <AnimatedButton
          text={translate("main.fillForm.buttonText")}
          onClick={AppRoute.FillForm}
        />
      </div>

      <div className="fill-form-non-colored">
        <img
          className="fill-form-non-colored__picture"
          src={picture}
          alt={translate("main.fillForm.imageAlt")}
        />
      </div>
    </TwoColoredBlock>
  );
}

export default FillFormSection;
