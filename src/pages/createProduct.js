import { ProductContent } from "../content/productContent";
import React, { useState } from "react";
import "./createProduct.css";
import { ref, set, push, remove } from "firebase/database";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "antd/lib/modal/Modal";
import { CloseCircleOutlined } from "@ant-design/icons";
import { db } from "../base";

export const CreateProduct = () => {
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");

  const [state, setState] = useState({
    name: location.state.props.name,
    description: location.state.props.description,
    category: location.state.props.category,
    price: location.state.props.price,
    quantity: location.state.props.quantity,
    imageURL: location.state.props.imageURL,
  });
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  function writeProductData(
    name,
    description,
    category,
    price,
    quantity,
    imageURL
  ) {
    let productRef;
    if (location.state.page === ProductContent.createProduct.page) {
      productRef = push(ref(db, "products/"));
    } else {
      productRef = ref(db, "products/" + location.state.props.id);
    }
    const dateNow = new Date();
    set(productRef, {
      name: name,
      description: description,
      category: category,
      price: parseFloat(price),
      quantity: quantity,
      imageURL: imageURL,
      createdAt: dateNow,
    })
      .then(() => {
        // Data saved successfully!
        showModal();
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(errorMessages + "test");
    if (errorMessages === "") {
      writeProductData(
        state.name,
        state.description,
        state.category,
        state.price,
        state.quantity,
        state.imageURL
      );
      // console.log(state);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    clearForm();
    handleCancel();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    const productRef = ref(db, "products/" + location.state.props.id);
    remove(productRef)
      .then(() => {
        // Data saved successfully!
        showModal();
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  };

  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const clearForm = () => {
    const form = document.getElementById("create_form");
    form.reset();
    setErrorMessages("");
    setState({
      name: "",
      description: "",
      category: ProductContent.categories[0].name,
      price: "",
      quantity: "",
      imageURL: "",
    });
  };

  return (
    <div className="create-container">
      <h1 className="create-header">
        {ProductContent[location.state.page].title}
      </h1>
      <div className="form-container">
        <form
          id="create_form"
          className="create-product"
          onSubmit={handleSubmit}
        >
          <div className="input-container">
            <label>{ProductContent[location.state.page].name} </label>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>{ProductContent[location.state.page].description} </label>
            <input
              type="text"
              name="description"
              value={state.description}
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label>{ProductContent[location.state.page].category} </label>
            <select
              name="category"
              value={state.category}
              onChange={handleChange}
            >
              {ProductContent.categories.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input-container">
            <label>{ProductContent[location.state.page].price} </label>
            <input
              type="price"
              name="price"
              value={state.price}
              min="0.00"
              max="99999"
              onChange={(e) => {
                handleChange(e);
                formatter.format(e.target.value) === "$" + NaN
                  ? setErrorMessages(
                      "Please enter number without special characters (, @ $ % ^ *)"
                    )
                  : setErrorMessages("");
              }}
              required
            />
          </div>
          <div className="input-container">
            <label>{ProductContent[location.state.page].quantity} </label>
            <input
              type="number"
              name="quantity"
              value={state.quantity}
              min="1"
              max="99999"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>{ProductContent[location.state.page].imgLink} </label>
            <div className="input-row-container">
              <div className="input-button-container">
                <input
                  name="imageURL"
                  value={state.imageURL}
                  placeholder="http://"
                  onChange={handleChange}
                  required
                ></input>
              </div>
              <img
                className="edit-product-img"
                alt="Preview!"
                src={
                  state.imageURL === ""
                    ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                    : state.imageURL
                }
              />
            </div>
          </div>
          <div className="error">{errorMessages}</div>
          <div type="submit" className="button-container">
            <button className="reg-button">
              {ProductContent[location.state.page].addBtn}
            </button>
          </div>
        </form>

        {location.state.page === ProductContent.createProduct.page ? null : (
          <div
            type="delete"
            className="button-container"
            onClick={handleDelete}
          >
            <button className="reg-button">Delete</button>
          </div>
        )}

        <div type="cancel" className="button-container" onClick={handleCancel}>
          <button className="reg-button">Cancel</button>
        </div>

        <Modal
          title={"Notification"}
          closeIcon={<CloseCircleOutlined />}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          cancelButtonProps={{ disabled: true }}
          bodyStyle={{ alignContent: "center" }}
        >
          {ProductContent[location.state.page].success}
        </Modal>
      </div>
    </div>
  );
};
