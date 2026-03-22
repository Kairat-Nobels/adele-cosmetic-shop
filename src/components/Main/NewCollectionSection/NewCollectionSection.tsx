import { useTranslation } from "../../../hooks/useTranslation";
import { AppRoute } from "../../../utils/consts";
import AnimatedButton from "../../utils-components/AnimatedButton/AnimatedButton";
import "./NewCollectionSection.scss";

function NewCollectionSection() {
  const { translate } = useTranslation();

  return (
    <section className="new-collection">
      <div className="new-collection__wrapper">
        <h2 className="new-collection__title">
          {translate("main.newCollection.title")}
        </h2>
        <p className="new-collection__text">
          {translate("main.newCollection.description")}
        </p>
        <AnimatedButton
          text={translate("common.learnMore")}
          onClick={AppRoute.Catalog}
        />
      </div>
    </section>
  );
}

export default NewCollectionSection;
