import { Route, Routes } from "react-router-dom";
import { AppRoute } from "../../utils/consts";
import Main from "../Main/Main";
import HistoryRouter from "../utils-components/HistoryRoute/HistoryRoute";
import Layout from "../Layout/Layout";
import ScrollToTop from "../utils-components/ScrollToTop/ScrollToTop";
import browserHistory from "../../utils/browser-history";
import CatalogPage from "../CatalogPage/CatalogPage";
import NotFound from "../NotFound/NotFound";
import ItemPage from "../ItemPage/ItemPage";
import CartPage from "../CartPage/CartPage";
import { CartProvider } from "../../context/CartContext";
import { AdminProvider } from "../../context/AdminContext";
import LoginPage from "../Admin/LoginPage/LoginPage";
import AdminPanel from "../Admin/AdminPanel/AdminPanel";

function App() {
  return (
    <HistoryRouter history={browserHistory} basename={"/"}>
      <AdminProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path={AppRoute.Main} element={<Layout />}>
              <Route index element={<Main />} />
              <Route path={AppRoute.Catalog} element={<CatalogPage />} />
              <Route path={`${AppRoute.ItemRoutes}`} element={<ItemPage />} />
              <Route path={AppRoute.Cart} element={<CartPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin">
              <Route path="login" element={<LoginPage />} />
              <Route path="products" element={<AdminPanel />} />
            </Route>
          </Routes>
        </CartProvider>
      </AdminProvider>
    </HistoryRouter>
  );
}

export default App;
