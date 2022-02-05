const TronWeb = require("tronweb");
// const TronGrid = require("trongrid");
const fetch = require("cross-fetch");
const Registration = require("../models/registration");
const Deposit = require("../models/deposit");
const VipHistory = require("../models/vip_history");

// var CONTRACT = "TNzheE3zk4YqCLYT2sMQQUGHMuReAgxPVC";
var CONTRACT = "TXW3Zht4JHynh7n9kwFZAM7jPwRkk3kqcJ";

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
});

async function generateEventQuery(result) {
  try {
    let csql_arr = [];
    let sql_arr = [];
    if (result.length > 0) {
      let i = 0;
      while (result.length > i) {
        let index = Object.keys(result[i]["result_type"]);
        let event = result[i]["event_name"];
        if (event != "SentExtraEthDividends" && event != "MissedEthReceive") {
          let k = 0;
          let refId_from_reg;
          let obj = "";
          let trx_amt = 0;
          let invest = 0;
          let reinvest = 0;
          let investorId = 0;
          let sobj = "";
          let promoterId = 0;
          await Registration.findOne({}, "investorId")
            .sort({
              investorId: -1
            })
            .then((resp) => {
              if (resp) {
                promoterId = resp.investorId;
                investorId = promoterId + 1;
              }
            });
          while (index.length > k) {
            if (index[k].length > 2) {
              let value = result[i]["result"][index[k]];
              value =
                index[k] == "waddress" ?
                value.startsWith("0x") ?
                tronWeb.address.fromHex(value) :
                value :
                value;
              if (index[k] == "trx_amt") {
                trx_amt = value;
              }
              if (result[i]["event_name"] == "Registration") {
                if (index[k] == "referrerId") {
                  refId_from_reg = value;
                }
              }
              if (index[k] == "investorId") {
                investorId = value;
              }
              if (index[k] == "invest_type" && value == "REINVEST") {
                reinvest = 1;
              }
              if (index[k] == "invest_type" && value == "INVEST") {
                invest = 1;
              }
              obj += `"${index[k]}" : "${value}",`;
              // sobj += `"${index[k]}" : "${value}",`;
            }
            k++;
          }
          let ranodm_id = Math.floor(1000000 + Math.random() * 9000000);
          let transaction_id = result[i]["transaction_id"];
          let block_number = result[i]["block_number"];
          let timestamp = parseInt(result[i]["block_timestamp"] / 1000);
          obj += `"block_timestamp": "${timestamp}",`;
          obj += `"transaction_id" : "${transaction_id}",`;
          obj += `"block_number" : "${block_number}",`;

          if (result[i]["event_name"] == "Registration") {
            obj += `"investorId": "${investorId}",`;
            obj += `"up_level_paid" : "0",`;
            obj += `"promoterId": "${promoterId}",`;
          }
          obj += `"random_id" : "${ranodm_id}"`;
          sobj += `"transaction_id" : "${transaction_id}"`;
          // let txid1 = `"transaction_id" : "${transaction_id}"`;
          // sobj += `"block_number" : "${block_number}"`;

          if (result[i]["event_name"] == "Registration") {

            let select_qry = `{${sobj}}`;
            let insert_qry = `{${obj}}`;
            // console.log("select_qry", sobj);
            await Registration.findOne(JSON.parse(select_qry)).then(
              async (data) => {
                if (!data) {
                  await Registration.create(JSON.parse(insert_qry));
                  let reg_data = await Registration.count({
                    referrerId: refId_from_reg,
                  }).exec();
                  await Registration.updateOne({
                    investorId: refId_from_reg
                  }, {
                    $set: {
                      direct_member: Number(reg_data)
                    }
                  }).then(async () => {
                    let dep_status = 1;
                    const val_dep = await Deposit.findOne(JSON.parse(select_qry));
                    if (val_dep == null)
                      dep_status = 0;
                    console.log("TX ID 1::", trx_amt, invest, dep_status, val_dep)
                    if (dep_status === 0) {
                      if (invest == 1) {
                        let reg_datass = await Registration.findOne({
                          investorId: investorId,
                        }).exec();
                        if (trx_amt == 500000000) {
                          await Registration.updateOne({
                            investorId: investorId
                          }, {
                            $set: {
                              total_investment: Number(reg_datass.total_investment) + Number(trx_amt),
                            },
                          }).exec();
                        }
                      }
                      await Deposit.create(JSON.parse(insert_qry));
                    }
                  });
                }
              }
            );
          }
          if (result[i]["event_name"] == "Deposit") {
            let select_qry_dep = `{${sobj}}`;
            let insert_qry_dep = `{${obj}}`;
            let dep_status = 1;
            // console.log("select_qry_dep", obj);
            // console.log("insert_qry_dep", sobj);
            const val_dep = await Deposit.findOne(JSON.parse(select_qry_dep));
            if (val_dep == null) dep_status = 0;
            if (dep_status === 0) {
              if (reinvest == 1) {
                let reg_datas = await Registration.findOne({
                  investorId: investorId,
                }).exec();
                if (trx_amt == 2000000000) {
                  await Registration.updateOne({
                    investorId: investorId
                  }, {
                    $set: {
                      vip1: 1,
                      vip1_income: Number(4000000000),
                      total_investment: Number(reg_datas.total_investment ? reg_datas.total_investment : 0) + Number(trx_amt),
                      vip1_reinvest_count: Number(reg_datas.vip1_reinvest_count ? reg_datas.vip1_reinvest_count : 0) + 1
                    },
                  }).exec();
                  const vipHistory = new VipHistory({
                    investorId: investorId,
                    random_id: ranodm_id,
                    trx_amt: trx_amt,
                    invest_type: "reinvest",
                    vip: "VIP 1 Activity",
                  });
                  await vipHistory.save();
                } else if (trx_amt == 5000000000) {
                  await Registration.updateOne({
                    investorId: investorId
                  }, {
                    $set: {
                      vip2: 1,
                      vip2_income: Number(12500000000),
                      total_investment: Number(reg_datas.total_investment) + Number(trx_amt),
                      vip2_reinvest_count: Number(reg_datas.vip2_reinvest_count ? reg_datas.vip2_reinvest_count : 0) + 1
                    },
                  }).exec();
                  const vipHistory = new VipHistory({
                    investorId: investorId,
                    random_id: ranodm_id,
                    trx_amt: trx_amt,
                    invest_type: "reinvest",
                    vip: "VIP 2 Activity",
                  });
                  await vipHistory.save();
                } else if (trx_amt == 10000000000) {
                  await Registration.updateOne({
                    investorId: investorId
                  }, {
                    $set: {
                      vip3: 1,
                      vip3_income: Number(30000000000),
                      total_investment: Number(reg_datas.total_investment) + Number(trx_amt),
                      vip3_reinvest_count: Number(reg_datas.vip3_reinvest_count ? reg_datas.vip3_reinvest_count : 0) + 1
                    },
                  }).exec();
                  const vipHistory = new VipHistory({
                    investorId: investorId,
                    random_id: ranodm_id,
                    trx_amt: trx_amt,
                    invest_type: "reinvest",
                    vip: "VIP 3 Activity",
                  });
                  await vipHistory.save();
                }
              }
              const ins_qry = await Deposit.create(JSON.parse(insert_qry_dep));
            }
          }
          csql_arr.push(sobj);
          sql_arr.push(obj);
        }
        i++;
      }
    }
    return {
      csql: csql_arr,
      sql: sql_arr
    };
  } catch (e) {
    console.log("Index.js Error in generateEventQuery::", e);
  }
}

