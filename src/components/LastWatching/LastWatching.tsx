import SwiperSection from "../SwiperSection/SwiperSection";
import useLastWatched from "../../hooks/useLastWatched";
import { useTranslation } from "../../hooks/useTranslation";

function LastWatching() {
  const { lastWatched } = useLastWatched();
  const { translate } = useTranslation();

  if (lastWatched.length === 0) {
    return null;
  }

  return (
    <SwiperSection
      title={translate("catalog.recentlyViewed")}
      items={lastWatched}
    />
  );
}

export default LastWatching;
