import "./product.css";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { ProductContent } from "../../content/productContent";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../../base";
import { InputNumber } from "antd";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export const Product = (props) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [cartQuantity, setCartQuantity] = useState(1);
  const { currentUser } = useContext(AuthContext);
  // const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const starCountRef = ref(db, "users/" + currentUser.uid);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          setRole(data.role);
          // setCartData(data.cart);
        }
      });
    }
  }, [currentUser]);

  const onClickProduct = () => {
    navigate("/productDetail", {
      state: {
        page: ProductContent.updateProduct.page,
        props: props,
      },
    });
  };
  const onClickEditProduct = () => {
    navigate("/createProduct", {
      state: {
        page: ProductContent.updateProduct.page,
        props: props,
      },
    });
  };
  const onClickAddToCart = () => {
    const cartRef = push(ref(db, "carts"));
    set(cartRef, {
      productID: props.id,
      userID: currentUser ? currentUser.uid : signAnonymously(),
      quantity: cartQuantity,
    })
      .then(() => {
        // Data saved successfully!
        // showModal();
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  };

  function signAnonymously() {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        // Signed in..
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            return user.uid;
            // ...
          } else {
            // User is signed out
            // ...
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }
  const onChangeQuantity = (value) => {
    setCartQuantity(value);
  };
  return (
    <div className="product-container">
      <div
        className="product-container"
        id="click-container"
        onClick={onClickProduct}
      >
        <div className="image-container">
          {
            <img
              className="home-product-img"
              src={
                props.imageURL === ""
                  ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                  : props.imageURL
              }
              alt={props.name}
            />
          }
        </div>
        <span className="product-name">{props.name}</span>
      </div>
      <div className="price">{formatter.format(props.price)}</div>
      <InputNumber
        controls={true}
        defaultValue={1}
        min={1}
        max={props.quantity}
        onChange={onChangeQuantity}
      />
      <div className="product-button-container">
        <button className="reg-button" onClick={onClickAddToCart}>
          Add to cart
        </button>
        {role === "admin" ? (
          <button
            className="reg-button"
            id="editButton"
            onClick={onClickEditProduct}
          >
            Edit product
          </button>
        ) : null}
      </div>
    </div>
  );
};
