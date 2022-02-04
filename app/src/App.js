import "./App.css";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import Home from "./pages/Home";
import AccountSummary from "./pages/AccountSummary";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const mt = false;
  return (
    <div className="App">
      {!mt ? (
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            background: "black",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "35px",
            }}
          >
            This site is under mentainance. we will be back soon.
          </div>
        </div>
      ) : (
        <div className="main">
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route
                exact
                path="/accountsummary"
                element={<AccountSummary />}
              />
              <Route
                exact
                path="/iframe"
                element={
                  <iframe
                    src="http://localhost:3000?TKij1kzMtCU2sSMzwJR3SteJQwcqXogKBD"
                    title="W3Schools Free Online Web Tutorials"
                    id="iframe_id"
                    style={{ height: "1000px", width: "100%" }}
                  ></iframe>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      )}
      <NotificationContainer />
    </div>
  );
}

export default App;
