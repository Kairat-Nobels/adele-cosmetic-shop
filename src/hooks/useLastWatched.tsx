import { useEffect, useState } from "react";
import { TypeOfItem } from "../types/item";

const LAST_WATCHED_KEY = "lastWatchedItems";
const MAX_ITEMS = 8;

const useLastWatched = () => {
  const [lastWatched, setLastWatched] = useState<TypeOfItem[]>([]);

  // Загружаем историю просмотров из localStorage при монтировании
  useEffect(() => {
    const savedItems = localStorage.getItem(LAST_WATCHED_KEY);
    if (savedItems) {
      setLastWatched(JSON.parse(savedItems));
    }
  }, []);

  // Добавляем товар в историю просмотров
  const addToLastWatched = (item: TypeOfItem) => {
    setLastWatched((prev) => {
      // Удаляем товар, если он уже есть в истории
      const filteredItems = prev.filter((i) => i.id !== item.id);

      // Добавляем новый товар в начало списка
      const newItems = [item, ...filteredItems];

      // Ограничиваем количество элементов
      const limitedItems = newItems.slice(0, MAX_ITEMS);

      // Сохраняем в localStorage
      localStorage.setItem(LAST_WATCHED_KEY, JSON.stringify(limitedItems));

      return limitedItems;
    });
  };

  return { lastWatched, addToLastWatched };
};

export default useLastWatched;
