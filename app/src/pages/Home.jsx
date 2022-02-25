import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import DataTableExtensions from 'react-data-table-component-extensions';
import CardIdinfo from "../Component/Card_Id_info";
import { BsTelegram } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import {
  checkJoinAddress,
  checkLoginStatus,
  CONTRACT_ADDRESS,
  getBalance,
  getCommunityDetails,
  getInvestorId,
  getLevelIncomes,
  getMyWalletIncome,
  getPersonalDetails,
  getRandomId,
  getVIP,
  getVIPCount,
  getwalletAddress,
  getWithdrawCondition,
  getSponsorCountAPI,
  vipWithdrawalRequest1,
  vipWithdrawalRequest2,
  vipWithdrawalRequest3,
  withdrawalRequest,
} from "../HelperFunction/script";
import {
  COMMUNITY_DETAIL,
  INVESTOR_ID,
  REF_ID,
  SET_ADDRESS,
  SET_LOGGEDIN,
  SET_PERSONAL_DETAILS,
  SET_WITHDRAW_CONDITIONS,
  SPONSOR_INCOME,
  UPLINE_INCOME,
  VIP_INCOME,
  VIP_INCOME_WITHDRAWN,
  WALLET_INCOME,
} from "../redux/constant";
import Counter from "../Component/Counter";

