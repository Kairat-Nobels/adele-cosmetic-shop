/* eslint-disable */
import { useParams } from "react-router-dom";
import "./ItemSection.scss";
import { FormEvent, Fragment, useEffect, useState, useContext } from "react";
import { TypeOfItem } from "../../../types/item";
import InfoAccordeon from "./InfoArea/InfoAccordeon";
import AnimatedButton from "../../utils-components/AnimatedButton/AnimatedButton";
import RadioInputListItem from "../../utils-components/RadioInputListItem/RadioInputListItem";
import { useCart } from "../../../context/CartContext";
import useLastWatched from "../../../hooks/useLastWatched";
import SearchDataContext from "../../../context/SearchDataContext";
import { useTranslation } from "../../../hooks/useTranslation";

function ItemSection() {
  const params = useParams();
  const [item, setItem] = useState<TypeOfItem | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(
    undefined
  );
  const { translate,currentLang } = useTranslation();
  const [currentRadioCheched, setCurrentRadioCheched] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { addToLastWatched } = useLastWatched();
  const { currentItems } = useContext(SearchDataContext);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);

        // First check if the item exists in our current catalog data
        const itemId = parseInt(params.id || "", 10);
          
          // If not in catalog, fetch from API
          const response = await fetch(
            `https://f449ec74485f3efc.mokky.dev/items/`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }
          const data = await response.json();
          const foundItem = data.find((i: TypeOfItem) => i.id === itemId);
          setItem(foundItem);
          addToLastWatched(foundItem);
      
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchItem();
    }
  }, [params.id]);

  useEffect(
    () => setCurrentPrice(item?.variants[currentRadioCheched].price),
    [item, currentRadioCheched]
  );

  const handleSubmit = (evt: FormEvent<EventTarget>) => {
    evt.preventDefault();
    if (item) {
      addToCart(item, item.variants[currentRadioCheched].volume);
    }
  };

  if (isLoading) {
    return (
      <div className="item-section__loading">{translate("common.loading")}</div>
    );
  }

  if (error) {
    return <div className="item-section__error">{error}</div>;
  }

  if (!item) {
    return (
      <div className="item-section__not-found">
        {translate("common.productNotFound")}
      </div>
    );
  }

  return (
    <section className="item-section">
      <img className="item-section__image" src={item.image} alt={item.name} />
      <div className="item-section__info-area">
        <h1 className="item-section__title">{item.name}</h1>
        <p className="item-section__short-description">
          {currentLang==='ru'?item.shortDescription:item.shortDescription_kg}
        </p>
        <div className="item-section__description-area">
          {currentLang==='ru'?item.description.map((text) => (
            <p className="item-section__description" key={text}>
              {text}
            </p>
          )):item.description_kg?.map((text) => (
            <p className="item-section__description" key={text}>
              {text}
            </p>
          ))}
        </div>
        <InfoAccordeon
          name={translate("product.composition")}
          text= {currentLang==='ru'?item.composition:item.composition_kg}
        />
        <InfoAccordeon
          name={translate("product.instruction")}
          text={currentLang==='ru'?item.instruction:item.instruction_kg}
        />
        <form className="item-section__form">
          <div className="item-section__variants-area">
            <span className="item-section__variants-name">
              {translate("product.volume")}:
            </span>
            <ul className="item-section__variants-list">
              {item.variants.map(({ volume }, i) => (
                <Fragment key={i}>
                  <RadioInputListItem
                    name={`${volume}${item.units}`}
                    title={`${volume}`}
                    handleChangeInput={() => setCurrentRadioCheched(i)}
                    isChoose={i === currentRadioCheched}
                    type={"radio"}
                  />
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="item-section__price-area">
            <div>
              <span className="item-section__price">
                {currentPrice} {translate("common.currency")}
              </span>
            </div>
            <AnimatedButton
              text={translate("product.addToCart")}
              onClick={handleSubmit}
              typeOfButton={"submit"}
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default ItemSection;
