import { ProductContent } from "../content/productContent";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, child, get, onValue } from "firebase/database";
import { db } from "../base";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider";
import "./productDetail.css";
import { InputNumber } from "antd";

export const ProductDetail = () => {
  const props = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [productData, setProductData] = useState([]);
  const dbRef = ref(db);

  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    if (currentUser) {
      const starCountRef = ref(db, "users/" + currentUser.uid);
      // const starCountRef = userRef;
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          setRole(data.role);
        }
      });
    }
  }, [currentUser]);

  const onClickEditProduct = () => {
    navigate("/createProduct", {
      state: {
        page: ProductContent.updateProduct.page,
        props: props.state.props,
      },
    });
  };

  get(child(dbRef, `products/${props.state.props.id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        setProductData(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <div className="home-container">
      <h1 className="product-detail-header">
        {ProductContent.productDetail.title}
      </h1>
      <div className="body-container">
        <div className="image-container">
          {
            <img
              className="home-product-img"
              src={
                productData.imgLink === ""
                  ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                  : productData.imageURL
              }
              alt={productData.name}
            />
          }
        </div>
        <div className="product-detail-info">
          <span className="product-category">{productData.category}</span>
          <span className="product-name" id="detail-name">
            {productData.name}
          </span>
          <span className="price">{formatter.format(productData.price)}</span>
          <span className="product-description">{productData.description}</span>
          <span className="quantity">
            {productData.quantity > 0
              ? productData.quantity + " in stock"
              : "Out of stock"}
          </span>
          <InputNumber
            controls={true}
            defaultValue={1}
            min={1}
            max={productData.quantity}
          />
          <div className="product-button-container">
            <button className="reg-button">Add to cart</button>
            {role === "admin" ? (
              <button className="reg-button" onClick={onClickEditProduct}>
                Edit the product
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
