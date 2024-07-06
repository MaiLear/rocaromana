import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RiCloseCircleLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import FirebaseData from "@/utils/Firebase";
import { loginUser, signupLoaded, observeAuthState, selectUser } from "@/store/reducer/authSlice";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const LoginModal = ({ isOpen, onClose }) => {
  const { authentication } = FirebaseData();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    country: ""
  });

  const user = useSelector(selectUser);

  const onCloseLogin = () => {
    onClose();
    setIsRegistering(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = registrationData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(authentication, email, password);
      toast.success("Registration successful! We have sent you a link to verify your email");
      onCloseLogin();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    const { email, password } = registrationData; // Extrae email y password del objeto registrationData

    try {
      const response = await signInWithEmailAndPassword(authentication, email, password); // Intenta iniciar sesión

      toast.success("Login successful"); // Muestra mensaje de éxito
      onCloseLogin(); // Cierra el formulario o modal de inicio de sesión
    } catch (error) {
      console.error(error); // Imprime el error en la consola
      toast.error("Login failed"); // Muestra mensaje de error
    }
  };


  return (
    <>
      <Modal
        show={isOpen}
        onHide={onCloseLogin}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        className="login-modal"
      >
        <Modal.Header>
          <Modal.Title>{isRegistering ? "Sign Up" : "Sign In"}</Modal.Title>
          <RiCloseCircleLine className="close-icon" size={40} onClick={onCloseLogin} />
        </Modal.Header>
        <Modal.Body>
          {isRegistering ? (
            <form onSubmit={handleRegistration}>
              <div className="modal-body-heading">
                <h4>Register</h4>
                <span>Fill in the details to create an account</span>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={registrationData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registrationData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={registrationData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={registrationData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={registrationData.country}
                  onChange={handleInputChange}
                  placeholder="Enter your country"
                  required
                />
              </div>
              <div className="continue">
                <button type="submit" className="continue-button">Sign Up</button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin}>
                <div className="modal-body-heading">
                  <span>Enter your credentials to sign in</span>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registrationData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={registrationData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="continue">
                  <button type="submit" className="continue-button">Sign In</button>
                </div>
              </form>
              <div className="divider">
                <hr />
                <span>Or</span>
                <hr />
              </div>
              <div className="signup-link">
                <span>Don't have an account?</span>
                <button onClick={() => setIsRegistering(true)} className="continue-button">Sign up now</button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <span>
            By clicking Sign In or Sign Up, you agree to our{" "}
            <Link href="/terms-and-condition">Terms and Conditions</Link> and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </span>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          padding: 2rem;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          border-radius: 8px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-body {
          text-align: center;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .btn {
          display: block;
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }

        .btn-primary {
          background-color: #007bff;
          color: #fff;
          transition: background-color 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #0056b3;
        }

        .btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          color: #4285f4;
          border: 1px solid #4285f4;
        }

        .btn-google span {
          margin-left: 0.5rem;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }

        .divider hr {
          flex-grow: 1;
          border: none;
          border-top: 1px solid #ddd;
        }

        .divider span {
          margin: 0 0.5rem;
          color: #888;
        }

        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
        }

        .signup-link a {
          color: #007bff;
          text-decoration: none;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }

        .error-message {
          color: red;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default LoginModal;
