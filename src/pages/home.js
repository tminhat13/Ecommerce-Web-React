import "./home.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../components/product/product";
import { db } from "../base";
import { ref, query, orderByChild, get, onValue } from "firebase/database";
import { ProductContent } from "../content/productContent";
import { AuthContext } from "../AuthProvider";

export const Home = () => {
  const [role, setRole] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [sortState, setSortState] = useState("createdAt");
  const [arr, setArr] = useState([]);
  const [productKey, setProductKey] = useState([]);

  const orderedProductRef = query(
    ref(db, "products/"),
    orderByChild(sortState)
  );

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
  get(orderedProductRef)
    .then((snapshot) => {
      let data = [];
      let productKey = [];
      snapshot.forEach((child) => {
        data.push(child.val());
        productKey.push(child.key);
      });
      setArr(data);
      setProductKey(productKey);
    })
    .catch((error) => {
      console.error(error);
    });

  const navigate = useNavigate();
  const onClickCreateProduct = () => {
    // console.log(arr);
    // console.log(productKey);
    navigate("/createProduct", {
      state: {
        page: ProductContent.createProduct.page,
        props: {
          name: "",
          description: "",
          category: ProductContent.categories[0].name,
          price: "",
          quantity: "",
          imageURL: "",
        },
      },
    });
  };

  const onChange = (e) => {
    const val = e.target.value;
    e.preventDefault();
    setSortState(val);
  };

  const orderSettingArr = (map, orderArr) => {
    const arr = Array.from(map);
    if (orderArr === "price") {
      return arr;
    } else {
      return arr.reverse();
    }
  };

  return (
    <div className="home-container">
      <div className="top-container">
        <h1 className="home-title">Products</h1>
        <div className="top-tools">
          <select className="sort-select" value={sortState} onChange={onChange}>
            <option value="createdAt">Last added</option>
            <option value="price">Price: low to high</option>
            <option value="price/">Price: high to low</option>
          </select>
          {role === "admin" ? (
            <button
              type="addBtn"
              className="reg-button"
              onClick={onClickCreateProduct}
            >
              Add Product
            </button>
          ) : null}
        </div>
      </div>
      <div className="products">
        {orderSettingArr(
          arr.map((product, index) => {
            return (
              <div key={index}>
                <Product
                  id={productKey[index]}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  category={product.category}
                  quantity={product.quantity}
                  imageURL={product.imageURL}
                  createdDate={product.createdDate}
                />
              </div>
            );
          }),
          sortState
        )}
      </div>
    </div>
  );
};