// exports.foreverExcute = async function foreverExcute(token) {
//   fetch(
//     `https://api.trongrid.io/event/contract/${CONTRACT}?onlyUnconfirmed=true&fingerprint=${token}&sort=block_timestamp&size=200`
//   )
//     .then((d) => d.json())
//     .then(async (result) => {
//       if (result.length > 0) {
//         let res = await generateEventQuery(result);
//       }
//       if (
//         result[result.length - 1]
//           ? result[result.length - 1]._fingerprint
//             ? result[result.length - 1]._fingerprint
//             : ""
//           : ""
//       )
//         foreverExcute(
//           result[result.length - 1]
//             ? result[result.length - 1]._fingerprint
//               ? result[result.length - 1]._fingerprint
//               : ""
//             : ""
//         );
//     })
//     .catch((e) => {
      // console.log(e);
//     });
// };

async function getLastEntryofRegistration() {
  const lastDatawa = await Registration.find({}).sort({
    investorId: -1
  });
  return Number(lastDatawa[0].block_timestamp) * 1000;
}

exports.foreverExcute = async function foreverExcute(
  mintimestamp,
  fingerprint = ""
) {
  if (!mintimestamp) {
    mintimestamp = await getLastEntryofRegistration();
    console.log("min timestamp::", mintimestamp);
  } else {
    console.log("puranka  timestamp::", mintimestamp, );
  }
  fetch(
      `https://api.trongrid.io/v1/contracts/${CONTRACT}/events?limit=100&min_timestamp=${mintimestamp}&onlyUnconfirmed=true&order_by=timestamp,asc&fingerprint=${fingerprint}`
    )
    .then((d) => d.json())
    .then(async (result) => {
      // console.log(result)
      if (result.data) {
        console.log(result.data);
        let res = await generateEventQuery(result.data);
      }
      if (result.meta.fingerprint ? true : false)
        // console.log("fingerprint::",result.meta["fingerprint"]);
        foreverExcute(mintimestamp, result.meta["fingerprint"]);
    })
    .catch((e) => {
      console.log(e);
    });
};