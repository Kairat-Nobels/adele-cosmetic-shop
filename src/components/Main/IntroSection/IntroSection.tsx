/* eslint-disable */
import "./IntroSection.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import introPic1 from "../../../images/intro-pic1.png";
import introPic2 from "../../../images/intro-pic2.png";
import introPic1Tablet from "../../../images/intro-pic1-tablet.png";
import introPic2Tablet from "../../../images/intro-pic2-tablet.png";
import introPic1Mobile from "../../../images/intro-pic1-mobile.png";
import introPic2Mobile from "../../../images/intro-pic2-mobile.png";
import arrow from "../../../images/arrow.svg";
import AnimatedButton from "../../utils-components/AnimatedButton/AnimatedButton";
import { AppRoute } from "../../../utils/consts";
import { useTranslation } from "../../../hooks/useTranslation";

function IntroSection() {
  const [windowSize, setWindowSize] = useState(0);
  const [imageLeft, setImageLeft] = useState("");
  const [imageRight, setImageRight] = useState("");
  const { translate } = useTranslation();

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleWindowSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowSize);
    return () => window.removeEventListener("scroll", handleWindowSize);
  }, []);

  useEffect(() => {
    switch (true) {
      case windowSize > 800:
        setImageLeft(introPic1);
        setImageRight(introPic2);
        break;

      case windowSize <= 800 && windowSize > 450:
        setImageLeft(introPic1Tablet);
        setImageRight(introPic2Tablet);
        break;

      case windowSize <= 450:
        setImageLeft(introPic1Mobile);
        setImageRight(introPic2Mobile);
        break;

      default:
        setImageLeft(introPic1);
        setImageRight(introPic2);
    }
  }, [windowSize]);

  return (
    <section className="intro">
      <div className="intro__wrapper">
        <Link className="intro__link" to={`${AppRoute.Catalog}?type=face`}>
          <figure className="intro__figure">
            <img
              className="intro__picture"
              src={imageLeft}
              alt={translate("main.intro.faceCare")}
            />
            <figcaption className="intro__link-description">
              {translate("main.intro.faceCare")}
              <img src={arrow} className="intro__arrow" />
            </figcaption>
          </figure>
        </Link>
        <div className="intro__about">
          <h1 className="intro__title">Adele</h1>
          <p className="intro__description">
            {translate("main.intro.description")}
          </p>
          <AnimatedButton
            text={translate("common.learnMore")}
            onClick={AppRoute.AboutThisPage}
          />
        </div>
        <Link className="intro__link" to={`${AppRoute.Catalog}?type=body`}>
          <figure className="intro__figure">
            <img
              className="intro__picture"
              src={imageRight}
              alt={translate("main.intro.bodyCare")}
            />
            <figcaption className="intro__link-description">
              {translate("main.intro.bodyCare")}
              <img src={arrow} className="intro__arrow" />
            </figcaption>
          </figure>
        </Link>
      </div>
    </section>
  );
}

export default IntroSection;
