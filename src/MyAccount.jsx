import notSecure from "./assets/not-secure.jfif";
import "./App.css";

export default function MyAccount() {
  return (
    <div className="my-account-container">
      <h1>My Account</h1>
      <div className="my-account-image-wrapper">
        <img
          src={notSecure}
          alt="Not secure warning"
          className="my-account-image"
        />
      </div>

      <h2 className="my-account-bigtext">Our current setup...😬</h2>
    </div>
  );
}
