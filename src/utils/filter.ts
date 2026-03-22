import { TypeOfSettingsFilter } from "../types/filter";
import { TypeOfItem } from "../types/item";

export const filterItems = (
  filterData: TypeOfSettingsFilter,
  items: TypeOfItem[],
) => {
  const {
    body, face, skin, useFor,
  } = filterData;
  let result = [...items];

  // Фильтрация по useFor, если указан
  if (useFor) {
    result = result.filter((item) => item.useFor === useFor);
  }
  // Если useFor не указан, используем существующую логику фильтрации по категориям
  if (!useFor && !(body.length === 0 && face.length === 0)) {
    result = result.filter((item) => {
      if (item.useFor === "body") {
        return body.includes(item.category);
      }
      return face.includes(item.category);
    });
  }

  // Фильтрация по типу кожи
  if (skin.length !== 0) {
    result = result.filter((item) => skin.includes(item.skin));
  }

  return result;
};

export const getVisibleItems = (
  items: TypeOfItem[],
  maxItemsOnPage: number,
  page: number,
) => {
  const start = (page - 1) * maxItemsOnPage;
  const end = start + maxItemsOnPage;
  return items.slice(start, end);
};
