// import { Modal, Button } from "antd";
// import { CloseCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
// import React, { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../../AuthProvider";
// import { db } from "../../base";
// import { ref, onValue, equalTo, get, query } from "firebase/database";
// import "./cartModal.css";
// import { Product } from "../product/product";

// export const CartForm = () => {
//   //   const [cartData, setCartData] = useState([]);
//   const { currentUser } = useContext(AuthContext);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [errorMessages, setErrorMessages] = useState({});

//   useEffect(() => {
//     if (currentUser) {
//       const cartRef = ref(db, "users/" + currentUser.uid + "/cart");
//       // const starCountRef = userRef;
//       onValue(cartRef, (snapshot) => {
//         if (snapshot.exists()) {
//           var data = snapshot.val();
//           //   setCartData(data.cart);
//         }
//       });
//     }
//   }, [currentUser]);

//   //   let arr = cartData.map((product, index) => {
//   //     get(query(ref(db, "products/"), equalTo(product[index])))
//   //       .then((snapshot) => {
//   //         let data = [];
//   //         snapshot.forEach((child) => {
//   //           data.push(child.val());
//   //         });
//   //         return data;
//   //       })
//   //       .catch((error) => {
//   //         console.error(error);
//   //       });
//   //   });

//   const showModal = () => {
//     setIsModalVisible(true);
//   };
//   const handleOk = () => {
//     clearForm();
//     setIsModalVisible(false);
//   };

//   const handleCancel = () => {
//     clearForm();
//     setIsModalVisible(false);
//   };
//   const clearForm = () => {
//     // const form = document.getElementById("my_form");
//     // form.reset();
//     setErrorMessages("");
//   };
//   return (
//     <>
//       <Button className="cartBtn" onClick={showModal}>
//         <ShoppingCartOutlined />
//         Cart
//       </Button>
//       <Modal
//         className="cartModal"
//         title="Cart"
//         centered={false}
//         closeIcon={<CloseCircleOutlined />}
//         visible={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <div className="products">
//           {arr.map((product, index) => {
//             return (
//               <div key={index}>
//                 <Product
//                   id={cartData[index]}
//                   name={product.name}
//                   price={product.price}
//                   description={product.description}
//                   category={product.category}
//                   quantity={product.quantity}
//                   imageURL={product.imageURL}
//                   createdDate={product.createdDate}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </Modal>
//     </>
//   );
// };
