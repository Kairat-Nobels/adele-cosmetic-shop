import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchDataContext from "../../../context/SearchDataContext";
import CardsSection from "../../CardsSection/CardsSection";
import FilterSection from "../FilterSection/FilterSection";
import { FilterDefaultData } from "../../../utils/consts";
import { TypeOfSettingsFilter } from "../../../types/filter";
import { TypeOfItem } from "../../../types/item";
import { getItems, getMaxPage } from "../../../utils/catalog";
import NavigateBlock from "../../NavigateBlock/NavigateBlock";
import { filterItems, getVisibleItems } from "../../../utils/filter";
import { useTranslation } from "../../../hooks/useTranslation";

function Catalog() {
  const maxItemsOnPage = 4;
  const [searchParams] = useSearchParams();
  const { translate } = useTranslation();

  const [searchData, setSearchData] = useState<TypeOfSettingsFilter>(() => {
    const type = searchParams.get("type");

    if (type) {
      return {
        ...FilterDefaultData,
        useFor: type === "face" ? "face" : "body",
      };
    }

    return FilterDefaultData;
  });

  const [currentItems, setCurrentItems] = useState<TypeOfItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<TypeOfItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<TypeOfItem[]>([]);

  useEffect(() => {
    const type = searchParams.get("type");

    if (type) {
      setSearchData((prev) => ({
        ...prev,
        useFor: type === "face" ? "face" : "body",
      }));
    }

    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const items = await getItems();
        setAllItems(items);
        setError(null);
      } catch (err) {
        setError(translate("catalog.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [translate]);

  useEffect(() => {
    const filteredItems = filterItems(searchData, allItems);
    setCurrentItems(filteredItems);
    setCurrentPage(1);
  }, [searchData, allItems]);

  useEffect(() => {
    setMaxPage(getMaxPage(currentItems, maxItemsOnPage));
  }, [currentItems, maxItemsOnPage]);

  const handleClickLeftButton = () => {
    if (currentPage === 1) {
      return;
    }

    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const handleClickRightButton = () => {
    if (currentPage === maxPage) {
      return;
    }

    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const newItems = getVisibleItems(currentItems, maxItemsOnPage, currentPage);
    setVisibleItems(newItems);
  }, [currentItems, maxItemsOnPage, currentPage]);

  return (
    <SearchDataContext.Provider
      value={{
        searchData,
        setSearchData,
        currentItems,
        setCurrentItems,
      }}
    >
      <section>
        <FilterSection />
        <CardsSection
          items={visibleItems}
          isLoading={isLoading}
          error={error}
          emptyText={[
            translate("catalog.noResults"),
            translate("catalog.tryChangingFilters"),
          ]}
        >
          <NavigateBlock
            isSwiper={false}
            onClickLeftButton={handleClickLeftButton}
            onClickRightButton={handleClickRightButton}
            page={currentPage}
            maxPage={maxPage}
          />
        </CardsSection>
      </section>
    </SearchDataContext.Provider>
  );
}

export default Catalog;
