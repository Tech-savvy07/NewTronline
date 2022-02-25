import { saveaddress, savebalance } from "../redux/action";

const url = "https://api.tronline.io/api";
// const url = "http://localhost:3004/api";
export const CONTRACT_ADDRESS = "TXW3Zht4JHynh7n9kwFZAM7jPwRkk3kqcJ";
// export const OWNER_ADDRESS = "TRmogeMRrX9TPzEBpFxSHjwUaenvFiWACB";
export let wallet_address = "";

export function getwalletAddress() {
  return (dispatch) => {
    if (window.tronWeb) {
      wallet_address = window.tronWeb.defaultAddress.base58;
      dispatch(saveaddress(wallet_address));
    }
  };
}
// getwalletAddress();

export function getBalance(address) {
  return (dispatch) => {
    window.tronWeb.trx
      .getBalance(address)
      .then((res) => {
        dispatch(savebalance(res / 1e6));
      })
      .catch((e) => {
        console.log(e);
      });
  };
}


export function checkJoinAddress(address) {
  return fetch(`${url}/is_user_exist`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      waddress: address,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}


export function checkLoginStatus(address) {
  return fetch(`${url}/check_login_status`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      waddress: address,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getRandomId(address) {
  return fetch(`${url}/get_randomId`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      waddress: address,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getPersonalDetails(id) {
  return fetch(`${url}/personal_details`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getCommunityDetails(id) {
  return fetch(`${url}/get_community_level_incomes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getDirects(id) {
  return fetch(`${url}/get_direct_member`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getAllUpDownIncome(id) {
  return fetch(`${url}/get_allupdown_income`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getWithdrawal(id) {
  return fetch(`${url}/getWithdrawal`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getVIPWithdrawal(id) {
  return fetch(`${url}/get_vip_income_withdraw`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getWithdrawCondition(id) {
  return fetch(`${url}/getWithdrawalConditions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getSponsorCountAPI(id) {
  return fetch(`${url}/getSponsorCount`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getInvestorId(id) {
  return fetch(`${url}/get_investorId`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      random_id: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getvipsponsorincome(id) {
  return fetch(`${url}/get_vip_sponsor_level_incomes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getVIP(id) {
  return fetch(`${url}/get_activated_vip`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getVIPCount() {
  return fetch(`${url}/get_total_vip_count`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getLevelIncomes(id, type) {
  return fetch(`${url}/get_upline_downline_income`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      investorId: id,
      income_type: type,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getSiteData() {
  return fetch(`${url}/getSiteData`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function getMyWalletIncome(address) {
  return fetch(`${url}/getWalletBalance`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      waddress: address,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function withdrawalRequest(withdrawal_amount, id, waddress) {
  return fetch(`${url}/kiosk_reqst`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      withdrawl_amount: withdrawal_amount,
      investorId: id,
      waddress: waddress,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function vipWithdrawalRequest1(withdrawal_amount, id, waddress) {
  return fetch(`${url}/xuqpa_reqst`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      withdrawl_amount: withdrawal_amount,
      investorId: id,
      waddress: waddress,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function vipWithdrawalRequest2(withdrawal_amount, id, waddress) {
  return fetch(`${url}/qmnps_reqst`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      withdrawl_amount: withdrawal_amount,
      investorId: id,
      waddress: waddress,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}

export function vipWithdrawalRequest3(withdrawal_amount, id, waddress) {
  return fetch(`${url}/spoef_reqst`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      withdrawl_amount: withdrawal_amount,
      investorId: id,
      waddress: waddress,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}