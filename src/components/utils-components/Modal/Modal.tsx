/* eslint-disable  */
import { ReactNode, useEffect, useState } from "react";
import QRImage from "../../../images/QRMaroon.jpg";
import "./Modal.scss";
import { useTranslation } from "../../../hooks/useTranslation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    recipientName: string;
  };
}

function Modal({ isOpen, onClose, children, title, bankDetails }: ModalProps) {
  const { translate } = useTranslation();
  const [activeTab, setActiveTab] = useState<"form" | "payment">("form");
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        {bankDetails && (
          <div className="modal__tabs">
            <button
              className={`modal__tab ${
                activeTab === "form" ? "modal__tab_active" : ""
              }`}
              onClick={() => setActiveTab("form")}
            >
              {translate("order.deliveryData")}
            </button>
            <button
              className={`modal__tab ${
                activeTab === "payment" ? "modal__tab_active" : ""
              }`}
              onClick={() => setActiveTab("payment")}
            >
              {translate("order.payment")}
            </button>
          </div>
        )}
        <div className="modal__content">
          {activeTab === "form" ? (
            children
          ) : (
            <div className="bank-details">
              <h3 className="bank-details__title">
                {translate("order.paymentDetails")}
              </h3>
              <div className="bank-details__info">
                <img src={QRImage} alt={translate("order.qrCodeAlt")} />
              </div>
              <p className="bank-details__note">
                {translate("order.paymentNote")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
