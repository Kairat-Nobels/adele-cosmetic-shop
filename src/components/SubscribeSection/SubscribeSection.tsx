/* eslint-disable no-nested-ternary */
import "./SubscribeSection.scss";
import React, { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

type Review = {
  id?: number;
  fullName: string;
  phone: string;
  text: string;
};

function SubscribeSection() {
  const { translate } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://e16957e6b2c42c21.mokky.dev/reviews");
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Ошибка при загрузке отзывов:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !text.trim()) {
      return;
    }

    const newReview = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      text: text.trim(),
    };

    try {
      setIsSending(true);

      const response = await fetch("https://e16957e6b2c42c21.mokky.dev/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      const createdReview = await response.json();

      setReviews((prev) => [createdReview, ...prev]);
      setFullName("");
      setPhone("");
      setText("");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Ошибка при отправке отзыва:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="subscribe">
      <div className="subscribe__reviews-area">
        <div className="subscribe__description-area">
          <h2 className="subscribe__title">
            {translate("reviews.title")}
          </h2>
          <p className="subscribe__text">
            {translate("reviews.description")}
          </p>
        </div>

        <div className="subscribe__reviews-list">
          {isLoading ? (
            <p className="subscribe__empty">
              {translate("reviews.loading")}
            </p>
          ) : reviews.length > 0 ? (
            reviews.slice(0, 4).map((review) => (
              <div
                key={review.id ?? `${review.fullName}-${review.phone}`}
                className="subscribe__card"
              >
                <p className="subscribe__review-text">“{review.text}”</p>
                <p className="subscribe__review-name">{review.fullName}</p>
                <p className="subscribe__review-phone">{review.phone}</p>
              </div>
            ))
          ) : (
            <p className="subscribe__empty">
              {translate("reviews.empty")}
            </p>
          )}
        </div>
      </div>

      <div className="subscribe__form-area">
        <h3 className="subscribe__form-title">
          {translate("reviews.formTitle")}
        </h3>

        <form className="subscribe__form" onSubmit={handleSubmit}>
          <input
            className="subscribe__input"
            type="text"
            placeholder={translate("reviews.fullNamePlaceholder")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="subscribe__input"
            type="text"
            placeholder={translate("reviews.phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            className="subscribe__textarea"
            placeholder={translate("reviews.textPlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="subscribe__submit-button"
            type="submit"
            disabled={isSending}
          >
            {isSending
              ? translate("reviews.sending")
              : translate("reviews.submit")}
          </button>
        </form>
      </div>
    </section>
  );
}

export default SubscribeSection;
