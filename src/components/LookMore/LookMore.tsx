import React, { useEffect, useState } from "react";
import { getItems } from "../../utils/catalog";
import SwiperSection from "../SwiperSection/SwiperSection";
import { TypeOfItem } from "../../types/item";
import { useTranslation } from "../../hooks/useTranslation";

function LastWatching() {
  const [items, setItems] = useState<TypeOfItem[]>([]);
  const { translate } = useTranslation();

  useEffect(() => {
    getItems().then((fetchedItems) => setItems(fetchedItems));
  }, []);

  return (
    <SwiperSection title={translate("product.youMayAlsoLike")} items={items} />
  );
}

export default LastWatching;
