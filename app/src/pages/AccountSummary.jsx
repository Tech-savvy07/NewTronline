import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

import {
  getInvestorId,
  getvipsponsorincome,
  getWithdrawal,
  getDirects,
  getVIPWithdrawal,
  getAllUpDownIncome,
} from "../HelperFunction/script";
import {
  ALL_UPLINE_DOWNLINE,
  DIRECT_MEMBER_DETAILS,
  INVESTOR_ID,
  VIP_WITHDRAWAL_HISTORY,
  WITHDRAWAL_HISTORY,
} from "../redux/constant";
import DataTable from "react-data-table-component";
import { BsTelegram } from "react-icons/bs";

export default function AccountSummary() {
  const state = useSelector((state) => state.appStore);
  const dispatch = useDispatch();
  const [myvipsponsor, setmyvipsponsor] = useState([]);

  const sponcercolumns = [
    {
      name: "User Id",
      selector: (row) => row.random_id,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "VIP CLUB Name",
      selector: (row) => row.income_type,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },

    {
      name: "Reward",
      selector: (row) => row.total_income + " TRX",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "Date",
      selector: (row) => new Date(row.income_date).toLocaleString(),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
  ];
  const vipwithdrawcolumns = [
    {
      name: "Transaction Id",
      selector: (row) => (
        <div>
          {row.transaction_id ? (
            <a
              href={`https://tronscan.io/#/transaction/${row.transaction_id}`}
              target="_blank"
            >
              {row.transaction_id}
            </a>
          ) : (
            <span class="badge bg-warning text-dark p-2 px-4" style={{ fontSize: "12px" }}>Pending</span>
          )}
        </div>
      ),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Reward",
      selector: (row) => row.total_amount,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "Withdrawal Type",
      selector: (row) => row.withdrawal_type,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Requested Time",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Approved At",
      selector: (row) => row.block_timestamp ? new Date(row.block_timestamp).toLocaleString() : "---",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
  ];
  const directcolumns = [
    {
      name: "Serial No.",
      selector: (row, index) => index + 1,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "UserId",
      selector: (row) => row.random_id,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "Total Trx Buy",
      selector: (row) => Number(row.total_investment / 1e6).toFixed(2) + " TRX",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
  ];
  const mywithdrawcolumns = [
    {
      name: "Transaction Id",
      selector: (row) => (
        <div>
          {row.transaction_id ? (
            <a
              href={`https://tronscan.io/#/transaction/${row.transaction_id}`}
              target="_blank"
            >
              {row.transaction_id}
            </a>
          ) : (
            <span class="badge bg-warning text-dark p-2 px-4" style={{ fontSize: "12px" }}>Pending</span>
          )}
        </div>
      ),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Total Amount",
      selector: (row) => Number(row.total_amount).toFixed(2) + " TRX",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "Withdrawal Amount",
      selector: (row) => Number(row.withdrawal_amount).toFixed(2) + " TRX",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "Reinvest Amount",
      selector: (row) => Number(row.reinvest_amount).toFixed(2) + " TRX",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },

    {
      name: "Requested Time",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Approved At",
      selector: (row) => row.transaction_id ? row.block_timestamp ? new Date(row.block_timestamp).toLocaleString() : "---" : "---",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
  ];
  const updowncoloumns = [
    {
      name: "LEVEL",
      selector: (row) => row.level,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "UserId",
      selector: (row) => row.income_from_random_id,
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    {
      name: "Reward",
      selector: (row) => Number(row.total_income).toFixed(2) + " TRX",
      sortable: true,
      style: {
        backgroundColor: "transparent",
        color: "rgba(63, 195, 128, 0.9)",
      },
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
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

  function myDirects() {
    console.log("mydirect Function", state.ref_id);
    if (state.investor_id) {
      getDirects(state.investor_id)
        .then((result) => {
          console.log("myDirect", result);
          if (result.status) {
            dispatch({
              type: DIRECT_MEMBER_DETAILS,
              data: result.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch({
        type: DIRECT_MEMBER_DETAILS,
        data: [],
      });
    }
  }

  function getWithdrawals() {
    console.log("getWithdrawal Function", state.ref_id);
    if (state.investor_id) {
      getWithdrawal(state.investor_id)
        .then((result) => {
          console.log("getWithdrawal", result);
          if (result.status) {
            dispatch({
              type: WITHDRAWAL_HISTORY,
              data: result.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch({
        type: WITHDRAWAL_HISTORY,
        data: [],
      });
    }
  }

  function getVIPWithdrawals() {
    console.log("getWithdrawal Function", state.ref_id);
    if (state.investor_id) {
      getVIPWithdrawal(state.investor_id)
        .then((result) => {
          console.log("getVIPWithdrawal", result);
          if (result.status) {
            dispatch({
              type: VIP_WITHDRAWAL_HISTORY,
              data: result.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch({
        type: VIP_WITHDRAWAL_HISTORY,
        data: [],
      });
    }
  }

  function myvipsponsorincome() {
    if (state.investor_id) {
      getvipsponsorincome(state.investor_id)
        .then((res) => {
          if (res.status) {
            setmyvipsponsor(res.vip_sponsor);
          }
        })
        .catch((e) => {
          console.log("home my vip sponsor fetch err:", e);
        });
    }
  }

  function getAll_UpDownIncome() {
    console.log("getWithdrawal Function", state.ref_id);
    if (state.investor_id) {
      getAllUpDownIncome(state.investor_id)
        .then((result) => {
          console.log("getAllUpDownIncome", result);
          if (result.status) {
            dispatch({
              type: ALL_UPLINE_DOWNLINE,
              data: result.data,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch({
        type: ALL_UPLINE_DOWNLINE,
        data: [],
      });
    }
  }

  function getCurrentInvestorId() {
    getInvestorId(state.ref_id)
      .then((res) => {
        if (res) {
          dispatch({ type: INVESTOR_ID, data: res.data });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (state.wallet_address) {
      myvipsponsorincome();
      myDirects();
      getWithdrawals();
      getVIPWithdrawals();
      getAll_UpDownIncome();
    }
  }, []);

  useEffect(() => {
    if (state.investor_id === "") {
      getCurrentInvestorId();
    }
    myvipsponsorincome();
    myDirects();
    getWithdrawals();
    getVIPWithdrawals();
    getAll_UpDownIncome();
  }, [state.ref_id]);

  useEffect(() => {
    if (state.investor_id === "") {
      getCurrentInvestorId();
    }
  }, [state.investor_id]);

  return (
    <>
      <div className="container text-center mt-4">
        <div className="row">
          <div className="col-md-4 col-sm-4"></div>
          <div
            className="col-md-4 col-sm-4 col-12"
            style={{ fontSize: "30px" }}
          >
            <img
              src="./img/tronline.png"
              className="img img-fluid"
              style={{ height: "176px" }}
            />
          </div>
          <div
            className="col-md-4 col-lg-4 col-sm-4 mh"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="form-group">
              <Link
                className="grad_btn btn-block text-light"
                style={{ padding: "10px 55px" }}
                to="/"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section class="pb_50">
        <div class="container">
          <div class="all_heading text-center">
            <h2>
              <span>My Community Rewards</span>
            </h2>
          </div>
          <div class="">
            <div class="table_inner">
              <DataTableExtensions
                export={false}
                columns={updowncoloumns}
                data={state.all_up_down_income}
                exportHeaders
              >
                <DataTable
                  columns={updowncoloumns}
                  // subHeaderComponent={filterUI}
                  data={state.all_up_down_income}
                  pagination
                  paginationPerPage={5}
                  progressPending={false}
                  customStyles={customStyles}
                />
              </DataTableExtensions>

            </div>
          </div>
        </div>
      </section>

      <section class="pb_50 mb-5">
        <div class="container">
          <div class="all_heading text-center">
            <h2>
              <span>My Directs</span>
            </h2>
          </div>
          <div class="">
            <div class="table_inner">
              <DataTableExtensions
                export={false}
                columns={directcolumns}
                data={state.mydirect}
                exportHeaders
              >
                <DataTable
                  columns={directcolumns}
                  data={state.mydirect}
                  pagination
                  paginationPerPage={3}
                  progressPending={false}
                  customStyles={customStyles}
                />
              </DataTableExtensions>

            </div>
          </div>
        </div>
      </section>

      <section class="pb_50">
        <div class="container">
          <div class="all_heading text-center">
            <h2>
              <span>My Withdraw </span>
            </h2>
          </div>
          <div class="">
            <div class="table_inner">
              <DataTableExtensions
                export={false}
                columns={mywithdrawcolumns}
                data={state.withdrawal_history}
                exportHeaders
              >
                <DataTable
                  columns={mywithdrawcolumns}
                  data={state.withdrawal_history}
                  pagination
                  paginationPerPage={3}
                  progressPending={false}
                  customStyles={customStyles}
                />
              </DataTableExtensions>
            </div>
          </div>
        </div>
      </section>

      <section class="pb_50">
        <div class="container">
          <div class="all_heading text-center">
            <h2>
              <span>VIP Sponsor Rewards</span>
            </h2>
          </div>
          <div class="">
            <div class="table_inner">
              <DataTableExtensions
                export={false}
                columns={sponcercolumns}
                data={myvipsponsor}
                exportHeaders
              >
                <DataTable
                  columns={sponcercolumns}
                  data={myvipsponsor}
                  pagination
                  paginationPerPage={3}
                  progressPending={false}
                  customStyles={customStyles}
                />
              </DataTableExtensions>
            </div>
          </div>
        </div>
      </section>

      <section class="pb_50 mb-5">
        <div class="container">
          <div class="all_heading text-center">
            <h2>
              <span>VIP Withdraw History</span>
            </h2>
          </div>
          <div class="">
            <div class="table_inner">
              <DataTableExtensions
                export={false}
                columns={vipwithdrawcolumns}
                data={state.vip_withdrawal_history}
                exportHeaders
              >
              <DataTable
                columns={vipwithdrawcolumns}
                data={state.vip_withdrawal_history}
                pagination
                paginationPerPage={3}
                progressPending={false}
                customStyles={customStyles}
              />
              </DataTableExtensions>
            </div>
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
                  className="grad_btn px-0 mb-2 text-light"
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
                {/* <a
                  class="grad_btn my-3 mt-4"
                  href="https://support.tronline.io/"
                  target="_blank"
                >
                  <span className="mx-2">
                    <BiSupport size={24} color="white" />
                  </span>
                  Support
                </a> */}
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
