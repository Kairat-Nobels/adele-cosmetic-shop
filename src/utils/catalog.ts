import { TypeOfItem } from "../types/item";

const API_URL = "https://e16957e6b2c42c21.mokky.dev/items";

export const getItems = async (): Promise<TypeOfItem[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

export const getMaxPage = (items: TypeOfItem[], maxItemsOnPage: number) => {
  const maxPage = Math.ceil(items.length / maxItemsOnPage);
  if (maxPage === 0) {
    return 1;
  }
  return maxPage;
};
