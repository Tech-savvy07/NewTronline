import {
  SET_ADDRESS,
  SET_LOGGEDIN,
  TOTAL_BALANCE,
  WALLET_INCOME,
  VIP_INCOME,
  UPLINE_INCOME,
  DOWNLINE_INCOME,
  SPONSOR_INCOME,
  VIP_INCOME_WITHDRAWN,
  COMMUNITY_DETAIL,
  DIRECT_MEMBER_DETAILS,
  WITHDRAWAL_HISTORY,
  REF_ID,
  VIP_WITHDRAWAL_HISTORY,
  ALL_UPLINE_DOWNLINE,
  INVESTOR_ID,
  SET_PERSONAL_DETAILS,
  SET_WITHDRAW_CONDITIONS,
  SET_SITE_DATA,
} from "./constant";

const initialState = {
  wallet_address: "",
  isLoggedIn: false,
  balance: 0,
  wallet_income: 0,
  vip_income: {},
  vip_income_withdrawn: 0,
  upline: 0,
  downline: 0,
  sponsor: 0,
  community: {
    leveldown: [],
    levelup: [],
    sponsor_level: [],
  },
  ref_id: 0,
  investor_id: "",
  mydirect: [],
  withdrawal_history: [],
  vip_withdrawal_history: [],
  all_up_down_income: [],
  siteData: '',
  personaldetails: {},
  withdraw_condition: {
    invest: 0,
    direct: 0,
  },
  sitedata_loading: false,
};

const appStore = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADDRESS:
      return {
        ...state,
        wallet_address: action.data,
      };

    case SET_SITE_DATA:
      return {
        ...state,
        siteData: action.data,
        sitedata_loading: true,
      };

    case SET_LOGGEDIN:
      return {
        ...state,
        isLoggedIn: action.data,
      };

    case TOTAL_BALANCE:
      return {
        ...state,
        balance: action.data,
      };
    case WALLET_INCOME:
      return {
        ...state,
        wallet_income: action.data,
      };
    case SET_PERSONAL_DETAILS:
      return {
        ...state,
        personaldetails: action.data,
      };
    case VIP_INCOME:
      return {
        ...state,
        vip_income: action.data,
      };
    case VIP_INCOME_WITHDRAWN:
      return {
        ...state,
        vip_income_withdrawn: action.data,
      };
    case UPLINE_INCOME:
      return {
        ...state,
        upline: action.data,
      };
    case DOWNLINE_INCOME:
      return {
        ...state,
        downline: action.data,
      };
    case SPONSOR_INCOME:
      return {
        ...state,
        sponsor: action.data,
      };
    case COMMUNITY_DETAIL:
      return {
        ...state,
        community: action.data,
      };
    case DIRECT_MEMBER_DETAILS:
      return {
        ...state,
        mydirect: action.data,
      };
    case WITHDRAWAL_HISTORY:
      return {
        ...state,
        withdrawal_history: action.data,
      };
    case VIP_WITHDRAWAL_HISTORY:
      return {
        ...state,
        vip_withdrawal_history: action.data,
      };
    case ALL_UPLINE_DOWNLINE:
      return {
        ...state,
        all_up_down_income: action.data,
      };
    case REF_ID:
      return {
        ...state,
        ref_id: action.data,
      };
    case INVESTOR_ID:
      return {
        ...state,
        investor_id: action.data,
      };
    case SET_WITHDRAW_CONDITIONS:
      return {
        ...state,
        withdraw_condition: action.data,
      };
    default:
      return state;
  }
};

export default appStore;
