/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable */
import { FormEvent, useState, ChangeEvent } from "react";
import "./CartPage.scss";
import { useCart } from "../../context/CartContext";
import AnimatedButton from "../utils-components/AnimatedButton/AnimatedButton";
import { AppRoute } from "../../utils/consts";
import Modal from "../utils-components/Modal/Modal";
import { useTranslation } from "../../hooks/useTranslation";

interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { translate, currentLang } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<OrderFormData>>({});

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setFormErrors({});
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      resetForm();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page cart-page_empty">
        <h1>{translate("cart.title")}</h1>
        <p>{translate("cart.empty")}</p>
        <AnimatedButton
          text={translate("common.goToCatalog")}
          onClick={AppRoute.Catalog}
        />
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsModalOpen(true);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Partial<OrderFormData> = {};

    if (!formData.name.trim()) {
      errors.name = translate("formErrors.name");
    }
    if (!formData.email.trim()) {
      errors.email = translate("formErrors.email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = translate("formErrors.invalidEmail");
    }
    if (!formData.phone.trim()) {
      errors.phone = translate("formErrors.phone");
    } else {
      // More flexible phone validation - accepts various formats
      const digitsOnly = formData.phone.replace(/\D/g, "");

      // Handle Kyrgyz phone numbers in various formats
      // Valid formats: 0771007644, 771007644, 996771007644, +996771007644, (771)-007-644
      let isValid = false;

      if (
        digitsOnly.length === 10 &&
        (digitsOnly.startsWith("0") || !digitsOnly.startsWith("0"))
      ) {
        // Format: 0771007644 or 771007644
        isValid = true;
      } else if (digitsOnly.length === 12 && digitsOnly.startsWith("996")) {
        // Format: 996771007644 or +996771007644
        isValid = true;
      } else if (digitsOnly.length === 9 && !digitsOnly.startsWith("0")) {
        // Format without leading zero: 771007644
        isValid = true;
      }

      if (!isValid) {
        errors.phone = translate("formErrors.invalidPhone");
      }
    }
    if (!formData.address.trim()) {
      errors.address = translate("formErrors.address");
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Format order details for WhatsApp
      const orderItems = cartItems
        .map((item) => {
          const price = item.variants.find(
            (v) => v.volume === item.selectedVolume
          )?.price;
          return `${item.name} (${item.selectedVolume} ${item.units}) - ${item.quantity}шт. x ${price}сом`;
        })
        .join("\n");

      const orderDetails = `
*${translate("order.newOrder")}*

*${translate("order.items")}:*
${orderItems}

*${translate("cart.totalAmount")}:* ${getCartTotal()}${translate(
        "common.currency"
      )}

*${translate("order.customerData")}:*
${translate("order.name")}: ${formData.name}
Email: ${formData.email}
${translate("order.phone")}: ${formData.phone}
${translate("order.address")}: ${formData.address}`;

      // WhatsApp phone number (replace with your actual number)
      const phoneNumber = "996778047383"; // Please replace with your actual WhatsApp number
      const encodedMessage = encodeURIComponent(orderDetails);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Close modal, reset form and redirect to WhatsApp
      setIsModalOpen(false);
      resetForm();
      window.open(whatsappUrl, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof OrderFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (formErrors[field]) {
        setFormErrors({ ...formErrors, [field]: undefined });
      }
    };

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">{translate("cart.title")}</h1>
      <div className="cart-page__content">
        <div className="cart-page__items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                className="cart-item__image"
                src={item.image}
                alt={item.name}
              />
              <div className="cart-item__info">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__description">
                  {currentLang === "ru"
                    ? item.shortDescription
                    : item.shortDescription_kg}
                </p>
                <div className="cart-item__details">
                  <span className="cart-item__volume">
                    {item.selectedVolume} {item.units}
                  </span>
                  <div className="cart-item__quantity-controls">
                    <button
                      className="cart-item__quantity-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="cart-item__quantity">{item.quantity}</span>
                    <button
                      className="cart-item__quantity-btn"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item__price-row">
                  <span className="cart-item__price">
                    {
                      item.variants.find(
                        (v) => v.volume === item.selectedVolume
                      )?.price
                    }{" "}
                    {translate("common.currency")}
                  </span>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    {translate("common.remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-page__summary">
          <div className="cart-summary">
            <h3 className="cart-summary__title">{translate("cart.summary")}</h3>
            <div className="cart-summary__total">
              <span>{translate("cart.totalAmount")}:</span>
              <span>{getCartTotal()} сом</span>
            </div>
            <AnimatedButton
              text={translate("cart.placeOrder")}
              onClick={handlePlaceOrder}
              typeOfButton="button"
            />
          </div>
        </div>
      </div>

      <Modal
        bankDetails={{
          bankName: "",
          accountNumber: "",
          recipientName: "",
        }}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={translate("cart.orderTitle")}
      >
        <form className="order-form" onSubmit={handleSubmitOrder}>
          <div className="order-form__group">
            <label className="order-form__label" htmlFor="name">
              {translate("order.name")}
            </label>
            <input
              className="order-form__input"
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder={translate("order.enterName")}
              disabled={isSubmitting}
            />
            {formErrors.name && (
              <span className="order-form__error">{formErrors.name}</span>
            )}
          </div>

          <div className="order-form__group">
            <label className="order-form__label" htmlFor="email">
              Email
            </label>
            <input
              className="order-form__input"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="example@example.com"
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <span className="order-form__error">{formErrors.email}</span>
            )}
          </div>

          <div className="order-form__group">
            <label className="order-form__label" htmlFor="phone">
              Телефон
            </label>
            <input
              className="order-form__input"
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              placeholder={translate("order.phonePlaceholder")}
              disabled={isSubmitting}
            />
            {formErrors.phone && (
              <span className="order-form__error">{formErrors.phone}</span>
            )}
          </div>

          <div className="order-form__group">
            <label className="order-form__label" htmlFor="address">
              {translate("order.address")}
            </label>
            <textarea
              className="order-form__input"
              id="address"
              value={formData.address}
              onChange={handleInputChange("address")}
              placeholder={translate("formErrors.address")}
              disabled={isSubmitting}
            />
            {formErrors.address && (
              <span className="order-form__error">{formErrors.address}</span>
            )}
          </div>

          <button
            type="submit"
            className={`order-form__submit ${
              isSubmitting ? "order-form__submit--disabled" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? translate("order.processing")
              : translate("order.confirm")}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default CartPage;