export default function Home() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.appStore);
  const [pkg500, setpkg500] = useState(0);
  const [getSponsorCount, setSponsorCount] = useState([]);
  const [joinAmount, setjoinAmount] = useState(0);
  const [vip1, setvip1] = useState(0);
  const [vip2, setvip2] = useState(0);
  const [vip3, setvip3] = useState(0);
  const [spinvipw1, setspinvipw1] = useState("");
  const [spinvipw2, setspinvipw2] = useState("");
  const [spinvipw3, setspinvipw3] = useState("");
  const [ref_id, setref_id] = useState(false);
  const [ref_id1, setref_id1] = useState(false);
  const [wtrxamt, setwtrxamt] = useState(0);
  const [rinvest, setrinvest] = useState(0);
  const [wamount, setwamount] = useState(0);
  const [spin, setspin] = useState("");
  const [spin2, setspin2] = useState("");
  const [vipdata, setvipdata] = useState("");
  const [count, setcount] = useState("");
  const [vipwithdraw_amt1, setvipwithdraw_amt1] = useState(0);
  const [vipwithdraw_amt2, setvipwithdraw_amt2] = useState(0);
  const [vipwithdraw_amt3, setvipwithdraw_amt3] = useState(0);
  const [vsi, setvsi] = useState(0);
  const [disable, setdisable] = useState(false);
  const [btndis, setbtndis] = useState({
    vip1: false,
    vip2: false,
    vip3: false,
  });
  const [sdata, setsdata] = useState("");

  const sponsorcolumn = [
    {
      name: "Level",
      selector: (row) => row.level,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "USER Id",
      selector: (row) => row.income_from_random_id,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "Sponsor Rewards",
      selector: (row) => row.total_income.toFixed(2),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Timestamp",
      selector: (row) => new Date(row.income_date).toLocaleString(),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "52px", // override the row height
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "500",
        textTransform: "uppercase",
        paddingLeft: "0 8px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        paddingLeft: "0 8px",
      },
    },
  };
  const ref_addr = window.location.href;
  const reflink = useRef();

  function walletIncome() {
    getMyWalletIncome(state.wallet_address)
      .then((res) => {
        dispatch({ type: WALLET_INCOME, data: res.data.data });
        dispatch({ type: VIP_INCOME, data: res.data.vip_incomes });
        dispatch({
          type: VIP_INCOME_WITHDRAWN,
          data: Number(res.data.withdraw_vip_income) / 1e6,
        });
      })

      .catch((e) => {
        console.log(e);
      });
  }

  function loginStatus() {
    checkLoginStatus(state.wallet_address)
      .then((res) => {
        dispatch({
          type: SET_LOGGEDIN,
          data: res.data === 1 ? true : false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function randomId() {
    getRandomId(state.wallet_address)
      .then((res) => {
        if (res.status) {
          dispatch({ type: REF_ID, data: res.data });
          setref_id(res.data);
        } else {
          dispatch({ type: REF_ID, data: res.data });
          setref_id(res.status);
        }
        // dispatch({ type: SET_LOGGEDIN, data: Number(res.data) });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function vipCount() {
    getVIPCount()
      .then((res) => {
        if (res.status) {
          setcount(res.totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getCurrentInvestorId() {
    getInvestorId(ref_id)
      .then((res) => {
        if (res) {
          dispatch({ type: INVESTOR_ID, data: res.data });
        } else {
          dispatch({ type: INVESTOR_ID, data: res.data });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function checkVIP() {
    getVIP(state.investor_id)
      .then((res) => {
        if (res.status) {
          setvipdata(res.data);
          setbtndis({
            vip1: res.data?.vip1 === 1 ? true : false,
            vip2: res.data?.vip2 === 1 ? true : false,
            vip3: res.data?.vip3 === 1 ? true : false,
          });
        } else {
          setvipdata("");
          setbtndis({
            vip1: false,
            vip2: false,
            vip3: false,
          });
        }
      })
      .catch((e) => {
        console.log("home vip fetch err:", e);
      });
  }

  function levelIncome(type) {
    if (state.investor_id) {
      getLevelIncomes(state.investor_id, type)
        .then((res) => {
          console.log("res of lelvel incomes: ", res);
          if (type === "SPONSORING INCOME") {
            dispatch({ type: SPONSOR_INCOME, data: res.data });
          }
          if (type === "COMMUNITY LEVELUP INCOME") {
            dispatch({ type: UPLINE_INCOME, data: res.data });
          }
          if (type === "VIP SPONSOR INCOME") {
            setvsi(res.data);
          }
        })
        .catch((e) => {
          console.log("home vip fetch err:", e);
        });
    }
  }

  function personalDetails() {
    if (!state.isLoggedIn) {
      dispatch({ type: SET_PERSONAL_DETAILS, data: {} });
    }
    getPersonalDetails(state.investor_id)
      .then((result) => {
        if (result.status) {
          dispatch({ type: SET_PERSONAL_DETAILS, data: result.data });
          // setpersonaldetails(state.personalDetails);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function communityDetails() {
    if (state.investor_id) {
      getCommunityDetails(state.investor_id)
        .then((result) => {

          if (result.status) {
            dispatch({
              type: COMMUNITY_DETAIL,
              data: {
                levelup: result.upline,
                leveldown: result.downline,
                sponsor_level: result.sponsor_level,
              },
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      dispatch({
        type: COMMUNITY_DETAIL,
        data: {
          levelup: [],
          leveldown: [],
          sponsor_level: [],
        },
      });
    }
  }

  function getWithdrawConditions() {
    getWithdrawCondition(state.investor_id)
      .then((result) => {
        if (result.status) {
          dispatch({ type: SET_WITHDRAW_CONDITIONS, data: result.data });
          // setpersonaldetails(state.personalDetails);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getSponsorCounts() {
    getSponsorCountAPI(state.investor_id)
      .then((result) => {
        if (result.status) {
          // dispatch({ type: SET_SPONSOR_COUNT, data: result });
          setSponsorCount(result);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    const url_address = window?.frames?.location?.href;
    const url = url_address ? url_address.split("?")[1] : "";
    if (url && url.length > 21) {
      dispatch({ type: SET_ADDRESS, data: url });
    } else {
      dispatch(getwalletAddress());
    }
    if (ref_addr.indexOf("ref_id=") !== -1) {
      const ref_ad = ref_addr.split("=");
      setref_id1(ref_ad[1]);
    }
    vipCount();
  }, []);

  useEffect(() => {
    if (state.wallet_address) {
      loginStatus();
      randomId();
      vipCount();
      checkVIP();
      walletIncome();
      personalDetails();
      getCurrentInvestorId();
      const url_address = window?.frames?.location?.href;
      const url = url_address ? url_address.split("?")[1] : "";
      if (url && url.length > 21) {
        dispatch({ type: SET_ADDRESS, data: url });
      } else {
        dispatch(getBalance(state.wallet_address));
      }
      getWithdrawConditions();
      // personalDetails();
      if (state.isLoggedIn) {
        // walletIncome();
        // getCurrentInvestorId();
        levelIncome("SPONSORING INCOME");
        // levelIncome("COMMUNITY LEVELDOWN INCOME");
        levelIncome("COMMUNITY LEVELUP INCOME");
        levelIncome("VIP SPONSOR INCOME");
      } else {
        dispatch({ type: SPONSOR_INCOME, data: 0 });
        dispatch({ type: UPLINE_INCOME, data: 0 });
      }
      // myvipsponsorincome();
    }
  }, [state.wallet_address]);

  useEffect(() => {
    getCurrentInvestorId();
    // personalDetails();
    // getWithdrawConditions();
    if (!state.isLoggedIn) {
      dispatch({ type: SPONSOR_INCOME, data: 0 });
      dispatch({ type: UPLINE_INCOME, data: 0 });
    }
  }, [ref_id]);

  useEffect(() => {
    personalDetails();
    // console.log("vcfvgbfviofuiofuifudifudifdufi fgbui li: ",state.investor_id);
    if (state.isLoggedIn) {
      walletIncome();
      communityDetails();
      getSponsorCounts();
      getWithdrawConditions();
      checkVIP();
      levelIncome("SPONSORING INCOME");
      levelIncome("COMMUNITY LEVELUP INCOME");
      levelIncome("VIP SPONSOR INCOME");
    } else {
      checkVIP();
      dispatch({ type: SPONSOR_INCOME, data: 0 });
      dispatch({ type: UPLINE_INCOME, data: 0 });
    }
  }, [state.investor_id]);

  useEffect(() => {
    if (!state.isLoggedIn) {
      personalDetails();
      checkVIP();
      dispatch({ type: SPONSOR_INCOME, data: 0 });
      dispatch({ type: UPLINE_INCOME, data: 0 });
      dispatch({
        type: COMMUNITY_DETAIL,
        data: {
          levelup: 0,
          leveldown: 0,
          sponsor_level: 0,
        },
      });
      dispatch({ type: WALLET_INCOME, data: 0 });
      dispatch({
        type: SET_WITHDRAW_CONDITIONS,
        data: { direct: 0, invest: 0 },
      });
      dispatch({ type: VIP_INCOME, data: 0 });
      dispatch({
        type: VIP_INCOME_WITHDRAWN,
        data: 0,
      });
    }
  }, [state.isLoggedIn]);

  useEffect(() => {
    const url_address = window?.frames?.location?.href;
    // console.log("url address: ", url_address.split("?"), window);
    const url = url_address ? url_address.split("?")[1] : "";
    if (url && url.length > 21) {
      dispatch({ type: SET_ADDRESS, data: url });
    }
    // else {
    //   const c = setInterval(() => {
    //     if (window?.tronWeb?.defaultAddress?.base58 && window.tronWeb) {
    //       if (state.wallet_address) {
    //         if (
    //           state.wallet_address.indexOf(
    //             window.tronWeb.defaultAddress.base58
    //           ) > -1
    //         ) {
    //           clearInterval(c);
    //         } else {
    //           dispatch(getwalletAddress());
    //         }
    //       } else {
    //         dispatch(getwalletAddress());
    //       }
    //     }
    //   }, 100);
    // }
  }, []);

  async function JoinNow() {
    window.contract = await window.tronWeb.contract().at(CONTRACT_ADDRESS);
    setspin("spinner-border spinner-border-sm");
    if (state.balance >= joinAmount + 25) {
      if (pkg500 === 500) {
        const trxAmt = joinAmount;
        const sponserAddress = ref_id1 ? ref_id1 : "";
        const data = {
          package: trxAmt,
          referral_id: sponserAddress,
          username: state.wallet_address,
        };
        var trxamount = data.package;
        var tronx = window.tronWeb;
        var addr = data.username;
        var result = await tronx.trx.getUnconfirmedBalance(addr);
        if (result <= 0) {
          setspin("");
          setdisable(false);
          NotificationManager.error("Insufficient TRX balance", "Tron Wallet");
        } else if (state.balance < parseInt(trxamount) + 15) {
          let a = parseInt(trxamount) + 15;
          setspin("");
          setdisable(false);
          NotificationManager.error(
            "Insufficient Balance " + a + " TRX.",
            "Tron Wallet"
          );
        } else if (state.balance >= trxamount + 15) {
          try {
            getInvestorId(ref_id1)
              .then(function (response) {
                let investor = response.data;
                if (response.status) {
                  checkJoinAddress(state.wallet_address).then((res) => {
                    if (!res.data) {
                      window.contract
                        .UserRegister(state.wallet_address, investor)
                        .send({
                          callValue: window.tronWeb.toSun(trxamount),
                          feeLimit: 50000000,
                        })
                        .then(function (tx) {
                          setspin("");
                          setdisable(false);
                          setjoinAmount(0);
                          setvip2(0);
                          setvip1(0);
                          setvip3(0);
                          NotificationManager.success(
                            "Transaction has been sent",
                            "Wait For Approval"
                          );
                        })
                        .catch((e) => {
                          setspin("");
                          setdisable(false);
                          NotificationManager.error(e);
                        });
                    } else {
                      setspin("");
                      setdisable(false);
                      NotificationManager.error(
                        "This wallet address already exist!!"
                      );
                    }
                  });
                } else {
                  setspin("");
                  setdisable(false);
                  NotificationManager.error("Invalid referral Id!!");
                }
              })
              .catch(function (error) {
                setspin("");
                setdisable(false);
                console.log(error);
              });
          } catch (error) {
            setspin("");
            setdisable(false);
            console.log("error=>", error);
          }
        } else {
          setspin("");
          setdisable(false);
          NotificationManager.error(
            "Insufficent TRX balance !!",
            "Gas Fees TRX required max(20 TRX)"
          );
        }
      } else {
        setspin("");
        setdisable(false);
        NotificationManager.info("Please Select 500 package (cumpalsary)");
      }
    } else {
      setspin("");
      setdisable(false);
      NotificationManager.info(
        "Insufficient TRX balance !!",
        "Max(20 TRX) extra for gas fees"
      );
    }
  }

  function withdraw() {
    if (Number(state.wallet_income) >= Number(wtrxamt)) {
      if (wtrxamt > 0) {
        if (wtrxamt >= 100) {
          setspin("spinner-border spinner-border-sm");
          getInvestorId(ref_id)
            .then((res) => {
              if (res.status) {
                withdrawalRequest(
                  wtrxamt,
                  Number(res.data),
                  state.wallet_address
                )
                  .then((res) => {
                    if (res.status === "success") {
                      setspin("");
                      NotificationManager.success(res.message);
                      setTimeout(() => {
                        walletIncome();
                        personalDetails();
                        const url_address = window?.frames?.location?.href;
                        // console.log("url address: ", url_address.split("?"), window);
                        const url = url_address
                          ? url_address.split("?")[1]
                          : "";
                        if (url && url.length > 21) {
                          dispatch({ type: SET_ADDRESS, data: url });
                        } else {
                          dispatch(getBalance(state.wallet_address));
                        }
                      }, 500);
                    } else {
                      setspin("");
                      NotificationManager.error(res.message);
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          NotificationManager.error("Min 100 TRX can be withrawal!");
        }
      } else {
        NotificationManager.error("Please Enter TRX Amount Greater Than 100!");
      }
    } else {
      NotificationManager.error("Insufficient Balance !!");
    }
  }

  function vip1withdraw() {
    if (Number(state?.vip_income?.vip1_wallet) >= Number(vipwithdraw_amt1)) {
      if (vipwithdraw_amt1 > 0) {
        if (vipwithdraw_amt1 >= 100) {
          setspinvipw1("spinner-border spinner-border-sm");
          vipWithdrawalRequest1(
            vipwithdraw_amt1,
            Number(state.investor_id),
            state.wallet_address
          )
            .then((res) => {
              if (res.status === "success") {
                setspinvipw1("");
                NotificationManager.success(res.message);
                setTimeout(() => {
                  walletIncome();
                  personalDetails();
                  const url_address = window?.frames?.location?.href;
                  // console.log("url address: ", url_address.split("?"), window);
                  const url = url_address ? url_address.split("?")[1] : "";
                  if (url && url.length > 21) {
                    dispatch({ type: SET_ADDRESS, data: url });
                  } else {
                    dispatch(getBalance(state.wallet_address));
                  }
                }, 500);
              } else {
                setspinvipw1("");
                NotificationManager.error(res.message);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          NotificationManager.error("Min 100 TRX can be withrawal!!");
        }
      } else {
        NotificationManager.error("Please Enter TRX Amount Greater Than 100!!");
      }
    } else {
      NotificationManager.error("Insufficient Balance !!");
    }
  }

  function vip2withdraw() {
    if (Number(state?.vip_income?.vip2_wallet) >= Number(vipwithdraw_amt2)) {
      if (vipwithdraw_amt2 > 0) {
        if (vipwithdraw_amt2 >= 100) {
          setspinvipw2("spinner-border spinner-border-sm");
          // if (res.status) {
          vipWithdrawalRequest2(
            vipwithdraw_amt2,
            Number(state.investor_id),
            state.wallet_address
          )
            .then((res) => {
              if (res.status === "success") {
                setspinvipw2("");
                NotificationManager.success(res.message);
                setTimeout(() => {
                  walletIncome();
                  personalDetails();
                  const url_address = window?.frames?.location?.href;
                  // console.log("url address: ", url_address.split("?"), window);
                  const url = url_address ? url_address.split("?")[1] : "";
                  if (url && url.length > 21) {
                    dispatch({ type: SET_ADDRESS, data: url });
                  } else {
                    dispatch(getBalance(state.wallet_address));
                  }
                }, 500);
              } else {
                setspinvipw2("");
                NotificationManager.error(res.message);
              }
            })
            .catch((e) => {
              console.log(e);
            });
          // }
        } else {
          NotificationManager.error("Min 100 TRX can be withrawal!!");
        }
      } else {
        NotificationManager.error("Please Enter TRX Amount Greater Than 100!");
      }
    } else {
      NotificationManager.error("Insufficient Balance !!");
    }
  }


  function vip3withdraw() {
    if (Number(state?.vip_income?.vip3_wallet) >= Number(vipwithdraw_amt3)) {
      if (vipwithdraw_amt3 > 0) {
        if (vipwithdraw_amt3 >= 100) {
          setspinvipw3("spinner-border spinner-border-sm");
          vipWithdrawalRequest3(
            vipwithdraw_amt3,
            Number(state.investor_id),
            state.wallet_address
          )
            .then((res) => {
              if (res.status === "success") {
                setspinvipw3("");
                NotificationManager.success(res.message);
                setTimeout(() => {
                  walletIncome();
                  personalDetails();
                  const url_address = window?.frames?.location?.href;
                  // console.log("url address: ", url_address.split("?"), window);
                  const url = url_address ? url_address.split("?")[1] : "";
                  if (url && url.length > 21) {
                    dispatch({ type: SET_ADDRESS, data: url });
                  } else {
                    dispatch(getBalance(state.wallet_address));
                  }
                }, 500);
              } else {
                setspinvipw3("");
                NotificationManager.error(res.message);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          NotificationManager.error("Min 100 TRX can be withrawal!");
        }
      } else {
        NotificationManager.error("Please Enter TRX Amount Greater Than 100!");
      }
    } else {
      NotificationManager.error("Insufficient Balance !!");
    }
  }

  async function retopup() {
    window.contract = await window.tronWeb.contract().at(CONTRACT_ADDRESS);
    if (joinAmount > 0) {
      if (state.balance >= joinAmount + 20) {
        if (state.wallet_address) {
          setspin2("spinner-border spinner-border-sm");
          try {
            getInvestorId(ref_id)
              .then(function (response) {
                // console.log("ressss", response);
                let investor = response.data;

                // var wallets = [];
                // var amount = [];

                // var main_amt = Number(joinAmount - 5) * 1000000;
                // var fee = 5 * 1000000;
                // wallets.push("TRmogeMRrX9TPzEBpFxSHjwUaenvFiWACB");
                // wallets.push("TEieHovVAm9acuckdagCi7jYPZHQiU9zQN");
                // amount = [main_amt, fee];
                // console.log("investor: ", investor);
                window.contract
                  .reinvest(state.wallet_address, investor)
                  .send({
                    callValue: window.tronWeb.toSun(joinAmount),
                    feeLimit: 50000000,
                  })
                  .then(function (txid) {
                    if (txid) {
                      setspin2("");
                      NotificationManager.success("Retopup successfull!!");
                    } else {
                      setspin2("");
                      NotificationManager.error("Transaction Id not found!!");
                    }
                  });
              })
              .catch(function (error) {
                console.log(error);
              });
          } catch (error) {
            console.log("error in retopup:=> ", error);
          }
        } else {
          setspin2("");
          NotificationManager.error("Wallet address not found !!");
        }
      } else {
        NotificationManager.error("Insufficient TRX Balance !!");
      }
    } else {
      NotificationManager.error("Please Select Deactive packages !!");
    }
  }


  return (
    <>
      <div className="container text-center mt-4">
        <div className="row">
          <div
            className="col-md-12 col-sm-12 col-lg-6"
            style={{ fontSize: "30px" }}
          >
            <img
              src="./img/tronline.png"
              className="img img-fluid"
              style={{ height: "176px" }}
            />
          </div>
          <div className="col-md-12 col-sm-12 col-lg-6 mt-5">
            <div className="row">
              <div
                className="col-md-6 col-lg-6 col-sm-12 asm d-flex justify-content-center"
                style={{ flexDirection: "column" }}
              >
                {/* <div className="form-group"> */}
                <Link
                  className="grad_btn btn-block text-light my-2"
                  style={{ padding: "10px 55px" }}
                  to="/accountsummary"
                >
                  Account Summary
                </Link>

                {/* </div> */}
              </div>
              <div
                className="col-md-6 col-lg-6 col-sm-12 d-flex justify-content-center"
                style={{ flexDirection: "column" }}
              >
                <a
                  href="/business_plan_tronline_2021.pdf"
                  className="grad_btn btn-block text-light my-2 "
                  style={{ padding: "10px 55px" }}
                  target="_blank"
                >
                  Download Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        state.siteData.promotion_marque_status == 1 ?
          <Marquee speed={130} pauseOnHover gradientWidth={0} className="text-light marquee-glow mb-5" style={{
            fontSize: '22px',
            background: '#ffffff33',
            boxShadow: '1px 1px 1px s'
          }} >
            {state.siteData.promotion_msg}
          </Marquee> : null
      }
      {
        // state.sitedata_loading ?

        //for Testing
        state.siteData.promotion_status == 0 ? null :
          <div className="container p-4" style={{
            background: "#8e8e8e54", boxShadow: "0px 0px 19px -6px",
            borderRadius: "4px"
          }}>
            <h2 className="text-center pb-2" style={{ fontFamily: "'Noto Sans', sans-serif" }} >-- Promotions --</h2>
            <div className="row">

              <div class="owl-carousel owl-theme">
                <div class="item"> <img
                  src="./img/banner_1.png"
                  className="img img-fluid"
                  style={{ width: "100%", height: "100%" }}
                /></div>
                <div class="item"> <img
                  src="./img/banner_2.jpg"
                  className="img img-fluid"
                  style={{ width: "100%", height: "100%" }}
                /></div>
                <div class="item"> <img
                  src="./img/banner_3.jpg"
                  className="img img-fluid"
                  style={{ width: "100%", height: "100%" }}
                /></div>
              </div>

            </div>

          </div>

      }



      <section className="banner_section pt_50 pb_50 mt-5">
        <div className="container">
          <div className="banner_text text-center middle_text">
            <h1 className="tirw">World's First 100% Tron Funding Program!</h1>
            <p>
              World's First Single line plan in which all the joining and Vip
              funds are stored in Smart Contract and members can withdraw their
              reward directly from Smart contract. 100% Distribution Plan. Now
              Get Rewarded from 20 people in community. Join VIP clubs and get
              your daily shares.
            </p>
          </div>
        </div>
      </section>

      <section className="pt_50 pb_50">
        <div
          className="row"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            className="col-sm-12"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="m-2"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                background: "linear-gradient(to right, #32defa, #6d2de7)",
                padding: "8px 15px",
                borderRadius: "10px",
              }}
            >
              <span className="mx-2">
                <BsTelegram size={24} color="white" />
              </span>
              <a
                href="https://t.me/Tronline_Admin"
                className="text-light"
                target="_blank"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>Join Us now</span>&nbsp;
            </h2>
            <div
              className="small_heading my-3"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h6>
                Wallet address -{" "}
                <span style={{ fontSize: "15px" }}>
                  {state.wallet_address
                    ? state.wallet_address.substr(0, 10) +
                    "......." +
                    state.wallet_address.substr(25)
                    : "Press Refresh for Wallet Address if Tronlink is connected"}
                </span>{" "}
              </h6>
              <button
                className="grad_btn btn-block mx-4"
                style={{ padding: "10px 15px" }}
                onClick={() => {
                  dispatch(getwalletAddress());
                  const url_address = window?.frames?.location?.href;
                  // console.log("url address: ", url_address.split("?"), window);
                  const url = url_address ? url_address.split("?")[1] : "";
                  if (url && url.length > 21) {
                    dispatch({ type: SET_ADDRESS, data: url });
                  } else {
                    dispatch(getBalance(state.wallet_address));
                  }
                  personalDetails();
                }}
              >
                Connect Wallet
              </button>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="text-light" style={{ margin: "10px 0px" }}>
                Wallet Balance: {" " + state.balance + " "}&nbsp;&nbsp; Selected
                Package {": " + joinAmount}
              </div>
              <div className="col-md-8 col-lg-8 col-sm-8">
                <div className="form-group">
                  {ref_id ? null : (
                    <input
                      className="cus_input"
                      type="text"
                      name="sponsor_address"
                      onChange={(e) => {
                        setref_id1(e.target.value);
                      }}
                      value={ref_id1 ? ref_id1 : ""}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-4">
                <div className="form-group">
                  {ref_id ? null : (
                    <button
                      className="grad_btn btn-block"
                      style={{ padding: "10px 95px" }}
                      onClick={() => {
                        if (state.wallet_address) {
                          if (ref_id1) {
                            setdisable(true);
                            JoinNow();
                          } else {
                            NotificationManager.info(
                              "Please provide Referral Id"
                            );
                          }
                        } else {
                          NotificationManager.info(
                            "Please Connect Tronlink Wallet!!"
                          );
                        }
                      }}
                      disabled={disable}
                    >
                      <span className={`${spin} mx-2`}></span>
                      Join Now
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              {ref_id ? (
                <>
                  <div className="col-lg-2 col-md-3 col-sm-12">
                    <button
                      className={`btn  my-2 ${vip1 === 2000 ? "bg-info" : ""} ${btndis?.vip1 ? "btn-success" : "btn-light"
                        }`}
                      style={{ width: "100%" }}
                      onClick={() => {
                        if (!btndis?.vip1) {
                          if (vip1 !== 2000 && joinAmount === 0) {
                            setvip1(2000);
                            setjoinAmount(joinAmount + 2000);
                          } else {
                            setvip3(0);
                            setvip1(2000);
                            setvip2(0);
                            setjoinAmount(2000);
                          }
                        }
                      }}
                      disabled={btndis.vip1}
                    >
                      2000 (VIP1)
                    </button>
                    {btndis?.vip1 ? (
                      <div
                        className="fs-6 fw-bold mx-3"
                        style={{ color: "#0fdd32" }}
                      >
                        Activated
                      </div>
                    ) : null}
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-12">
                    <button
                      className={`btn  my-2 ${vip2 === 5000 ? "bg-info" : ""} ${btndis?.vip2 ? "btn-success" : "btn-light"
                        }`}
                      style={{ width: "100%" }}
                      onClick={() => {
                        if (!btndis?.vip2) {
                          if (vip2 !== 5000 && joinAmount === 0) {
                            setvip2(5000);
                            setjoinAmount(joinAmount + 5000);
                          } else {
                            setvip3(0);
                            setvip1(0);
                            setvip2(5000);
                            setjoinAmount(5000);
                          }
                        }
                      }}
                      disabled={btndis.vip2}
                    >
                      5000 (VIP2)
                    </button>
                    {btndis?.vip2 ? (
                      <div
                        className="fs-6 fw-bold mx-3"
                        style={{ color: "#0fdd32" }}
                      >
                        Activated
                      </div>
                    ) : null}
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-12">
                    <button
                      className={`btn  my-2 ${vip3 === 10000 ? "bg-info" : ""
                        } ${btndis?.vip3 ? "btn-success" : "btn-light"}`}
                      style={{ width: "100%" }}
                      onClick={() => {
                        if (!btndis?.vip3) {
                          if (vip3 !== 10000 && joinAmount === 0) {
                            setvip3(10000);
                            setjoinAmount(joinAmount + 10000);
                          } else {
                            setvip3(10000);
                            setvip1(0);
                            setvip2(0);
                            setjoinAmount(10000);
                          }
                        }
                      }}
                      disabled={btndis.vip3}
                    >
                      10000 (VIP3)
                    </button>
                    {btndis?.vip3 ? (
                      <div
                        className="fs-6 fw-bold mx-3"
                        style={{ color: "#0fdd32" }}
                      >
                        Activated
                      </div>
                    ) : null}
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-12 mt-1">
                    <button
                      className="grad_btn btn-block d-flex"
                      style={{ padding: "10px 95px" }}
                      onClick={() => {
                        retopup();
                      }}
                    >
                      <span
                        className={`${spin2} mx-2`}
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span style={{ whiteSpace: "nowrap" }}> Top Up</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-lg-2 col-md-3 col-sm-12">
                    <button
                      className={`btn btn-light my-2 ${pkg500 === 500 ? "bg-info" : ""
                        }`}
                      style={{ width: "100%" }}
                      onClick={() => {
                        setpkg500(500);
                        setjoinAmount(500);
                      }}
                    >
                      500
                    </button>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-12">
                    <button
                      className={`btn btn-light my-2`}
                      style={{ width: "100%" }}
                      onClick={() => {
                        NotificationManager.info(
                          "To purchase VIP's first join with 500 package!!"
                        );
                      }}
                    >
                      2000 (VIP1)
                    </button>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-12">
                    <button
                      className={`btn btn-light my-2 
                      `}
                      style={{ width: "100%" }}
                      onClick={() => {
                        NotificationManager.info(
                          "To purchase VIP's first join with 500 package!!"
                        );
                      }}
                    >
                      5000 (VIP2)
                    </button>
                  </div>
                  <div className="col-lg-2 col-md-3 col-sm-12">
                    <button
                      className={`btn btn-light my-2`}
                      style={{ width: "100%" }}
                      onClick={() => {
                        NotificationManager.info(
                          "To purchase VIP's first join with 500 package!!"
                        );
                      }}
                    >
                      10000 (VIP3)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5">
        <div className="container">
          {/* Extra row */}
          {state.siteData.sponsor_count_promotion ? state.siteData.sponsor_count_promotion == 1 ?

            <>
              <div className="row cus_row">
                <div className="col-md-6 col-sm-12 col-12">
                  <div className="Personal_Details_inner">
                    <h3>Sponsor Count before 13th Feb</h3>
                    <div className="row cus_row">
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>500 TRX</h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.before_500 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>2000 TRX </h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.before_2000 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>5000 TRX </h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.before_5000 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>10000 TRX </h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.before_10000 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                    </div>

                    {/* <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.total_reinvest
                          ? (
                            Number(state.personaldetails.total_reinvest) / 1e6
                          ).toFixed(2) + " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"
                    : 0 + " TRX"}
                </h5> */}
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12">
                  <div className="Personal_Details_inner">
                    <h3>Sponsor Count after 14th Feb</h3>
                    <div className="row cus_row">
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>500 TRX</h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.after_500 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>2000 TRX </h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.after_2000 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>5000 TRX </h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.after_5000 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-12">
                        <div className="Personal_Details_inner" style={{
                          boxShadow: "rgb(0 0 0 / 54%) 4px 0px 33px 0px"
                        }}>
                          <h4>10000 TRX </h4>
                          <h5>
                            {getSponsorCount ?
                              getSponsorCount.status ?
                                getSponsorCount.after_10000 + " Member"
                                : 0
                              : 0}
                          </h5>
                        </div>
                      </div>
                    </div>

                    {/* <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.total_reinvest
                          ? (
                            Number(state.personaldetails.total_reinvest) / 1e6
                          ).toFixed(2) + " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"
                    : 0 + " TRX"}
                </h5> */}
                  </div>
                </div>
              </div>
            </> : null : null}

          <div className="row cus_row">
            <CardIdinfo
              CommunityLevel="Community Level Rewards"
              // UplineIncome="Income"
              trx={state.upline ? Number(state.upline).toFixed(2) : 0}
            />
            <CardIdinfo
              CommunityLevel="12 level Sponsor Rewards"
              // UplineIncome="Income"
              trx={state.sponsor ? Number(state.sponsor).toFixed(2) : 0}
            />
            <CardIdinfo
              CommunityLevel="Available Wallet Balance"
              // UplineIncome="Wallet Balance"
              trx={state.balance}
            />
          </div>

        </div>
      </div>

      <div className="container">
        <div
          className="row my-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="col-lg-3 col-md-3 col-sm-12 my-2">
            <div
              className="card bg-transparent "
              style={{
                width: "18rem",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="my-2">
                Total VIP1 :
                {count?.total_vip1 ? " " + count.total_vip1 : " " + 0} Member
              </span>

              <img src="./img/v1.png" className="card-img-top vimg" alt="..." />
              <div className="card-body bg-transparent">
                <p
                  className="text-light text-center my-1"
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  VIP 1{" "}
                  {vipdata?.vip1 === 1 ? (
                    <span className="text-success">&nbsp;(Activated)</span>
                  ) : (
                    <span className="text-danger">&nbsp;(Not active)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-12 my-2">
            <div
              className="card bg-transparent"
              style={{
                width: "18rem",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="my-2">
                Total VIP2 :
                {count?.total_vip2 ? " " + count.total_vip2 : " " + 0} Member
              </span>
              <img src="./img/v2.png" className="card-img-top vimg" alt="..." />
              <div className="card-body bg-transparent">
                <p
                  className="card-text text-light text-center my-1"
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  VIP 2
                  {vipdata?.vip2 === 1 ? (
                    <span className="text-success">&nbsp;(Activated)</span>
                  ) : (
                    <span className="text-danger">&nbsp;(Not active)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-12 my-2">
            <div
              className="card bg-transparent"
              style={{
                width: "18rem",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span className="my-2">
                Total VIP3 :
                {count?.total_vip3 ? " " + count.total_vip3 : " " + 0} Member
              </span>
              <img src="./img/v3.png" className="card-img-top vimg" alt="..." />
              <div className="card-body bg-transparent">
                <p
                  className="card-text text-light text-center my-1"
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                >
                  VIP 3
                  {vipdata?.vip3 === 1 ? (
                    <span className="text-success">&nbsp;(Activated)</span>
                  ) : (
                    <span className="text-danger">&nbsp;(Not active)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="pt_50 pb_50 mt-5">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>VIP REWARD DETAILS</span>
            </h2>
          </div>
          <div className="sm_container">
            {/* first row */}
            <div className="row">
              <div className="col-12 d-flex justify-content-center my-2">
                {/* <div className="rlt">
                        Time to release vip's income : <Counter time={new Date().getTime()} cb={() => { }} />
                     </div> */}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="vipbox myin">
                  <h4 className="viphead">VIP 1</h4>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Today total generated Rewards :{" "}
                    {count?.setting_data
                      ? count.setting_data?.vip_club
                        ? (
                          (Number(count.setting_data.vip_club) * 15) /
                          100 /
                          1e6
                        ).toFixed(2)
                        : 0
                      : 0}
                  </p>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Today Expected Rewards :
                    {count?.setting_data
                      ? count.setting_data?.vip_club && count.total_vip1
                        ? (
                          (Number(count.setting_data.vip_club) * 15) /
                          100 /
                          Number(count.total_vip1) /
                          1e6
                        ).toFixed(2)
                        : 0
                      : 0}
                  </p>
                  <h5
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Remaining VIP Rewards :
                    {state
                      ? state.investor_id > 0
                        ? state.personaldetails
                          ? state.personaldetails.remain_vip1_income
                            ? (
                              Number(
                                state.personaldetails.remain_vip1_income
                              ) / 1e6
                            ).toFixed(2) + " TRX"
                            : 0 + " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"}
                  </h5>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="vipbox myin">
                  <h4 className="viphead">VIP 2</h4>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Today total generated Rewards :
                    {count?.setting_data
                      ? count.setting_data?.vip_club
                        ? (
                          (Number(count.setting_data.vip_club) * 35) /
                          100 /
                          1e6
                        ).toFixed(2)
                        : 0
                      : 0}
                  </p>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Today Expected Rewards :
                    {count?.setting_data
                      ? count.setting_data?.vip_club && count.total_vip2
                        ? (
                          (Number(count.setting_data.vip_club) * 35) /
                          100 /
                          Number(count.total_vip2) /
                          1e6
                        ).toFixed(2)
                        : 0
                      : 0}
                  </p>
                  <h5
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Remaining VIP Rewards :
                    {state
                      ? state.investor_id > 0
                        ? state.personaldetails
                          ? state.personaldetails.remain_vip2_income
                            ? (
                              Number(
                                state.personaldetails.remain_vip2_income
                              ) / 1e6
                            ).toFixed(2) + " TRX"
                            : 0 + " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"}
                  </h5>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="vipbox myin">
                  <h4 className="viphead">VIP 3</h4>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Today total generated Rewards in Trx :
                    {count?.setting_data
                      ? count.setting_data?.vip_club
                        ? (
                          (Number(count.setting_data.vip_club) * 50) /
                          100 /
                          1e6
                        ).toFixed(2)
                        : 0
                      : 0}
                  </p>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Today Expected Rewards :
                    {count?.setting_data
                      ? count.setting_data.vip_club && count.total_vip3
                        ? (
                          (Number(count.setting_data.vip_club) * 50) /
                          100 /
                          Number(count.total_vip3) /
                          1e6
                        ).toFixed(2)
                        : 0
                      : 0}
                  </p>
                  <p
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      margin: "10px 0px",
                    }}
                  >
                    Remaining VIP Rewards :
                    {state
                      ? state.investor_id > 0
                        ? state.personaldetails
                          ? state.personaldetails.remain_vip3_income
                            ? (
                              Number(
                                state.personaldetails.remain_vip3_income
                              ) / 1e6
                            ).toFixed(2) + " TRX"
                            : 0 + " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt_50 pb_50 mt-5">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>COMMUNITY & SPONSOR REWARDS</span>
            </h2>
          </div>
          <div className="sm_container">
            {/* first row */}
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">TRX Rewards </label>
                  <input
                    className="cus_input"
                    type="text"
                    readOnly=""
                    defaultValue={
                      state
                        ? state.wallet_income > 0
                          ? Number(state.wallet_income).toFixed(2)
                          : 0
                        : 0
                    }
                    value={
                      state
                        ? state.wallet_income > 0
                          ? Number(state.wallet_income).toFixed(2)
                          : 0
                        : 0
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">
                    Withdraw Rewards Min : 100 TRX
                  </label>
                  <input
                    className="cus_input"
                    type="text"
                    value={wtrxamt}
                    onChange={(e) => {
                      setwtrxamt(e.target.value);
                      const w_amt = Number((e.target.value * 90) / 100);
                      const cd = state.withdraw_condition;
                      if (cd.invest > 0) {
                        if (cd.invest < 5000) {
                          setrinvest((w_amt * 60) / 100);
                          setwamount((w_amt * 40) / 100);
                        } else if (cd.invest >= 5000 && cd.invest < 20000) {
                          if (cd.direct >= 5) {
                            setrinvest((w_amt * 50) / 100);
                            setwamount((w_amt * 50) / 100);
                          } else {
                            setrinvest((w_amt * 60) / 100);
                            setwamount((w_amt * 40) / 100);
                          }
                        } else if (cd.invest >= 20000 && cd.invest < 50000) {
                          if (cd.direct >= 8) {
                            setrinvest((w_amt * 40) / 100);
                            setwamount((w_amt * 60) / 100);
                          } else if (cd.direct >= 5 && cd.direct < 8) {
                            setrinvest((w_amt * 50) / 100);
                            setwamount((w_amt * 50) / 100);
                          } else if (cd.direct < 5) {
                            setrinvest((w_amt * 60) / 100);
                            setwamount((w_amt * 40) / 100);
                          }
                        } else if (cd.invest >= 50000) {
                          if (cd.direct >= 10) {
                            setrinvest((w_amt * 30) / 100);
                            setwamount((w_amt * 70) / 100);
                          } else if (cd.direct >= 8 && cd.direct < 10) {
                            setrinvest((w_amt * 40) / 100);
                            setwamount((w_amt * 60) / 100);
                          } else if (cd.direct >= 5 && cd.direct < 8) {
                            setrinvest((w_amt * 50) / 100);
                            setwamount((w_amt * 50) / 100);
                          } else if (cd.direct < 5) {
                            setrinvest((w_amt * 60) / 100);
                            setwamount((w_amt * 40) / 100);
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {/* sec row */}
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">Trx ReBuy( Repurchase )</label>
                  <input
                    className="cus_input"
                    type="text"
                    readOnly=""
                    defaultValue={rinvest}
                    value={rinvest}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">Final Rewards to Wallet</label>
                  <input
                    className="cus_input"
                    type="text"
                    readOnly=""
                    defaultValue={wamount}
                    value={wamount}
                  />
                </div>
              </div>
            </div>
            {/* third row */}

            <div className="text-center">
              {spin === "" ? (
                <button
                  className="grad_btn"
                  type="button"
                  onClick={() => {
                    withdraw();
                  }}
                >
                  Withdraw
                </button>
              ) : (
                <span
                  className={`${spin}`}
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              <div className="text-info my-3 fs-6">
                Admin Fee 10% plus 7 TRX gas fee applicable from Withdrawal
                Amount
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt_50 pb_50 mt-5">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>VIP 1 REWARDS</span>
            </h2>
          </div>
          <div className="sm_container">
            {/* first row */}
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">TRX Rewards </label>
                  <input
                    className="cus_input"
                    type="text"
                    readOnly=""
                    defaultValue={
                      state
                        ? state.vip_income
                          ? state.vip_income.vip1_wallet > 0
                            ? (state.vip_income.vip1_wallet / 1e6).toFixed(2)
                            : 0
                          : 0
                        : 0
                    }
                    value={
                      state
                        ? state.vip_income
                          ? state.vip_income.vip1_wallet > 0
                            ? (state.vip_income.vip1_wallet / 1e6).toFixed(2)
                            : 0
                          : 0
                        : 0
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">
                    Withdraw Rewards Min : 100 TRX
                  </label>
                  <input
                    className="cus_input"
                    type="text"
                    onChange={(e) => {
                      setvipwithdraw_amt1(e.target.value);
                    }}
                    value={vipwithdraw_amt1}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              {spinvipw1 === "" ? (
                <button
                  className="grad_btn"
                  type="button"
                  onClick={() => {
                    const vi = state
                      ? state.vip_income
                        ? state.vip_income.vip1_wallet
                          ? Number(state.vip_income.vip1_wallet / 1e6)
                          : 0
                        : 0
                      : 0;
                    if (vi >= vipwithdraw_amt1) {
                      vip1withdraw();
                    } else {
                      NotificationManager.error(
                        "You have less VIP1 income",
                        "Insufficient"
                      );
                    }
                  }}
                >
                  Withdraw VIP1 Rewards in Trx
                </button>
              ) : (
                <span
                  className={`${spinvipw1}`}
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {/* <div className="text-info my-3 fs-6">
                Each VIP income will be distributed daily at UTC time 12:30 am.
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="pt_50 pb_50 mt-5">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>VIP 2 REWARDS</span>
            </h2>
          </div>
          <div className="sm_container">
            {/* first row */}
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">TRX Rewards </label>
                  <input
                    className="cus_input"
                    type="text"
                    readOnly=""
                    defaultValue={
                      state
                        ? state.vip_income
                          ? state.vip_income.vip2_wallet > 0
                            ? (state.vip_income.vip2_wallet / 1e6).toFixed(2)
                            : 0
                          : 0
                        : 0
                    }
                    value={
                      state
                        ? state.vip_income
                          ? state.vip_income.vip2_wallet > 0
                            ? (state.vip_income.vip2_wallet / 1e6).toFixed(2)
                            : 0
                          : 0
                        : 0
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">
                    Withdraw Rewards Min : 100 TRX
                  </label>
                  <input
                    className="cus_input"
                    type="text"
                    onChange={(e) => {
                      setvipwithdraw_amt2(e.target.value);
                    }}
                    value={vipwithdraw_amt2}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              {spinvipw2 === "" ? (
                <button
                  className="grad_btn"
                  type="button"
                  onClick={() => {
                    const vi = state
                      ? state.vip_income
                        ? state.vip_income.vip2_wallet
                          ? Number(state.vip_income.vip2_wallet / 1e6)
                          : 0
                        : 0
                      : 0;
                    if (vi >= vipwithdraw_amt2) {
                      vip2withdraw();
                    } else {
                      NotificationManager.error(
                        "You have less VIP2 income",
                        "Insufficient"
                      );
                    }
                  }}
                >
                  Withdraw VIP2 Rewards in Trx
                </button>
              ) : (
                <span
                  className={`${spinvipw2}`}
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {/* <div className="text-info my-3 fs-6">
                Each VIP income will be distributed daily at UTC time 12:30 am.
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="pt_50 pb_50 mt-5">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>VIP 3 REWARDS</span>
            </h2>
          </div>
          <div className="sm_container">
            {/* first row */}
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">TRX Rewards </label>
                  <input
                    className="cus_input"
                    type="text"
                    readOnly=""
                    defaultValue={
                      state
                        ? state.vip_income
                          ? state.vip_income.vip3_wallet > 0
                            ? (state.vip_income.vip3_wallet / 1e6).toFixed(2)
                            : 0
                          : 0
                        : 0
                    }
                    value={
                      state
                        ? state.vip_income
                          ? state.vip_income.vip3_wallet > 0
                            ? (state.vip_income.vip3_wallet / 1e6).toFixed(2)
                            : 0
                          : 0
                        : 0
                    }
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-group">
                  <label className="white_label">
                    Withdraw Rewards Min : 100 TRX
                  </label>
                  <input
                    className="cus_input"
                    type="text"
                    onChange={(e) => {
                      setvipwithdraw_amt3(e.target.value);
                    }}
                    value={vipwithdraw_amt3}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              {spinvipw3 === "" ? (
                <button
                  className="grad_btn"
                  type="button"
                  onClick={() => {
                    const vi = state
                      ? state.vip_income
                        ? state.vip_income.vip3_wallet
                          ? Number(state.vip_income.vip3_wallet / 1e6)
                          : 0
                        : 0
                      : 0;
                    if (vi >= vipwithdraw_amt3) {
                      vip3withdraw();
                    } else {
                      NotificationManager.error(
                        "You have less VIP3 income",
                        "Insufficient"
                      );
                    }
                  }}
                >
                  Withdraw VIP3 Rewards in Trx
                </button>
              ) : (
                <span
                  className={`${spinvipw3}`}
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              <div className="text-info my-3 fs-6">
                Each VIP income will be distributed daily at GMT time 07:00 am.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb_50">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>Personal Details</span>
            </h2>
          </div>
          <div className="row cus_row">
            <div className="col-md-4 col-sm-4 col-6">
              <div className="Personal_Details_inner Personal_bg">
                <h4>My TRX Buy</h4>
                <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.total_deposited
                          ? Number(Number(state.personaldetails.total_deposited) /
                            1e6).toFixed(2) +
                          " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"
                    : 0 + " TRX"}
                </h5>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-6">
              <div className="Personal_Details_inner">
                <h4>My Withdrawals</h4>
                <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.total_withdraw
                          ? Number(Number(state.personaldetails.total_withdraw)).toFixed(2) +
                          " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"
                    : 0 + " TRX"}
                </h5>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-12">
              <div className="Personal_Details_inner">
                <h4>Referred By</h4>
                <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.referred_by
                          ? state.personaldetails.referred_by
                          : "----"
                        : "----"
                      : "----"
                    : "----"}
                </h5>
              </div>
            </div>
          </div>

          {/* second row */}
          <div className="row cus_row">
            <div className="col-md-4 col-sm-4 col-6">
              <div className="Personal_Details_inner">
                <h4>My ReBuy</h4>
                <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.total_reinvest
                          ? (
                            Number(state.personaldetails.total_reinvest) / 1e6
                          ).toFixed(2) + " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"
                    : 0 + " TRX"}
                </h5>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-6">
              <div className="Personal_Details_inner">
                <h4>My Directs</h4>
                <h5>
                  {state.personaldetails
                    ? state.investor_id > 0
                      ? state.personaldetails.myCommunity
                        ? state.personaldetails.myCommunity
                        : 0
                      : 0
                    : 0}
                </h5>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-12">
              <div className="Personal_Details_inner">
                <h4>Total Community</h4>
                <h5>
                  {state.personaldetails
                    ? state.personaldetails.total_community
                      ? state.personaldetails.total_community
                      : 0
                    : 0}
                </h5>
              </div>
            </div>
          </div>
          {/* Third row */}
          <div className="row cus_row">
            <div className="col-md-6 col-sm-6 col-lg-6">
              <div className="Personal_Details_inner Personal_bg">
                <h4>My Income withdrawals</h4>
                <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.income_withdraw
                          ? Number(Number(state.personaldetails.income_withdraw)
                          ).toFixed(2) +
                          " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"
                    : 0 + " TRX"}
                </h5>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6">
              <div className="Personal_Details_inner">
                <h4>My VIP Withdrawals</h4>
                <h5>
                  {state
                    ? state.investor_id > 0
                      ? state.personaldetails
                        ? state.personaldetails.vip_withdraw
                          ? Number(Number(state.personaldetails.vip_withdraw)
                          ).toFixed(2) +
                          " TRX"
                          : 0 + " TRX"
                        : 0 + " TRX"
                      : 0 + " TRX"
                    : 0 + " TRX"}
                </h5>
              </div>
            </div>
          </div>

          <div className="row cus_row">
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="Personal_Details_inner">
                <h4>My VIP Sponsor Rewards</h4>
                <h5>{vsi ? vsi : 0}</h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="Personal_Details_inner">
                <h4>Total Community Deposits</h4>
                <h5>
                  {state.personaldetails
                    ? state.personaldetails.communitydeposit
                      ? (state.personaldetails.communitydeposit / 1e6).toFixed(
                        0
                      ) + " TRX"
                      : 0
                    : 0}
                </h5>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="Personal_Details_inner">
                <h4>Total Community withdrawn</h4>
                <h5>
                  {state.personaldetails
                    ? state.personaldetails.communitywithdrawal
                      ? state.personaldetails.communitywithdrawal.toFixed(0) +
                      " TRX"
                      : 0
                    : 0}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb_50">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>Community Level</span>
            </h2>
          </div>
          <div className="sm_container">
            <div className="table_inner">
              <div className="table-responsive gridtable">
                <table className="my-5" style={{ textAlign: "center" }}>
                  <thead style={{ textAlign: "center" }}>
                    <tr className="hrrr">
                      <th>Level</th>
                      <th>UserID</th>
                      <th>TRX Buy</th>
                      <th>VIP Buy</th>
                      <th>TRX Rebuy</th>
                    </tr>
                  </thead>
                  {state.community.leveldown.length !== 0 ? (
                    <tbody style={{ textAlign: "center", minWidth: "650px" }}>
                      {/* {state.community.levelup &&
                        state.community.levelup.length > 0
                        ? state.community.levelup.map((item, i) => {
                          return (
                            <tr
                              className={`${item.level === 0 ? "mrrr" : "trrr"
                                }`}
                            >
                              <td>LEVEL {item.level}</td>
                              <td>{item.id}</td>
                              <td>{item.deposit}</td>
                              <td>{item.reinvest}</td>
                              <td>{item.reinvestment}</td>
                            </tr>
                          );
                        })
                        : null} */}
                      {state.community.leveldown &&
                        state.community.leveldown.length > 0
                        ? state.community.leveldown.map((item, i) => {
                          return (
                            <tr className="trrr">
                              <td>
                                {item.level === 0
                                  ? "SELF"
                                  : "LEVEL" + item.level}
                              </td>
                              <td>{item.id}</td>
                              <td>{Number(item.deposit
                              ).toFixed(2)} TRX</td>
                              <td>{Number(item.reinvest
                              ).toFixed(2)} TRX</td>
                              <td>{Number(item.reinvestment
                              ).toFixed(2)} TRX</td>
                            </tr>
                          );
                        })
                        : null}
                    </tbody>
                  ) : (
                    <span className="m-5">
                      no data found for community level
                    </span>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb_50">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>SPONSOR Level</span>
            </h2>
          </div>
          <div className="sm_container">
            <div className="table_inner">
              <div className="table-responsive gridtable">
                <DataTableExtensions
                  export={false}
                  columns={sponsorcolumn}
                  data={
                    state.community.sponsor_level &&
                      state.community.sponsor_level.length !== 0
                      ? state.community.sponsor_level
                      : []
                  }
                  exportHeaders
                >
                  <DataTable
                    columns={sponsorcolumn}
                    data={
                      state.community.sponsor_level &&
                        state.community.sponsor_level.length !== 0
                        ? state.community.sponsor_level
                        : []
                    }
                    pagination
                    paginationPerPage={4}
                    progressPending={false}
                    customStyles={customStyles}
                  />
                </DataTableExtensions>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb_50">
        <div className="container">
          <div className="all_heading text-center">
            <h2>
              <span>Your Referral Link</span>
            </h2>
          </div>
          <div className="referal_inner text-center">
            {ref_id ? (
              <>
                <input
                  className="word-break refinpt"
                  ref={reflink}
                  defaultValue={`https://tronline.io?ref_id=${ref_id}`}
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                  readOnly={true}
                />
                <br />
                <button
                  title="copy Link"
                  className="grad_btn my-2"
                  onClick={() => {
                    reflink.current.select();
                    document.execCommand("copy");
                    // This is just personal preference.
                    // I prefer to not show the whole text area selected.
                  }}
                >
                  Copy Link
                </button>
              </>
            ) : (
              <h5>Join first, then you can get your referral id.</h5>
            )}
          </div>
        </div>
      </section>

      <div>
        <footer>
          <div class="container">
            <div class="mt_20">
              {/* <h2> TronLine</h2> */}
              <img
                src="./img/tronline.png"
                className="img img-fluid"
                style={{ height: "130px" }}
              />
            </div>

            <div
              className="row"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                className="col-sm-12"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  className="grad_btn px-0 text-light"
                  href="https://tronscan.org/#/contract/TXW3Zht4JHynh7n9kwFZAM7jPwRkk3kqcJ"
                  target="_blank"
                  style={{ borderRadius: "10px" }}
                >
                  <img
                    src="https://coin.top/production/logo/trx.png"
                    className="mx-2"
                    style={{ width: "13%" }}
                  />
                  Smart Contract info
                </a>
                <a
                  class="grad_btn my-3 mt-4"
                  href="https://support.tronline.io/"
                  target="_blank"
                >
                  <span className="mx-2">
                    <BiSupport size={24} color="white" />
                  </span>
                  Support
                </a>
                <div
                  className="m-2"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    background: "linear-gradient(to right, #32defa, #6d2de7)",
                    padding: "8px 15px",
                    borderRadius: "10px",
                  }}
                >
                  <span className="mx-2">
                    <BsTelegram size={24} color="white" />
                  </span>
                  <a
                    href="https://t.me/Tronline_Admin"
                    className="text-light"
                    target="_blank"
                  >
                    Telegram
                  </a>
                </div>
              </div>
            </div>
            <hr />
            <p>© 2021 TronLine | All Rights Reserved. </p>
          </div>
        </footer>
      </div>
    </>
  );
}
