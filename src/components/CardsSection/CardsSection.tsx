import { ReactNode } from "react";
import { TypeOfItem } from "../../types/item";
import Item from "../Item/Item";
import "./CardsSection.scss";
import { useTranslation } from "../../hooks/useTranslation";

type CardsSectionProps = {
  items: TypeOfItem[];
  emptyText: string[];
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
};

function CardsSection({
  items,
  emptyText,
  children,
  isLoading,
  error,
}: CardsSectionProps) {
  const { currentLang } = useTranslation();
  return (
    <section className="card-section">
      <div className="card-section__cards-area">
        {isLoading && <div className="card-section__loading">Загрузка...</div>}
        {!isLoading && error && (
          <div className="card-section__error">{error}</div>
        )}
        {!isLoading && !error && items.length === 0 && (
          <>
            {emptyText.map((text, i) => (
              <span key={i} className="card-section__empty-text">
                {text}
              </span>
            ))}
          </>
        )}
        {!isLoading
          && !error
          && items.length > 0
          && items.map((item) => (
            <Item
              key={item.id}
              name={item.name}
              image={item.image}
              shortDescription={currentLang === "ru" ? item.shortDescription : item.shortDescription_kg}
              price={item.variants[0].price}
              volume={item.variants[0].volume}
              units={item.units}
              id={item.id}
            />
          ))}
      </div>

      {children}
    </section>
  );
}

export default CardsSection;
