export type TypeOfItem = {
  id: number;
  name: string;
  useFor: "face" | "body";
  category:
    | "Крема"
    | "Сыворотки"
    | "Маски"
    | "Пенки"
    | "Тоники"
    | "Пудры"
    | "Масла"
    | "Скрабы"
    | "Мыло"
    | "Бомбочки для ванны"
    | "Соль для ванны";
    category_kg?:
    | "Кремдер"
    | "Сыворткалар"
    | "Маскалар"
    | "Көбүктөр"
    | "Тониктер"
    | "Упалар"
    | "Майлар"
    | "Скрабдар"
    | "Самындар"
    | "Ванна үчүн бомбочкалар"
    | "Ванна үчүн туз";
  skin: "Нормальная" | "Сухая" | "Жирная" | "Комбинированная";
  skin_kg?: "Нормалдуу" | "Кургак" | "Майлуу" | "Аралаш";
  variants: { volume: number; price: number }[];
  units: "ml" | "g";
  units_kg?: "мл" | "г";
  shortDescription: string;
  shortDescription_kg?: string;
  description: string[];
  instruction: string[];
  composition: string;
  description_kg?: string[];
  instruction_kg?: string[];
  composition_kg?: string;
  image: string;
  imageId?: string;
};
