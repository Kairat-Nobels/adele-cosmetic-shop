import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./AdminPanel.scss";
import { useAdmin } from "../../../context/AdminContext";
import { TypeOfItem } from "../../../types/item";
import ProductForm from "../ProductForm/ProductForm";
import { useTranslation } from "../../../hooks/useTranslation";
/*eslint-disable */
interface UploadResponse {
  url: string;
  id: string;
}

interface ProductWithFile extends TypeOfItem {
  imageFile?: File;
}

const API_URL = "https://f449ec74485f3efc.mokky.dev/items";
const UPLOAD_URL = "https://f449ec74485f3efc.mokky.dev/uploads";

function AdminPanel() {
  const { translate } = useTranslation();
  const { isAuthenticated, logout } = useAdmin();
  const [products, setProducts] = useState<TypeOfItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TypeOfItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || translate("admin.fetchError"));
      }

      setProducts(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : translate("admin.fetchError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return (await response.json()) as UploadResponse;
    } catch (err) {
      throw new Error(
        `Failed to upload image: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (
    product: ProductWithFile
  ): Promise<{ url: string; id: string }> => {
    if (!product.imageFile) {
      return { url: product.image, id: product.imageId || "" };
    }

    // If editing and has existing image, delete it
    if (product.id && product.imageId) {
      const deleteResponse = await fetch(`${UPLOAD_URL}/${product.imageId}`, {
        method: "DELETE",
      });
      if (!deleteResponse.ok) {
        setError("Failed to delete old image");
      }
    }

    const uploadResult = await uploadImage(product.imageFile);
    return uploadResult;
  };

  const handleAddProduct = async (product: ProductWithFile) => {
    try {
      const { url: imageUrl, id: imageId } = await handleImageUpload(product);

      const productData: TypeOfItem = {
        ...product,
        image: imageUrl,
        imageId,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add product");
      }

      await fetchProducts();
      setIsAddingProduct(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  const handleEditProduct = async (product: ProductWithFile) => {
    try {
      const { url: imageUrl, id: imageId } = await handleImageUpload(product);

      const productData: TypeOfItem = {
        ...product,
        image: imageUrl,
        imageId,
      };

      const response = await fetch(`${API_URL}/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update product");
      }

      await fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    // This boolean simulates a confirmation dialog
    // In a real app, this would be replaced with a proper modal dialog component
    const deleteConfirmed = true; // Replace with actual confirmation dialog
    if (!deleteConfirmed) {
      return;
    }
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.imageId) {
        const deleteImageResponse = await fetch(
          `${UPLOAD_URL}/${product.imageId}`,
          {
            method: "DELETE",
          }
        );
        if (!deleteImageResponse.ok) {
          setError("Failed to delete product image");
        }
      }

      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete product");
      }

      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  if (isAddingProduct || editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        onCancel={() => {
          setIsAddingProduct(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1 className="admin-panel__title">
          {translate("admin.productManagement")}
        </h1>
        <button className="admin-panel__logout" onClick={logout}>
          {translate("common.logout")}
        </button>
      </div>

      {error && (
        <div className="admin-panel__error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <button
        className="admin-panel__add-product"
        onClick={() => setIsAddingProduct(true)}
        disabled={isUploading}
      >
        {translate("admin.addProduct")}
      </button>

      {isLoading || isUploading ? (
        <div className="admin-panel__loading">
          {isUploading
            ? translate("common.imageLoading")
            : translate("common.loading")}
        </div>
      ) : (
        <div className="admin-panel__products">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                className="product-card__image"
                src={product.image}
                alt={product.name}
              />
              <div className="product-card__content">
                <h3 className="product-card__title">{product.name}</h3>
                <p className="product-card__description">
                  {product.shortDescription}
                </p>
                <div className="product-card__variants">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="product-card__variant">
                      <span>
                        {variant.volume} {product.units}
                      </span>
                      <span>{variant.price} сом</span>
                    </div>
                  ))}
                </div>
                <div className="product-card__actions">
                  <button
                    className="product-card__edit"
                    onClick={() => setEditingProduct(product)}
                    disabled={isUploading}
                  >
                    {translate("admin.editProduct")}
                  </button>
                  <button
                    className="product-card__delete"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={isUploading}
                  >
                    {translate("admin.deleteProduct")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
