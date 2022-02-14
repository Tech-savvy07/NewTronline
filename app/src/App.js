import "./App.css";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import Home from "./pages/Home";
import AccountSummary from "./pages/AccountSummary";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getSiteData } from "./HelperFunction/script";
import { useDispatch } from "react-redux";
import { SET_SITE_DATA } from "./redux/constant";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    function getSiteDatas() {
      getSiteData()
        .then((result) => {
          if (result.status) {
            dispatch({ type: SET_SITE_DATA, data: result.data });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    getSiteDatas();
  }, []);

  const maintenance = true;
  return (
    <div className="App">
      {!maintenance ? (
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
            </Routes>
          </BrowserRouter>
        </div>
      )}
      <NotificationContainer />
    </div>
  );
}

export default App;
