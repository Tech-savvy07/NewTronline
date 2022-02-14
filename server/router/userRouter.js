const express = require("express");
const router = express.Router();

const {
  calculate_leveldown_income_from_deposit,
  calculate_levelup_income_from_deposit,
  calculate_all_income_from_deposit,
  vip1_income_withdrawal_request,
  vip2_income_withdrawal_request,
  check_request_callback_payment,
  vip3_income_withdrawal_request,
  get_vip_sponsor_level_incomes,
  get_community_level_incomes,
  get_upline_downline_income,
  send_all_vip_club_income,
  get_vip_income_withdraw,
  getWithdrawalConditions,
  cron_reinvest_income,
  cron_vip_club_income,
  get_allupdown_income,
  get_total_vip_count,
  withdrawal_request,
  check_login_status,
  get_direct_member,
  get_activated_vip,
  personal_details,
  getWalletBalance,
  getSponsorCount,
  delete_all_data,
  get_investorId,
  is_user_exist,
  getWithdrawal,
  get_randomId,
  get_last_Id,
  retopup,
} = require("../Controller/user");

// ------------------- End Cron Routers ---------------

router.get("/calculate_all_income_from_deposit", calculate_all_income_from_deposit);
router.get("/calculate_leveldown_income", calculate_leveldown_income_from_deposit);
router.get("/calculate_levelup_income", calculate_levelup_income_from_deposit);
router.get("/check_request_callback_payment", check_request_callback_payment);
// router.get("/calculate_level_income", calculate_level_income_from_deposit);
router.get("/send_all_vip_club_income", send_all_vip_club_income);
router.get("/cron_reinvest_income", cron_reinvest_income);
router.get("/cron_vip_club_income", cron_vip_club_income);
router.get("/delete_all_data", delete_all_data);

// ------------------- End Cron Routers ---------------

router.post("/get_vip_sponsor_level_incomes", get_vip_sponsor_level_incomes);
router.post("/get_community_level_incomes", get_community_level_incomes);
router.post("/get_upline_downline_income", get_upline_downline_income);
router.post("/getWithdrawalConditions", getWithdrawalConditions);
router.post("/get_vip_income_withdraw", get_vip_income_withdraw);
router.post("/xuqpa_reqst", vip1_income_withdrawal_request);
router.post("/qmnps_reqst", vip2_income_withdrawal_request);
router.post("/spoef_reqst", vip3_income_withdrawal_request);
router.post("/get_allupdown_income", get_allupdown_income);
router.post("/get_total_vip_count", get_total_vip_count);
router.post("/check_login_status", check_login_status);
router.post("/get_direct_member", get_direct_member);
router.post("/get_activated_vip", get_activated_vip);
router.post("/personal_details", personal_details);
router.post("/getWalletBalance", getWalletBalance);
router.post("/getSponsorCount", getSponsorCount);
router.post("/kiosk_reqst", withdrawal_request);
router.post("/get_investorId", get_investorId);
router.post("/getWithdrawal", getWithdrawal);
router.post("/is_user_exist", is_user_exist);
router.post("/get_randomId", get_randomId);
router.post("/get_last_Id", get_last_Id);
router.post("/retopup", retopup);

module.exports = router;