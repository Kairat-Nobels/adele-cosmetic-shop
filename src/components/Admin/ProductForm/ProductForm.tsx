import React, { useState } from "react";
import "./ProductForm.scss";
import { TypeOfItem } from "../../../types/item";
import { useTranslation } from "../../../hooks/useTranslation";
/*eslint-disable*/
interface ProductFormProps {
  product?: TypeOfItem | null;
  onSubmit: (product: TypeOfItem) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  interface FormData extends TypeOfItem {
    imageFile?: File;
    imagePreview?: string;
  }
  const { translate } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    id: product?.id || 0,
    name: product?.name || "",
    useFor: product?.useFor || "face",
    category: product?.category || translate("categories.creams"),
    skin: product?.skin || translate("skinTypes.normal"),
    variants: product?.variants || [{ volume: 0, price: 0 }],
    units: product?.units || "ml",
    shortDescription: product?.shortDescription || "",
    description: product?.description || [""],
    instruction: product?.instruction || [""],
    composition: product?.composition || "",
    image: product?.image || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayInputChange = (
    field: "description" | "instruction",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleAddArrayItem = (field: "description" | "instruction") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const handleRemoveArrayItem = (
    field: "description" | "instruction",
    index: number
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleVariantChange = (
    index: number,
    field: "volume" | "price",
    value: number
  ) => {
    // Remove leading zeros by converting to number and back to string
    const sanitizedValue = Number(String(value).replace(/^0+/, "")) || 0;
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: sanitizedValue };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { volume: 0, price: 0 }],
    });
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    // Clean up temporary preview URL before submitting
    delete submitData.imagePreview;
    onSubmit(submitData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>
        {product
          ? translate("admin.editProduct")
          : translate("admin.addNewProduct")}
      </h2>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="name">
          {translate("admin.productName")}
        </label>
        <input
          className="product-form__input"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="useFor">
          {translate("admin.productUse")}
        </label>
        <select
          className="product-form__input"
          id="useFor"
          name="useFor"
          value={formData.useFor}
          onChange={handleInputChange}
          required
        >
          <option value="face">{translate("categories.faceCare")}</option>
          <option value="body">{translate("categories.bodyCare")}</option>
        </select>
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="category">
          {translate("categories.title")}
        </label>
        <select
          className="product-form__input"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value={translate("categories.creams")}>
            {translate("categories.creams")}
          </option>
          <option value={translate("categories.serums")}>
            {translate("categories.serums")}
          </option>
          <option value={translate("categories.masks")}>
            {translate("categories.masks")}
          </option>
          <option value={translate("categories.foams")}>
            {translate("categories.foams")}
          </option>
          <option value={translate("categories.tonics")}>
            {translate("categories.tonics")}
          </option>
          <option value={translate("categories.powders")}>
            {translate("categories.powders")}
          </option>
          <option value={translate("categories.oils")}>
            {translate("categories.oils")}
          </option>
          <option value={translate("categories.scrubs")}>
            {translate("categories.scrubs")}
          </option>
          <option value={translate("categories.soap")}>
            {translate("categories.soap")}
          </option>
          <option value={translate("categories.bathBombs")}>
            {translate("categories.bathBombs")}
          </option>
          <option value={translate("categories.bathSalt")}>
            {translate("categories.bathSalt")}
          </option>
        </select>
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="skin">
          {translate("product.skinType")}
        </label>
        <select
          className="product-form__input"
          id="skin"
          name="skin"
          value={formData.skin}
          onChange={handleInputChange}
          required
        >
          <option value={translate("skinType.normal")}>
            {translate("skinType.normal")}
          </option>
          <option value={translate("skinType.dry")}>
            {translate("skinType.dry")}
          </option>
          <option value={translate("skinType.oily")}>
            {translate("skinType.oily")}
          </option>
          <option value={translate("skinType.combination")}>
            {translate("skinType.combination")}
          </option>
        </select>
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="units">
          {translate("product.units")}
        </label>
        <select
          className="product-form__input"
          id="units"
          name="units"
          value={formData.units}
          onChange={handleInputChange}
          required
        >
          <option value="ml">{translate("units.ml")}</option>
          <option value="g">{translate("units.g")}</option>
        </select>
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="shortDescription">
          {translate("product.shortDescription")}
        </label>
        <input
          className="product-form__input"
          type="text"
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="product-form__group">
        <label className="product-form__label">
          {translate("product.fullDescription")}
        </label>
        {formData.description.map((desc, index) => (
          <div key={index} className="product-form__array-item">
            <textarea
              className="product-form__input"
              value={desc}
              onChange={(e) =>
                handleArrayInputChange("description", index, e.target.value)
              }
              required
            />
            {formData.description.length > 1 && (
              <button
                type="button"
                className="product-form__remove-item"
                onClick={() => handleRemoveArrayItem("description", index)}
              >
                {translate("common.remove")}
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="product-form__add-item"
          onClick={() => handleAddArrayItem("description")}
        >
          {translate("product.addDescription")}
        </button>
      </div>

      <div className="product-form__group">
        <label className="product-form__label">
          {translate("product.instructions")}
        </label>
        {formData.instruction.map((instr, index) => (
          <div key={index} className="product-form__array-item">
            <textarea
              className="product-form__input"
              value={instr}
              onChange={(e) =>
                handleArrayInputChange("instruction", index, e.target.value)
              }
              required
            />
            {formData.instruction.length > 1 && (
              <button
                type="button"
                className="product-form__remove-item"
                onClick={() => handleRemoveArrayItem("instruction", index)}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="product-form__add-item"
          onClick={() => handleAddArrayItem("instruction")}
        >
          {translate("product.addInstruction")}
        </button>
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="composition">
          {translate("product.composition")}
        </label>
        <textarea
          className="product-form__input"
          id="composition"
          name="composition"
          value={formData.composition}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="product-form__group">
        <label className="product-form__label" htmlFor="image">
          {translate("product.image")}
        </label>
        <div className="product-form__image-upload">
          {(formData.image || formData.imagePreview) && (
            <img
              src={formData.imagePreview || formData.image}
              alt="Preview"
              className="product-form__image-preview"
            />
          )}
          <div className="product-form__file-area">
            <input
              className="product-form__file-input"
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Clean up previous preview URL if it exists
                  if (formData.imagePreview) {
                    URL.revokeObjectURL(formData.imagePreview);
                  }
                  const previewUrl = URL.createObjectURL(file);
                  setFormData({
                    ...formData,
                    imageFile: file,
                    imagePreview: previewUrl,
                  });
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.parentElement?.classList.add("dragover");
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.parentElement?.classList.remove("dragover");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.parentElement?.classList.remove("dragover");
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  // Clean up previous preview URL if it exists
                  if (formData.imagePreview) {
                    URL.revokeObjectURL(formData.imagePreview);
                  }
                  const previewUrl = URL.createObjectURL(file);
                  setFormData({
                    ...formData,
                    imageFile: file,
                    imagePreview: previewUrl,
                  });
                }
              }}
            />
            <div className="product-form__file-placeholder">
              <span className="product-form__file-icon">📎</span>
              <span className="product-form__file-text">
                {formData.imageFile
                  ? `${translate("product.selectedFile")}: ${
                      formData.imageFile.name
                    }`
                  : translate("product.dragAndDropImage")}
              </span>
            </div>
          </div>
          {formData.image && !formData.imageFile && (
            <div className="product-form__current-image">
              <span>
                {translate("product.currentImage")}: {formData.image}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="product-form__variants">
        <h3>{translate("product.volumeAndPrice")}</h3>
        {formData.variants.map((variant, index) => (
          <div key={index} className="product-form__variant">
            <input
              className="product-form__input"
              type="number"
              min="0"
              value={variant.volume || ""}
              onChange={(e) => {
                const val = e.target.value;
                const num = val ? Number(val.replace(/^0+/, "")) || 0 : 0;
                handleVariantChange(index, "volume", num);
              }}
              placeholder={translate("product.volume")}
              required
            />
            <input
              className="product-form__input"
              type="number"
              min="0"
              value={variant.price || ""}
              onChange={(e) => {
                const val = e.target.value;
                const num = val ? Number(val.replace(/^0+/, "")) || 0 : 0;
                handleVariantChange(index, "price", num);
              }}
              placeholder={translate("product.price")}
              required
            />
            {formData.variants.length > 1 && (
              <button
                type="button"
                className="product-form__remove-variant"
                onClick={() => handleRemoveVariant(index)}
              >
                {translate("common.remove")}
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="product-form__add-variant"
          onClick={handleAddVariant}
        >
          {translate("product.addVariant")}
        </button>
      </div>

      <div className="product-form__actions">
        <button type="submit" className="product-form__submit">
          {product ? translate("common.save") : translate("common.create")}
        </button>
        <button
          type="button"
          className="product-form__cancel"
          onClick={onCancel}
        >
          {translate("common.cancel")}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
