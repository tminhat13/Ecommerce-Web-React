import "./App.css";
import "antd/dist/antd.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LinkedinOutlined,
  InstagramOutlined,
  Html5Outlined,
} from "@ant-design/icons";
import { AuthProvider } from "./AuthProvider";
import "./styles.css";
import { Home } from "./pages/home";
import { CreateProduct } from "./pages/createProduct";
import { ProductDetail } from "./pages/productDetail";
import { Header } from "./common/header/header";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/createproduct" element={<CreateProduct />} />
              <Route exact path="/productdetail" element={<ProductDetail />} />
            </Routes>
          </BrowserRouter>
        </div>

        <div className="app-footer">
          <LinkedinOutlined />
          <InstagramOutlined />
          <Html5Outlined />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
