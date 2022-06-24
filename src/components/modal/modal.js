import { Modal, Button } from "antd";
import React, { useState, useContext, useEffect } from "react";
import { CloseCircleOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { ModalContent } from "../../content/modalContent";
import "./modal.css";
import { auth, db } from "../../base";
import { signOut } from "firebase/auth";
import { AuthContext } from "../../AuthProvider";
import { ref, onValue, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const FormModal = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formType, setFormType] = useState(ModalContent.signIn);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    clearForm();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    clearForm();
    formType === ModalContent.signIn
      ? setIsModalVisible(false)
      : setFormType(ModalContent.signIn);
  };

  const handleLinkClick = () => {
    clearForm();
    formType === ModalContent.signIn
      ? setFormType(ModalContent.signUp)
      : setFormType(ModalContent.signIn);
  };

  const handleUpdatePassClick = () => {
    clearForm();
    formType === ModalContent.signIn
      ? setFormType(ModalContent.updatePassword)
      : setFormType(ModalContent.signIn);
  };

  const clearForm = () => {
    const form = document.getElementById("my_form");
    form.reset();
    setErrorMessages("");
  };

  //================== Firebase Auth ============================
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (currentUser) {
      const starCountRef = ref(db, "users/" + currentUser.uid);
      // const starCountRef = userRef;
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          setUsername(data.email);
          setRole(data.role);
        }
      });
    }
  }, [currentUser]);

  const clickLogin = () => {
    if (currentUser) {
      signOut(auth);
      window.location.reload(false);
    } else {
      setFormType(ModalContent.signIn);
      showModal();
    }
  };

  //==========================================================

  const [errorMessages, setErrorMessages] = useState({});

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // const clearInputs = () => {};
  const handleSubmit = (e) => {
    //Prevent page reload
    e.preventDefault();

    if (formType === ModalContent.updatePassword) {
      //send an email to the user

      setFormType(ModalContent.updatePasswordSent);
      return;
    }

    if (formType === ModalContent.signUp) {
      function onRegister() {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            set(ref(db, "users/" + userCredential.user.uid), {
              email: email,
            });
            handleOk();
          })
          .catch((error) => {
            //console.log(error);
            sendErrorMessage("submit", error);
          });
      }
      onRegister();
    } else {
      function onRegister() {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            handleOk();
          })
          .catch((error) => sendErrorMessage("submit", error));
      }
      onRegister();
    }
  };

  const sendErrorMessage = (ename, error) => {
    if (ModalContent.FIREBASE_ERRORS.find(({ code }) => code === error.code)) {
      setErrorMessages({
        name: ename,
        message: ModalContent.FIREBASE_ERRORS.find(
          ({ code }) => code === error.code
        ).message,
      });
    } else {
      setErrorMessages({
        name: ename,
        message: error.code,
      });
    }
  };
  return (
    <>
      <div className="modal-container">
        <div className="userName">{currentUser ? role : ""}</div>
        <div className="userName">{currentUser ? username : ""}</div>
        <Button onClick={clickLogin}>
          <UserSwitchOutlined />
          {username !== "" ? "Sign out" : "Sign in"}
        </Button>
        <Modal
          title={formType.title}
          closeIcon={<CloseCircleOutlined />}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <form id="my_form" onSubmit={handleSubmit}>
            <div className="intro">{formType.intro}</div>
            {formType.emailInputVisible === false ? null : (
              <div className="input-container">
                <label>{ModalContent.email} </label>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ModalContent.emailPlaceholder}
                  required
                />
                {renderErrorMessage("email")}
              </div>
            )}

            {formType.passInputVisible === false ? null : (
              <div className="input-container">
                <label>{ModalContent.password}</label>
                <input
                  type="password"
                  name="pass"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={ModalContent.passwordPlaceholder}
                  required
                />
                {renderErrorMessage("pass")}
                {renderErrorMessage("submit")}
              </div>
            )}

            {formType.buttonVisible === false ? null : (
              <div className="button-container">
                <button type="submit">{formType.button}</button>
              </div>
            )}
          </form>

          <div className="footer-messages">
            <div>
              {formType.msg1}
              <a onClick={handleLinkClick}>{formType.link1}</a>
            </div>
            <div>
              <a onClick={handleUpdatePassClick}>{formType.link2}</a>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
