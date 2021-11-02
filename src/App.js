import React from "react";
import "./App.css";
import firebaseConfig from "./config";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

function App() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [number, setNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [confirmation, setConfirmation] = React.useState(null);

  const sendOtp = () => {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    signInWithPhoneNumber(auth, number, recaptchaVerifier)
      .then((confirmation) => {
        setConfirmation(confirmation);
        alert("Otp send");
      })
      .catch((err) => {
        console.error("otp sending failed", err);
        alert("Otp sendig failed");
      });
  };

  const varifyOtp = () => {
    confirmation
      .confirm(otp)
      .then((result) => {
        console.log(result);
        alert("Your are authenticated");
      })
      .catch((error) => {
        console.error("otp varification failed", error);
        alert("invalid otp");
      });
  };
  if (auth.currentUser) return <h1>You are now authenticated</h1>;

  return (
    <div
      className="App"
      style={{
        paddingTop: "20%",
      }}
    >
      {confirmation ? (
        <input
          type="text"
          placeholder="enter otp"
          onChange={(ev) => setOtp(ev.target.value)}
        />
      ) : (
        <input
          type="text"
          placeholder="enter phone number"
          onChange={(ev) => setNumber(ev.target.value)}
        />
      )}

      <br />
      <br />
      <button
        type="button"
        onClick={() => (confirmation ? varifyOtp() : sendOtp())}
      >
        {" "}
        {confirmation ? "varify otp" : "send otp"}
      </button>
      <div
        id="recaptcha-container"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      ></div>
    </div>
  );
}

export default App;
