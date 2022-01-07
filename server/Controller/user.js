const Withdrawlhistory = require("../models/withdrawl_history");
const CONTRACT_ADDRESS = "TK3rBucxzpQk2BYMuAUwGc62mz3wYMf4wU";
const Transaction = require("../models/transtation_history");
const Withdrawal_lock = require("../models/withdrawal_lock");
const Registration = require("../models/registration");
const SiteData = require("../models/siteData");
const Deposit = require("../models/deposit");
const Setting = require("../models/setting");
const bodyParser = require("body-parser");
const fetch = require("cross-fetch");
const tronWeb = require("tronweb");
const express = require("express");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

async function withraw_lock(investorId, lock_status, count = 0, ip = "") {
  console.log("count::", count);
  if (lock_status == 3) {
    console.log("count in 3::", count);
    return await Withdrawal_lock.updateOne({
      investorId: investorId
    }, {
      count: count,
      ip_address: ip
    });
  } else if (lock_status == 1) {
    const doc = {
      investorId: investorId,
      ip_address: ip,
    };
    return await Withdrawal_lock.create(doc);
  } else {
    Withdrawal_lock.findOne({
        investorId: investorId
      })
      .then(async (res) => {
        if (res.count <= 2) {
          const query = {
            investorId: investorId,
          };
          return await Withdrawal_lock.deleteOne(query);
        }
      })
      .catch((err) => {
        return err;
      });
  }
}

function level_income_per(level) {
  if (level == 1) {
    return 15;
  } else if (level == 2) {
    return 10;
  } else if (level == 3) {
    return 2;
  } else if (level == 4) {
    return 2;
  } else if (level == 5) {
    return 5;
  } else if (level == 6) {
    return 3;
  } else if (level == 7) {
    return 3;
  }
}

// Node API
async function get_randomId(req, res) {
  try {
    const walletaddress = req.body.waddress;
    // const val = await Registration.find({})
    Registration.findOne({
      waddress: walletaddress,
    }).then((data, error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          data: "0",
        });
      }
      if (data) {
        return res.status(200).json({
          status: true,
          data: data.random_id,
        });
      } else {
        return res.status(200).json({
          status: false,
          data: 0,
        });
      }
    });
  } catch (error) {
    console.log("Error in Get id Record!", error.message);
  }
}

async function get_activated_vip(req, res) {
  try {
    const investorId = req.body.investorId;
    Registration.findOne({
      investorId: investorId,
    }).then((data, error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          data: "0",
        });
      }
      if (data) {
        return res.status(200).json({
          status: true,
          data: data,
        });
      } else {
        return res.status(200).json({
          status: false,
          data: 0,
        });
      }
    });
  } catch (error) {
    console.log("Error in Get id Record!", error.message);
  }
}

async function get_total_vip_count(req, res) {
  try {
    const vip1_count = await Registration.count({
      vip1: 1,
    }).exec();
    const vip2_count = await Registration.count({
      vip2: 1,
    }).exec();
    const vip3_count = await Registration.count({
      vip3: 1,
    }).exec();
    const setting_data = await Setting.findOne({}).exec();
    return res.status(200).json({
      status: true,
      totalCount: {
        total_vip1: vip1_count,
        total_vip2: vip2_count,
        total_vip3: vip3_count,
        setting_data: setting_data,
      },
    });
  } catch (error) {
    console.log("Error!", error.message);
  }
}

async function get_investorId(req, res) {
  try {
    const random_id = req.body.random_id;
    Registration.findOne({
      random_id: random_id,
    }).then((data, error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          data: "0",
        });
      }
      // console.log("jjhjh", data);
      if (data) {
        return res.status(200).json({
          status: true,
          data: data.investorId,
        });
      } else {
        return res.status(200).json({
          status: false,
          data: 0,
        });
      }
    });
  } catch (error) {
    console.log("Error in Get id Record!", error.message);
  }
}

async function get_direct_member(req, res) {
  try {
    const investorId = req.body.investorId;
    await Registration.find({
        referrerId: investorId,
      },
      "waddress investorId random_id total_investment createdAt"
    ).then((data, error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          data: "0",
        });
      }
      if (data) {
        return res.status(200).json({
          status: true,
          data: data,
        });
      } else {
        return res.status(200).json({
          status: false,
          data: 0,
        });
      }
    });
  } catch (error) {
    console.log("Error in Get id Record!", error.message);
  }
}

async function getWalletBalance(req, res) {
  try {
    const waddress = req.body.waddress ? req.body.waddress : "";
    await Registration.findOne({
      waddress: waddress,
    }).exec((error, data) => {
      if (error)
        return res.status(200).json({
          error,
        });
      if (data) {
        res.status(200).json({
          status: "success",
          data: {
            data: data.wallet_amount,
            vip_incomes: {
              vip1_wallet: data.vip1_wallet,
              vip2_wallet: data.vip2_wallet,
              vip3_wallet: data.vip3_wallet,
              vip_income: data.vip_income,
            },
            withdraw_vip_income: data.withdraw_vip_income,
          },
        });
      }
    });
    // console.log(reg);
  } catch (error) {
    console.log("Some Error Occurred", error.message);
  }
}

async function getWithdrawal(req, res) {
  try {
    const investorId = req.body.investorId ? req.body.investorId : "";
    const limit = req.body.limit ? req.body.limit : 100;
    let reg = await Withdrawlhistory.find({
        investorId: investorId,
        withdrawal_type: "INCOME WITHDRAWAL",
      })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .exec((error, data) => {
        if (error)
          return res.status(200).json({
            error,
          });
        if (data) {
          res.status(200).json({
            status: true,
            data: data,
          });
        }
      });
    // console.log(reg);
  } catch (error) {
    console.log("Some Error Occurred", error.message);
  }
}

async function getWithdrawalConditions(req, res) {
  try {
    const investorId = req.body.investorId;
    await Registration.findOne({
        investorId: investorId,
      },
      "investorId random_id total_investment direct_member"
    ).then((data, error) => {
      if (error) {
        return res.status(400).json({
          status: "error",
          data: "0",
        });
      }
      if (data) {
        return res.status(200).json({
          status: true,
          data: {
            direct: data.direct_member,
            invest: Number(data.total_investment) / 1e6,
          },
        });
      } else {
        return res.status(200).json({
          status: false,
          data: 0,
        });
      }
    });
  } catch (error) {
    console.log("Error in getWithdrawalConditions!", error.message);
  }
}

async function personal_details(req, res) {
  try {
    // console.log("hello kya yaar kya hai ye sab: ", "details");
    const investorId = req.body.investorId;
    const details = {};
    let totaldepositedtrx = 0;
    let communitydeposittrx = 0;
    let communitywithdrawaltrx = 0;
    let totalwithdrawaltrx = 0;
    let myCommunity = 0;
    let remain_vip1_income = 0;
    let remain_vip2_income = 0;
    let remain_vip3_income = 0;
    let random_id_of_refer = "--";
    let totalreinvesttrx = 0;

    if (investorId) {
      const refferal_id_data = await Registration.findOne({
        investorId: investorId,
      }).exec();
      random_id_of_refer = await Registration.findOne({
        investorId: refferal_id_data.referrerId,
      }).exec();

      remain_vip1_income = refferal_id_data.vip1_income;
      remain_vip2_income = refferal_id_data.vip2_income;
      remain_vip3_income = refferal_id_data.vip3_income;

      myCommunity = refferal_id_data.direct_member;
      const totaldeposit = await Deposit.aggregate([{
          $match: {
            investorId: investorId,
          },
        },
        {
          $group: {
            _id: null,
            sum: {
              $sum: "$trx_amt",
            },
          },
        },
      ]);
      totaldepositedtrx = totaldeposit[0] ? totaldeposit[0].sum : 0;

      const totalreinvest = await Deposit.aggregate([{
          $match: {
            investorId: investorId,
            invest_type: "REINVESTMENT",
          },
        },
        {
          $group: {
            _id: null,
            sum: {
              $sum: "$trx_amt",
            },
          },
        },
      ]);
      totalreinvesttrx = totalreinvest[0] ? totalreinvest[0].sum : 0;
      const totalwithdraw = await Withdrawlhistory.aggregate([{
          $match: {
            investorId: investorId,
          },
        },
        {
          $group: {
            _id: null,
            sum: {
              $sum: "$total_amount",
            },
          },
        },
      ]);
      totalwithdrawaltrx = totalwithdraw[0] ? totalwithdraw[0].sum : 0;
    }

    const totalCommunity = await Registration.count({}).exec();
    const communitydeposit = await Deposit.aggregate([{
      $group: {
        _id: null,
        sum: {
          $sum: "$trx_amt",
        },
      },
    }, ]);
    communitydeposittrx = communitydeposit[0] ? communitydeposit[0].sum : 0;

    const communitywithdrawal = await Withdrawlhistory.aggregate([{
        $match: {
          withdrawal_amount: {
            $gt: 0,
          },
        },
      },
      {
        $group: {
          _id: null,
          sum: {
            $sum: "$total_amount",
          },
        },
      },
    ]);
    communitywithdrawaltrx = communitywithdrawal[0] ?
      communitywithdrawal[0].sum :
      0;
    Object.assign(details, {
      referred_by: random_id_of_refer.random_id ?
        random_id_of_refer.random_id : "--",
      total_community: totalCommunity,
      remain_vip1_income: remain_vip1_income,
      remain_vip2_income: remain_vip2_income,
      remain_vip3_income: remain_vip3_income,
      myCommunity: myCommunity,
      communitydeposit: communitydeposittrx,
      communitywithdrawal: communitywithdrawaltrx + 400000,
      total_deposited: totaldepositedtrx,
      total_withdraw: totalwithdrawaltrx,
      total_reinvest: totalreinvesttrx,
    });
    // console.log("kya yaar kya hai ye sab: ", details);
    if (details) {
      return res.status(200).json({
        status: true,
        data: details,
      });
    } else {
      return res.status(400).json({
        status: false,
        data: "no data found",
      });
    }
  } catch (error) {
    console.log("Error from personal details (user.js): ", error);
  }
}

async function get_community_level_incomes(req, res) {
  const investorId = req.body.investorId ? req.body.investorId : 0;
  const limit = req.body.limit ? req.body.limit : 100;
  const regdata = await Registration.find({
      $and: [{
          investorId: {
            $gte: investorId,
          },
        },
        {
          investorId: {
            $lte: investorId + 20,
          },
        },
      ],
    },
    "random_id investorId"
  );
  const totalId = await Deposit.aggregate([{
      $match: {
        $and: [{
            investorId: {
              $gte: investorId,
            },
          },
          {
            investorId: {
              $lte: investorId + 20,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: {
          invest_type: "$invest_type",
          id: "$investorId",
        },
        sum: {
          $sum: "$trx_amt",
        },
      },
    },
  ]);
  let f_data = [];
  for (let i = 0; i < regdata.length; i++) {
    let d = totalId.filter((d1) => {
      if (investorId + i == d1._id.id) {
        return d1;
      }
    });
    let total = d.reduce(function (acc, obj) {
      return acc + obj.sum;
    }, 0);
    let reinvest = d.find((d2) => {
      if (d2._id.invest_type == "REINVEST") return d2;
    });
    let reinvestment = d.find((d2) => {
      if (d2._id.invest_type == "REINVESTMENT") return d2;
    });

    let obj = {
      level: i,
      deposit: total ? total / 1e6 : 0,
      reinvest: reinvest ? reinvest.sum / 1e6 : 0,
      reinvestment: reinvestment ? reinvestment.sum / 1e6 : 0,
      id: regdata.find((dt) => {
        if (dt.investorId == i + investorId) return dt;
      }).random_id,
    };
    f_data.push(obj);
  }
  let sponsor = await Transaction.find({
        investorId: investorId,
        income_type: "SPONSORING INCOME",
      },
      "investorId random_id income_from_random_id total_income income_type level"
    )
    .sort({
      createdAt: -1,
    })
    .limit(limit);
  return res.json({
    // _d,
    status: true,
    sponsor_level: sponsor,
    downline: f_data, //totalId.sort((a, b) => { a.id })
  });
}

async function get_community_level_incomes1(req, res) {
  const investorId = req.body.investorId ? req.body.investorId : 0;
  const totalId = await Deposit.find({}).exec();
  const totalreg = await Registration.find({}).exec();

  let i = 0,
    j = 0;
  k = 0;
  let promotorid = investorId;
  let promotorid1 = investorId;
  let last_investor = Number(totalreg[totalreg.length - 1].investorId);
  const upline = [];
  const downline = [];
  if (totalId && totalId.length > 0) {
    // upline income calculation
    while (promotorid >= 0 && i <= 20) {
      let totaltrx = 0;
      let totalreinvest = 0;
      let totalreinvestment = 0;
      totalId.map((item) => {
        if (item.investorId == promotorid) {
          totaltrx += item.trx_amt;
        }
      });
      totalId.map((item) => {
        if (item.investorId == promotorid && item.invest_type == "REINVEST") {
          totalreinvest += item.trx_amt;
        }
      });
      totalId.map((item) => {
        if (
          item.investorId == promotorid &&
          item.invest_type == "REINVESTMENT"
        ) {
          totalreinvestment += item.trx_amt;
        }
      });
      totalreg.map((item) => {
        if (item.investorId == promotorid) {
          upline.push({
            level: i,
            deposit: totaltrx / 1e6,
            reinvest: totalreinvest == 0 ? 0 : totalreinvest / 1e6,
            reinvestment: totalreinvestment == 0 ? 0 : totalreinvestment / 1e6,
            id: item.random_id,
          });
        }
      });
      promotorid--;
      i++;
    }
    while (promotorid1 != last_investor + 1 && j <= 20) {
      let totaltrx = 0;
      let totalreinvest = 0;
      let totalreinvestment = 0;
      totalId.map((item) => {
        if (item.investorId == promotorid1) {
          totaltrx += item.trx_amt;
        }
      });
      totalId.map((item) => {
        if (item.investorId == promotorid1 && item.invest_type == "REINVEST") {
          totalreinvest += item.trx_amt;
        }
      });
      totalId.map((item) => {
        if (
          item.investorId == promotorid1 &&
          item.invest_type == "REINVESTMENT"
        ) {
          totalreinvestment += item.trx_amt;
        }
      });
      totalreg.map((item) => {
        if (item.investorId == promotorid1) {
          downline.push({
            level: j,
            deposit: totaltrx / 1e6,
            reinvest: totalreinvest / 1e6,
            reinvestment: totalreinvestment / 1e6,
            id: item.random_id,
          });
        }
      });
      promotorid1++;
      j++;
    }
    let sponsor = await Transaction.aggregate([{
        $match: {
          investorId: investorId,
          income_type: "SPONSORING INCOME",
        },
      },
      {
        $lookup: {
          from: "Registration",
          localField: "income_from_id",
          foreignField: "investorId",
          as: "result",
        },
      },
      {
        $project: {
          random_id: 0,
        },
      },
    ]);
    if (downline.length > 0 || upline.length > 0 || sponsor.length > 0) {
      return res.status(200).json({
        status: true,
        upline: upline.reverse(),
        downline: downline,
        sponsor_level: sponsor,
      });
    } else {
      return res.status(400).json({
        status: false,
        upline: "something went wrong!",
      });
    }
  }
}

async function get_allupdown_income(req, res) {
  try {
    const investorId = req.body.investorId;
    const limit = req.body.limit ? req.body.limit : 100;
    let data = await Transaction.find({
        investorId: investorId,
        income_type: {
          $in: ["COMMUNITY LEVELDOWN INCOME", "COMMUNITY LEVELUP INCOME"],
        },
      })
      .sort({
        level: 1,
      })
      .limit(limit);
    if (data) {
      return res.status(200).json({
        status: true,
        data: data,
      });
    } else {
      return res.status(200).json({
        status: false,
        data: 0,
      });
    }
  } catch (error) {
    console.log("Error!", error.message);
  }
}

async function get_vip_sponsor_level_incomes(req, res) {
  try {
    const investorId = req.body.investorId;
    const limit = req.body.limit ? req.body.limit : 100;
    let vip_sponsor = await Transaction.find({
        investorId: investorId,
        income_type: {
          $in: [
            "VIP 1 SPONSOR INCOME",
            "VIP 2 SPONSOR INCOME",
            "VIP 3 SPONSOR INCOME",
          ],
        },
      })
      .limit(limit)
      .sort({
        createdAt: -1,
      });
    if (vip_sponsor) {
      return res.status(200).json({
        status: true,
        vip_sponsor: vip_sponsor,
      });
    } else {
      return res.status(200).json({
        status: false,
        data: 0,
      });
    }
  } catch (error) {
    console.log("Error!", error.message);
  }
}

async function get_vip_income_withdraw(req, res) {
  try {
    const investorId = req.body.investorId;
    const limit = req.body.limit ? req.body.limit : 100;
    let vip_sponsor = await Withdrawlhistory.find({
        investorId: investorId,
        withdrawal_type: {
          $in: ["VIP 1 WITHDRAWAL", "VIP 2 WITHDRAWAL", "VIP 3 WITHDRAWAL"],
        },
      })
      .limit(limit)
      .sort({
        createdAt: -1,
      });
    if (vip_sponsor) {
      return res.status(200).json({
        status: true,
        data: vip_sponsor,
      });
    } else {
      return res.status(200).json({
        status: false,
        data: 0,
      });
    }
  } catch (error) {
    console.log("Error!", error.message);
  }
}

async function get_upline_downline_income(req, res) {
  try {
    const investorId = req.body.investorId;
    const income_type = req.body.income_type;
    let result;
    if (income_type == "VIP SPONSOR INCOME") {
      result = await Transaction.find({
        investorId: investorId,
        income_type: {
          $in: [
            "VIP 1 SPONSOR INCOME",
            "VIP 2 SPONSOR INCOME",
            "VIP 3 SPONSOR INCOME",
          ],
        },
      }).exec();
    } else {
      result = await Transaction.find({
        investorId: investorId,
        income_type: income_type,
      }).exec();
    }
    let sum = 0;
    result.forEach(async (it) => {
      sum = sum + it.total_income;
    });
    return res.status(200).json({
      status: true,
      data: sum,
    });
  } catch (error) {
    console.log("Error in Get id Record!", error.message);
  }
}

async function check_login_status(req, res) {
  // console.log("called");
  try {
    const waddress = req.body.waddress ? req.body.waddress : "";
    const result = await Registration.findOne({
      waddress: waddress,
    }).then((resp, error) => {
      if (resp) {
        return res.json({
          data: 1,
        });
      } else {
        return res.json({
          data: 0,
        });
      }
    });
  } catch (error) {
    console.log("Error in Withdrawal ", error.message);
  }
}



async function is_user_exist(req, res) {
  // console.log("called");
  try {
    const waddress = req.body.waddress ? req.body.waddress : "";
    const result = await Registration.findOne({
      waddress: waddress,
    }).then((resp) => {
      if (resp) {
        return res.json({
          data: true,
        });
      } else {
        return res.json({
          data: false,
        });
      }
    });
  } catch (error) {
    console.log("Error in is_user_exist ", error.message);
  }
}


async function get_last_Id(req, res) {
  try {
    await Registration.findOne({})
      .sort({
        investorId: -1
      })
      .then((resp) => {
        if (resp) {
          return res.json({
            status: true,
            data: resp.investorId,
          });
        } else {
          return res.json({
            status: false,
            data: 0,
          });
        }
      });
  } catch (error) {
    console.log("Error in get_last_Id ", error.message);
  }
}

async function withdrawal_request(req, res) {
  try {
    const investorId = req.body.investorId;
    const waddress = req.body.waddress;
    const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
    // const ip = req.connection.remoteAddress;
    if (false) {
      // if (waddress && investorId) {
      const result = await Registration.findOne({
        investorId: investorId,
        waddress: waddress,
      }).exec();
      console.log("waddress", waddress, investorId);
      if (result) {
        const req_withdrawl = req.body.withdrawl_amount;
        const withdraw_locked = await Withdrawal_lock.findOne({
          investorId: investorId,
        }).exec();
        if (withdraw_locked) {
          const ct = Number(withdraw_locked.count);
          withraw_lock(investorId, 3, ct + 1, ip);
          return res.status(400).json({
            status: false,
            message: "Please wait for the confirmation of the previous withdrawal. If this continues contact support!",
          });
        } else {
          withraw_lock(investorId, 1, 0, ip)
            .then(async (data) => {
              if (data) {
                const siteData = await SiteData.findOne({}).exec();
                const privateKey = siteData.private_key;
                const total_investment = Number(result.total_investment) / 1e6;
                const direct_member = Number(result.direct_member);
                const wallet_balance = result.wallet_amount;
                let net_withdrawl = 0;
                let reinvest_amount = 0;
                const node = {
                  fullNode: "https://api.trongrid.io",
                  solidityNode: "https://api.trongrid.io",
                  privateKey,
                };
                const tronweb = new tronWeb(node);
                async function withdrawal(
                  waddress,
                  random_id,
                  withdrawal_amount,
                  admin_charge,
                  reinvest_amount,
                  total_amt
                ) {
                  try {
                    const contract = await tronweb
                      .contract()
                      .at(CONTRACT_ADDRESS);
                    const contract_balance = await contract.getBalance().call();
                    let checkres = [];

                    function checkwithdraw(txid) {
                      return new Promise((resolve, reject) => {
                        fetch(
                            `https://api.tronscan.org/api/transaction-info?hash=${txid}`
                          )
                          .then((res) => resolve(res.json()))
                          .catch((e) => {
                            reject(e);
                            console.log(e);
                          });
                      });
                    }
                    if (
                      Number(contract_balance._hex) / 1e6 >
                      Number(total_amt) + 100
                    ) {
                      const result1 = await contract
                        .withdrawIncome(
                          waddress,
                          (Number(withdrawal_amount) - 7) * 1e6,
                          Number(admin_charge) * 1e6,
                          total_amt,
                          Number(7) * 1e6
                        )
                        .send({
                          feelimit: 200000000,
                        });
                      var maxcount = 0;
                      var intervalobj = setInterval(async () => {
                        maxcount += 1;
                        checkres = await checkwithdraw(result1);
                        if ((checkres && checkres.block) || maxcount > 3) {
                          clearInterval(intervalobj);
                          if (
                            checkres &&
                            checkres.hash == result1 &&
                            checkres.contractRet &&
                            checkres.contractRet == "SUCCESS"
                          ) {
                            const withdrawlhistory = new Withdrawlhistory({
                              investorId: investorId,
                              random_id: random_id,
                              total_amount: total_amt,
                              withdrawal_amount: withdrawal_amount,
                              reinvest_amount: reinvest_amount,
                              block_timestamp: new Date().getTime(),
                              transaction_id: result1,
                              ip_address: ip,
                              withdrawal_type: "INCOME WITHDRAWAL",
                              payout_status: 1,
                            });
                            withdrawlhistory.save();
                            await withraw_lock(investorId, 0)
                              .then(() => {
                                return res.status(200).json({
                                  status: "success",
                                  message: "Withdrawal Successfully!",
                                });
                              })
                              .catch(() => {
                                return res.status(400).json({
                                  status: false,
                                  message: "Something went wrong, contact support team for more information!",
                                });
                              });
                          } else {
                            await Registration.updateOne({
                                investorId: investorId,
                              }, {
                                $set: {
                                  wallet_amount: Number(result.wallet_amount) +
                                    Number(req_withdrawl),
                                },
                              })
                              .then(async () => {
                                await withraw_lock(investorId, 0);
                                return res.status(400).json({
                                  status: false,
                                  message: "Withdrawal unsuccessful!",
                                });
                              })
                              .catch(() => {
                                return res.status(400).json({
                                  status: false,
                                  message: "Something went wrong, if wallet amount is deducted, contact support team!",
                                });
                              });
                          }
                        } else {
                          await Registration.updateOne({
                            investorId: investorId,
                          }, {
                            $set: {
                              wallet_amount: Number(result.wallet_amount) +
                                Number(req_withdrawl),
                            },
                          }).then(async () => {
                            await withraw_lock(investorId, 0);
                            return res.status(400).json({
                              status: "error",
                              message: "Withdrawal timeout!",
                            });
                          });
                        }
                      }, 10000);
                    } else {
                      await withraw_lock(investorId, 0);
                      return res.status(400).json({
                        status: "error",
                        message: "Insufficient balance in contract!",
                      });
                    }

                    // console.log('- Output:', receipt, '\n');
                    // return receipt;
                  } catch {
                    await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: false,
                      message: "Some error occurred. If it continues, contact support!",
                    });
                  }
                }
                // console.log(wallet_balance, req_withdrawl);
                if (wallet_balance >= req_withdrawl && req_withdrawl <= 10000) {
                  if (req_withdrawl >= 100) {
                    let req_withdrawl_after_admin_charge =
                      (req_withdrawl * 90) / 100;
                    let admin_charge = (req_withdrawl * 10) / 100;
                    if (total_investment < 5000) {
                      net_withdrawl =
                        (req_withdrawl_after_admin_charge * 40) / 100;
                      reinvest_amount =
                        (req_withdrawl_after_admin_charge * 60) / 100;
                    } else if (
                      total_investment >= 5000 &&
                      total_investment < 20000
                    ) {
                      if (direct_member >= 5) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 50) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 50) / 100;
                      } else {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 40) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 60) / 100;
                      }
                    } else if (
                      total_investment >= 20000 &&
                      total_investment < 50000
                    ) {
                      if (direct_member >= 8) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 60) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 40) / 100;
                      } else if (direct_member >= 5 && direct_member < 8) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 50) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 50) / 100;
                      } else if (direct_member < 5) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 40) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 60) / 100;
                      }
                    } else if (total_investment >= 50000) {
                      if (direct_member >= 10) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 70) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 30) / 100;
                      } else if (direct_member >= 8 && direct_member < 10) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 60) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 40) / 100;
                      } else if (direct_member >= 5 && direct_member < 8) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 50) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 50) / 100;
                      } else if (direct_member < 5) {
                        net_withdrawl =
                          (req_withdrawl_after_admin_charge * 40) / 100;
                        reinvest_amount =
                          (req_withdrawl_after_admin_charge * 60) / 100;
                      }
                    }
                    await Registration.updateOne({
                        investorId: investorId,
                      }, {
                        $set: {
                          wallet_amount: Number(result.wallet_amount) -
                            Number(req_withdrawl),
                        },
                      })
                      .then((res) => {
                        withdrawal(
                          result.waddress,
                          result.random_id,
                          net_withdrawl,
                          admin_charge,
                          reinvest_amount,
                          req_withdrawl
                        );
                      })
                      .catch(async (error) => {
                        await withraw_lock(investorId, 0);
                        return res.status(400).json({
                          status: false,
                          message: "Some error occurred. If it continues, contact support!",
                        });
                      });
                  } else {
                    // await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: "false",
                      message: "Withdrawal Amount should be greater than 100 TRX",
                    });
                  }
                } else {
                  // await withraw_lock(investorId, 0);
                  return res.status(400).json({
                    status: "false",
                    message: "Invalid Amount for Withdrawal Request",
                  });
                }
              } else {
                return res.status(200).json({
                  status: false,
                  message: "Something went wrong. If it continues, contact support!",
                });
              }
            })
            .catch((error) => {
              console.log("Error in withdrawal_request ", error.message);
              withraw_lock(investorId, 3, 3, ip);
              return res.status(400).json({
                status: false,
                message: "Something went wrong. If it continues, contact support!",
              });
            });
        }
      } else {
        return res.status(400).json({
          status: "false",
          message: "This wallet Address does not exist. Join First!",
        });
      }
    } else {
      return res.status(400).json({
        status: "false",
        message:
          // "Invalid Parameters!",
          "Due to safety measures Withdrawals are on hold for 7-8 hours!",
      });
    }
  } catch (error) {
    console.log("Error in Withdrawal Request ", error.message);
    return res.status(400).json({
      status: "false",
      message: "Something went wrong!",
    });
  }
}

async function vip1_income_withdrawal_request(req, res) {
  try {
    const investorId = req.body.investorId;
    const waddress = req.body.waddress;
    const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
    // const ip = req.connection.remoteAddress;
    if (false) {
      // if (waddress && investorId) {
      const it = await Registration.findOne({
        investorId: investorId,
        waddress: waddress,
      }).exec();
      if (it) {
        const req_withdrawl = req.body.withdrawl_amount;
        const withdraw_locked = await Withdrawal_lock.findOne({
          investorId: investorId,
        }).exec();
        if (withdraw_locked) {
          const ct = Number(withdraw_locked.count);
          withraw_lock(investorId, 3, ct + 1, ip);
          return res.status(400).json({
            status: false,
            message: "Please wait for the confirmation of the previous withdrawal. If this continues contact support!",
          });
        } else {
          withraw_lock(investorId, 1, 0, ip)
            .then(async (data) => {
              if (data) {
                const ref_data = await Registration.findOne({
                  investorId: it.referrerId,
                }).exec();
                const wallet_balance = it.vip1_wallet;
                const siteData = await SiteData.findOne({}).exec();
                const privateKey = siteData.private_key;
                const node = {
                  fullNode: "https://api.trongrid.io",
                  solidityNode: "https://api.trongrid.io",
                  privateKey,
                };
                const tronweb = new tronWeb(node);

                async function withdrawal(
                  investorId,
                  waddress,
                  random_id,
                  withdrawal_amount,
                  sponsorId,
                  sponsor_random_id,
                  sponsor_withdrawal_amount,
                  admin_charge,
                  withdraw_limit
                ) {
                  try {
                    const contract = await tronweb
                      .contract()
                      .at(CONTRACT_ADDRESS);
                    const contract_balance = await contract.getBalance().call();
                    let checkres = [];

                    function checkwithdraw(txid) {
                      return new Promise((resolve, reject) => {
                        fetch(
                            `https://api.tronscan.org/api/transaction-info?hash=${txid}`
                          )
                          .then((res) => resolve(res.json()))
                          .catch((e) => {
                            reject(e);
                            console.log(e);
                          });
                      });
                    }
                    if (
                      Number(contract_balance._hex) / 1e6 >
                      Number(withdraw_limit) + 100
                    ) {
                      const result2 = await contract
                        .withdrawIncome(
                          waddress,
                          (Number(withdrawal_amount) - 7) * 1e6,
                          Number(admin_charge) * 1e6,
                          withdraw_limit,
                          Number(7) * 1e6
                        )
                        .send({
                          feelimit: 200000000,
                        });

                      var maxcount = 0;
                      var intervalobj = setInterval(async () => {
                        maxcount = maxcount + 1;
                        checkres = await checkwithdraw(result2);
                        if ((checkres && checkres.block) || maxcount > 3) {
                          clearInterval(intervalobj);
                          if (
                            checkres &&
                            checkres.hash == result2 &&
                            checkres.contractRet &&
                            checkres.contractRet == "SUCCESS"
                          ) {
                            const withdrawlhistory = new Withdrawlhistory({
                              investorId: investorId,
                              random_id: random_id,
                              total_amount: withdraw_limit,
                              withdrawal_amount: withdrawal_amount,
                              block_timestamp: new Date().getTime(),
                              transaction_id: result2,
                              ip_address: ip,
                              payout_status: 1,
                              withdrawal_type: "VIP 1 WITHDRAWAL",
                            });
                            await withdrawlhistory.save();
                            const trancsaction = new Transaction({
                              investorId: sponsorId,
                              random_id: sponsor_random_id,
                              transaction_id: result2,
                              income_from_id: investorId,
                              income_from_random_id: random_id,
                              total_income: sponsor_withdrawal_amount,
                              income_type: "VIP 1 SPONSOR INCOME",
                              status: 1,
                              income_date: new Date().getTime(),
                            });
                            await trancsaction.save();
                            await Registration.updateOne({
                                investorId: sponsorId,
                              }, {
                                $set: {
                                  wallet_amount: Number(ref_data.wallet_amount) +
                                    Number(sponsor_withdrawal_amount),
                                },
                              })
                              .then(async (data) => {
                                if (data) {
                                  await withraw_lock(investorId, 0);
                                  return res.status(200).json({
                                    status: "success",
                                    message: "Withdrawal Successful!",
                                  });
                                }
                              })
                              .catch((error) => {
                                console.log(
                                  "Error in vip1_income_withdrawal_request ",
                                  error.message
                                );
                                return res.status(400).json({
                                  status: false,
                                  message: "Some error occurred. If it continues, contact support!",
                                });
                              });
                          } else {
                            const withdrawlhistory = new Withdrawlhistory({
                              investorId: investorId,
                              random_id: random_id,
                              total_amount: withdraw_limit,
                              withdrawal_amount: withdrawal_amount,
                              block_timestamp: new Date().getTime(),
                              transaction_id: result2,
                              ip_address: ip,
                              payout_status: 0,
                              withdrawal_type: "VIP 1 WITHDRAWAL",
                            });
                            await withdrawlhistory.save();
                            await withraw_lock(investorId, 0);
                            return res.status(400).json({
                              status: false,
                              message: "Withdrawal unsuccessful!",
                            });
                          }
                        } else {
                          await withraw_lock(investorId, 0);
                          return res.status(400).json({
                            status: "error",
                            message: "Withdrawal timeout!",
                          });
                        }
                      }, 10000);
                    } else {
                      await withraw_lock(investorId, 0);
                      return res.status(400).json({
                        status: "false",
                        message: "Insufficient balance in Contract!",
                      });
                    }
                  } catch (error) {
                    await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: "false",
                      message: "Some error occurred!",
                    });
                  }
                }

                if (Number(wallet_balance) / 1e6 >= req_withdrawl && req_withdrawl <= 10000) {
                  if (req_withdrawl >= 100) {
                    await Registration.updateOne({
                        investorId: investorId,
                      }, {
                        $set: {
                          vip1_wallet: Number(it.vip1_wallet) -
                            Number(req_withdrawl) * 1e6,
                          withdraw_vip_income: Number(it.withdraw_vip_income) +
                            Number(req_withdrawl) * 1e6,
                        },
                      })
                      .then(() => {
                        withdrawal(
                          investorId,
                          it.waddress,
                          it.random_id,
                          (req_withdrawl * 90) / 100,
                          ref_data.investorId,
                          ref_data.random_id,
                          (req_withdrawl * 2.5) / 100,
                          (req_withdrawl * 7.5) / 100,
                          req_withdrawl
                        );
                      })
                      .catch(async (error) => {
                        await withraw_lock(investorId, 0);
                        return res.status(400).json({
                          status: false,
                          message: "Some error occurred. If it continues, contact support!",
                        });
                      });
                  } else {
                    // await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: "false",
                      message: "Withdrawal Amount should be greater than 100 TRX",
                    });
                  }
                } else {
                  // await withraw_lock(investorId, 0);
                  return res.status(400).json({
                    status: "false",
                    message: "Invalid Amount for Withdrawal Request",
                  });
                }
              } else {
                // await withraw_lock(investorId, 0);
                return res.status(200).json({
                  status: false,
                  message: "Some error occurred. If it continues, contact support!",
                });
              }
            })
            .catch((error) => {
              console.log("Error in withdrawal_request ", error.message);
              withraw_lock(investorId, 3, 3, ip);
              return res.status(400).json({
                status: false,
                message: "Something went wrong. If it continues, contact support!",
              });
            });
        }
      } else {
        return res.status(400).json({
          status: "false",
          message: "This wallet Address does not exist. Join First!",
        });
      }
    } else {
      return res.status(400).json({
        status: "false",
        message:
          // "Invalid Parameters!",
          "Due to safety measures Withdrawals are on hold for 7-8 hours!",
      });
    }
  } catch (error) {
    console.log("Error in vip1_income_withdrawal_request ", error.message);
    return res.status(400).json({
      status: false,
      message: "Some error occurred. If it continues, contact support!",
    });
  }
}

async function vip2_income_withdrawal_request(req, res) {
  try {
    const investorId = req.body.investorId;
    const waddress = req.body.waddress;
    const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
    // const ip = req.connection.remoteAddress;
    console.log("IP Address::", ip);
    // if (waddress && investorId) {
    if (false) {
      const it = await Registration.findOne({
        investorId: investorId,
        waddress: waddress,
      }).exec();
      if (it) {
        const req_withdrawl = req.body.withdrawl_amount;
        const withdraw_locked = await Withdrawal_lock.findOne({
          investorId: investorId,
        }).exec();
        if (withdraw_locked) {
          const ct = Number(withdraw_locked.count);
          withraw_lock(investorId, 3, ct + 1, ip);
          return res.status(400).json({
            status: false,
            message: "Please wait for the confirmation of the previous withdrawal. If this continues contact support!",
          });
        } else {
          withraw_lock(investorId, 1, 0, ip)
            .then(async (data) => {
              if (data) {
                const ref_data = await Registration.findOne({
                  investorId: it.referrerId,
                }).exec();
                const wallet_balance = it.vip2_wallet;
                const siteData = await SiteData.findOne({}).exec();
                const privateKey = siteData.private_key;
                const node = {
                  fullNode: "https://api.trongrid.io",
                  solidityNode: "https://api.trongrid.io",
                  privateKey,
                };
                const tronweb = new tronWeb(node);

                async function withdrawal(
                  investorId,
                  waddress,
                  random_id,
                  withdrawal_amount,
                  sponsorId,
                  sponsor_random_id,
                  sponsor_withdrawal_amount,
                  admin_charge,
                  withdraw_limit
                ) {
                  try {
                    const contract = await tronweb
                      .contract()
                      .at(CONTRACT_ADDRESS);
                    const contract_balance = await contract.getBalance().call();
                    let checkres = [];

                    function checkwithdraw(txid) {
                      return new Promise((resolve, reject) => {
                        fetch(
                            `https://api.tronscan.org/api/transaction-info?hash=${txid}`
                          )
                          .then((res) => resolve(res.json()))
                          .catch((e) => {
                            reject(e);
                            console.log(e);
                          });
                      });
                    }
                    if (
                      Number(contract_balance._hex) / 1e6 >
                      Number(withdraw_limit) + 100
                    ) {
                      const result2 = await contract
                        .withdrawIncome(
                          waddress,
                          (Number(withdrawal_amount) - 7) * 1e6,
                          Number(admin_charge) * 1e6,
                          withdraw_limit,
                          Number(7) * 1e6
                        )
                        .send({
                          feelimit: 200000000,
                        });

                      var maxcount = 0;
                      var intervalobj = setInterval(async () => {
                        maxcount = maxcount + 1;
                        checkres = await checkwithdraw(result2);
                        if ((checkres && checkres.block) || maxcount > 3) {
                          clearInterval(intervalobj);
                          if (
                            checkres &&
                            checkres.hash == result2 &&
                            checkres.contractRet &&
                            checkres.contractRet == "SUCCESS"
                          ) {
                            const withdrawlhistory = new Withdrawlhistory({
                              investorId: investorId,
                              random_id: random_id,
                              total_amount: withdraw_limit,
                              withdrawal_amount: withdrawal_amount,
                              block_timestamp: new Date().getTime(),
                              transaction_id: result2,
                              ip_address: ip,
                              payout_status: 1,
                              withdrawal_type: "VIP 2 WITHDRAWAL",
                            });
                            await withdrawlhistory.save();
                            const trancsaction = new Transaction({
                              investorId: sponsorId,
                              random_id: sponsor_random_id,
                              transaction_id: result2,
                              income_from_id: investorId,
                              income_from_random_id: random_id,
                              total_income: sponsor_withdrawal_amount,
                              income_type: "VIP 2 SPONSOR INCOME",
                              status: 1,
                              income_date: new Date().getTime(),
                            });
                            await trancsaction.save();
                            await Registration.updateOne({
                                investorId: sponsorId,
                              }, {
                                $set: {
                                  wallet_amount: Number(ref_data.wallet_amount) +
                                    Number(sponsor_withdrawal_amount),
                                },
                              })
                              .then(async (data) => {
                                if (data) {}
                              })
                              .catch((error) => {
                                console.log(
                                  "Error in vip2_income_withdrawal_request ",
                                  error.message
                                );
                                return res.status(400).json({
                                  status: false,
                                  message: "Some error occurred. If it continues, contact support!",
                                });
                              });
                          } else {
                            const withdrawlhistory = new Withdrawlhistory({
                              investorId: investorId,
                              random_id: random_id,
                              total_amount: withdraw_limit,
                              withdrawal_amount: withdrawal_amount,
                              block_timestamp: new Date().getTime(),
                              transaction_id: result2,
                              ip_address: ip,
                              payout_status: 0,
                              withdrawal_type: "VIP 2 WITHDRAWAL",
                            });
                            await withdrawlhistory.save();
                            await withraw_lock(investorId, 0);
                            return res.status(400).json({
                              status: false,
                              message: "Withdrawal unsuccessful!",
                            });
                          }
                        } else {
                          await withraw_lock(investorId, 0);
                          return res.status(400).json({
                            status: "error",
                            message: "Withdrawal timeout!",
                          });
                        }
                      }, 10000);
                    } else {
                      await withraw_lock(investorId, 0);
                      return res.status(400).json({
                        status: "false",
                        message: "Insufficient balance in Contract!",
                      });
                    }
                  } catch (error) {
                    await Registration.updateOne({
                      investorId: investorId,
                    }, {
                      $set: {
                        vip2_wallet: Number(it.vip2_wallet) +
                          Number(req_withdrawl) * 1e6,
                        withdraw_vip_income: Number(it.withdraw_vip_income) -
                          Number(req_withdrawl) * 1e6,
                      },
                    }).then(async () => {
                      await withraw_lock(investorId, 0);
                      console.log(
                        "Error in vip2_income_withdrawal_request ",
                        error.message
                      );
                      return res.status(400).json({
                        status: false,
                        message: "Some error occurred. If it continues, contact support!",
                      });
                    });
                    await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: "false",
                      message: "Some error occurred!",
                    });
                  }
                }

                if (Number(wallet_balance) / 1e6 >= req_withdrawl && req_withdrawl <= 10000) {
                  if (req_withdrawl >= 100) {
                    await Registration.updateOne({
                        investorId: investorId,
                      }, {
                        $set: {
                          vip2_wallet: Number(it.vip2_wallet) -
                            Number(req_withdrawl) * 1e6,
                          withdraw_vip_income: Number(it.withdraw_vip_income) +
                            Number(req_withdrawl) * 1e6,
                        },
                      })
                      .then(() => {
                        withdrawal(
                          investorId,
                          it.waddress,
                          it.random_id,
                          (req_withdrawl * 90) / 100,
                          ref_data.investorId,
                          ref_data.random_id,
                          (req_withdrawl * 2.5) / 100,
                          (req_withdrawl * 7.5) / 100,
                          req_withdrawl
                        );
                      })
                      .catch(async (error) => {
                        await withraw_lock(investorId, 0);
                        console.log(
                          "Error in vip2_income_withdrawal_request ",
                          error.message
                        );
                        return res.status(400).json({
                          status: false,
                          message: "Some error occurred. If it continues, contact support!",
                        });
                      });
                  } else {
                    // await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: "false",
                      message: "Withdrawal Amount should be greater than 100 TRX",
                    });
                  }
                } else {
                  // await withraw_lock(investorId, 0);
                  return res.status(400).json({
                    status: "false",
                    message: "Invalid Amount for Withdrawal Request",
                  });
                }
              } else {
                // await withraw_lock(investorId, 0);
                return res.status(200).json({
                  status: false,
                  message: "Some error occurred. If it continues, contact support!",
                });
              }
            })
            .catch((error) => {
              console.log("Error in withdrawal_request ", error.message);
              withraw_lock(investorId, 3, 3, ip);
              return res.status(400).json({
                status: false,
                message: "Something went wrong. If it continues, contact support!",
              });
            });
        }
      } else {
        return res.status(400).json({
          status: "false",
          message: "This wallet Address does not exist. Join First!",
        });
      }
    } else {
      return res.status(400).json({
        status: "false",
        message:
          // "Invalid Parameters!",
          "Due to safety measures Withdrawals are on hold for 7-8 hours!",
      });
    }
  } catch (error) {
    console.log("Error in vip2_income_withdrawal_request ", error.message);
    return res.status(400).json({
      status: false,
      message: "Some error occurred. If it continues, contact support!",
    });
  }
}

async function vip3_income_withdrawal_request(req, res) {
  try {
    const investorId = req.body.investorId;
    const waddress = req.body.waddress;
    const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
    // const ip = req.connection.remoteAddress;
    // if (waddress && investorId) {
    if (false) {
      const it = await Registration.findOne({
        investorId: investorId,
        waddress: waddress,
      }).exec();
      if (it) {
        const req_withdrawl = req.body.withdrawl_amount;
        const withdraw_locked = await Withdrawal_lock.findOne({
          investorId: investorId,
        }).exec();
        if (withdraw_locked) {
          const ct = Number(withdraw_locked.count);
          withraw_lock(investorId, 3, ct + 1, ip);
          return res.status(400).json({
            status: false,
            message: "Please wait for the confirmation of the previous withdrawal. If this continues contact support!",
          });
        } else {
          withraw_lock(investorId, 1, 0, ip)
            .then(async (data) => {
              if (data) {
                const ref_data = await Registration.findOne({
                  investorId: it.referrerId,
                }).exec();
                const wallet_balance = it.vip3_wallet;
                const siteData = await SiteData.findOne({}).exec();
                const privateKey = siteData.private_key;
                const node = {
                  fullNode: "https://api.trongrid.io",
                  solidityNode: "https://api.trongrid.io",
                  privateKey,
                };
                const tronweb = new tronWeb(node);
                async function withdrawal(
                  investorId,
                  waddress,
                  random_id,
                  withdrawal_amount,
                  sponsorId,
                  sponsor_random_id,
                  sponsor_withdrawal_amount,
                  admin_charge,
                  withdraw_limit
                ) {
                  try {
                    const contract = await tronweb
                      .contract()
                      .at(CONTRACT_ADDRESS);
                    const contract_balance = await contract.getBalance().call();
                    let checkres = [];

                    function checkwithdraw(txid) {
                      return new Promise((resolve, reject) => {
                        fetch(
                            `https://api.tronscan.org/api/transaction-info?hash=${txid}`
                          )
                          .then((res) => resolve(res.json()))
                          .catch((e) => {
                            reject(e);
                            console.log(e);
                          });
                      });
                    }
                    if (
                      Number(contract_balance._hex) / 1e6 >
                      Number(withdraw_limit) + 100
                    ) {
                      const result2 = await contract
                        .withdrawIncome(
                          waddress,
                          (Number(withdrawal_amount) - 7) * 1e6,
                          Number(admin_charge) * 1e6,
                          withdraw_limit,
                          Number(7) * 1e6
                        )
                        .send({
                          feelimit: 200000000,
                        });

                      var maxcount = 0;
                      var intervalobj = setInterval(async () => {
                        maxcount = maxcount + 1;
                        checkres = await checkwithdraw(result2);
                        if ((checkres && checkres.block) || maxcount > 3) {
                          clearInterval(intervalobj);
                          if (
                            checkres &&
                            checkres.hash == result2 &&
                            checkres.contractRet &&
                            checkres.contractRet == "SUCCESS"
                          ) {
                            const withdrawlhistory = new Withdrawlhistory({
                              investorId: investorId,
                              random_id: random_id,
                              total_amount: withdraw_limit,
                              withdrawal_amount: withdrawal_amount,
                              block_timestamp: new Date().getTime(),
                              transaction_id: result2,
                              ip_address: ip,
                              payout_status: 1,
                              withdrawal_type: "VIP 3 WITHDRAWAL",
                            });
                            await withdrawlhistory.save();
                            const trancsaction = new Transaction({
                              investorId: sponsorId,
                              random_id: sponsor_random_id,
                              transaction_id: result2,
                              income_from_id: investorId,
                              income_from_random_id: random_id,
                              total_income: sponsor_withdrawal_amount,
                              income_type: "VIP 3 SPONSOR INCOME",
                              status: 1,
                              income_date: new Date().getTime(),
                            });
                            await trancsaction.save();
                            await Registration.updateOne({
                                investorId: sponsorId,
                              }, {
                                $set: {
                                  wallet_amount: Number(ref_data.wallet_amount) +
                                    Number(sponsor_withdrawal_amount),
                                },
                              })
                              .then(async (data) => {
                                if (data) {
                                  await withraw_lock(investorId, 0);
                                  return res.status(200).json({
                                    status: "success",
                                    message: "Withdrawal Successful!",
                                  });
                                }
                              })
                              .catch((error) => {
                                console.log(
                                  "Error in vip3_income_withdrawal_request ",
                                  c.message
                                );
                                return res.status(400).json({
                                  status: false,
                                  message: "Some error occurred. If it continues, contact support!",
                                });
                              });
                          } else {
                            const withdrawlhistory = new Withdrawlhistory({
                              investorId: investorId,
                              random_id: random_id,
                              total_amount: withdraw_limit,
                              withdrawal_amount: withdrawal_amount,
                              block_timestamp: new Date().getTime(),
                              transaction_id: result2,
                              ip_address: ip,
                              payout_status: 0,
                              withdrawal_type: "VIP 3 WITHDRAWAL",
                            });
                            await withdrawlhistory.save();

                            await withraw_lock(investorId, 0);
                            return res.status(400).json({
                              status: false,
                              message: "Withdrawal unsuccessful!",
                            });
                          }
                        } else {
                          await Registration.updateOne({
                            investorId: investorId,
                          }, {
                            $set: {
                              vip3_wallet: Number(it.vip3_wallet) +
                                Number(req_withdrawl) * 1e6,
                              withdraw_vip_income: Number(it.withdraw_vip_income) -
                                Number(req_withdrawl) * 1e6,
                            },
                          }).then(async () => {
                            await withraw_lock(investorId, 0);
                            console.log(
                              "Error in vip3_income_withdrawal_request ",
                              error.message
                            );
                            return res.status(400).json({
                              status: false,
                              message: "Some error occurred. If it continues, contact support!",
                            });
                          });
                          return res.status(400).json({
                            status: "error",
                            message: "Withdrawal timeout!",
                          });
                        }
                      }, 10000);
                    } else {
                      await withraw_lock(investorId, 0);
                      return res.status(400).json({
                        status: "false",
                        message: "Insufficient balance in Contract!",
                      });
                    }
                  } catch (error) {
                    await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: "false",
                      message: "Some error occurred!",
                    });
                  }
                }

                if (Number(wallet_balance) / 1e6 >= req_withdrawl && req_withdrawl <= 10000) {
                  if (req_withdrawl >= 100) {
                    await Registration.updateOne({
                        investorId: investorId,
                      }, {
                        $set: {
                          vip3_wallet: Number(it.vip3_wallet) -
                            Number(req_withdrawl) * 1e6,
                          withdraw_vip_income: Number(it.withdraw_vip_income) +
                            Number(req_withdrawl) * 1e6,
                        },
                      })
                      .then(() => {
                        withdrawal(
                          investorId,
                          it.waddress,
                          it.random_id,
                          (req_withdrawl * 90) / 100,
                          ref_data.investorId,
                          ref_data.random_id,
                          (req_withdrawl * 2.5) / 100,
                          (req_withdrawl * 7.5) / 100,
                          req_withdrawl
                        );
                      })
                      .catch(async (error) => {
                        await withraw_lock(investorId, 0);
                        console.log(
                          "Error in vip3_income_withdrawal_request ",
                          error.message
                        );
                        return res.status(400).json({
                          status: false,
                          message: "Some error occurred. If it continues, contact support!",
                        });
                      });
                  } else {
                    // await withraw_lock(investorId, 0);
                    return res.status(400).json({
                      status: "false",
                      message: "Withdrawal Amount should be greater than 100 TRX",
                    });
                  }
                } else {
                  // await withraw_lock(investorId, 0);
                  return res.status(400).json({
                    status: "false",
                    message: "Invalid Amount for Withdrawal Request",
                  });
                }
              } else {
                // await withraw_lock(investorId, 0);
                return res.status(200).json({
                  status: false,
                  message: "Some error occurred. If it continues, contact support!",
                });
              }
            })
            .catch((error) => {
              console.log("Error in withdrawal_request ", error.message);
              withraw_lock(investorId, 3, 3, ip);
              return res.status(400).json({
                status: false,
                message: "Something went wrong. If it continues, contact support!",
              });
            });
        }
      } else {
        return res.status(400).json({
          status: "false",
          message: "This wallet Address does not exist. Join First!",
        });
      }
    } else {
      return res.status(400).json({
        status: "false",
        message:
          // "Invalid Parameters!",
          "Due to safety measures Withdrawals are on hold for 7-8 hours!",
      });
    }
  } catch (error) {
    console.log("Error in vip3_income_withdrawal_request ", error.message);
    return res.status(400).json({
      status: false,
      message: "Some error occurred. If it continues, contact support!",
    });
  }
}
async function retopup(req, res) {
  try {
    const investorId = req.body.investorId;
    const txId = req.body.txId;
    // console.log("transaction id in retopup: ", txId, investorId);
    const result1 = await Registration.findOne({
      investorId: investorId,
    }).exec();
    let tt = 0;
    async function checkRetopup(waddress, txid) {
      try {
        const fromAddress = "TRmogeMRrX9TPzEBpFxSHjwUaenvFiWACB";

        try {
          fetch(`https://api.tronscan.org/api/transaction-info?hash=${txid}`)
            .then((d) => d.json())
            .then(async (result) => {
              tt++;
              // console.log("top tx res:", result);
              const date_val = Date.now() + 1000000;
              // console.log("top tx res1:", result, date_val);
              if (
                result.timestamp < date_val &&
                result.contractData.to_address == fromAddress &&
                result.contractData.owner_address == waddress
              ) {
                // console.log("top tx res2:", result, date_val);
                if (result.contractData.amount == 2000000000) {
                  // console.log("tx res:", result);
                  const deposit = new Deposit({
                    investorId: result1.investorId,
                    trx_amt: result.contractData.amount,
                    income_from_id: result1.investorId,
                    is_member_count: 1,
                    invest_type: "RETOPUP",
                  });
                  await deposit.save();
                  await Registration.updateOne({
                    _id: result1._id,
                  }, {
                    $set: {
                      vip1: 1,
                      vip1_income: 4000000000,
                    },
                  }).exec((error, data) => {
                    if (error)
                      return res.status(200).json({
                        error,
                      });
                    if (data) {
                      res.status(200).json({
                        status: true,
                        message: "Retopup Successfully!",
                      });
                    }
                  });
                } else if (result.contractData.amount == 5000000000) {
                  const deposit = new Deposit({
                    investorId: result1.investorId,
                    trx_amt: result.contractData.amount,
                    income_from_id: result1.investorId,
                    is_member_count: 1,
                    invest_type: "RETOPUP",
                  });
                  await deposit.save();
                  await Registration.updateOne({
                    _id: result1._id,
                  }, {
                    $set: {
                      vip2: 1,
                      vip2_income: 12500000000,
                    },
                  }).exec((error, data) => {
                    if (error)
                      return res.status(200).json({
                        error,
                      });
                    if (data) {
                      res.status(200).json({
                        status: true,
                        message: "Retopup Successfully!",
                      });
                    }
                  });
                } else if (result.contractData.amount == 10000000000) {
                  const deposit = new Deposit({
                    investorId: result1.investorId,
                    trx_amt: result.contractData.amount,
                    income_from_id: result1.investorId,
                    is_member_count: 1,
                    transaction_id: txid,
                    invest_type: "RETOPUP",
                  });
                  await deposit.save();
                  await Registration.updateOne({
                    _id: result1._id,
                  }, {
                    $set: {
                      vip3: 1,
                      vip3_income: 30000000000,
                    },
                  }).exec((error, data) => {
                    if (error)
                      return res.status(200).json({
                        error,
                      });
                    if (data) {
                      res.status(200).json({
                        status: true,
                        message: "Retopup Successfully!",
                      });
                    }
                  });
                }
              }
            });
        } catch (error) {
          console.log(error);
        }
      } catch {
        console.log("Error in Withdrawal API", error.message);
      }
    }

    checkRetopup(result1.waddress, txId);

    if (tt == 0) {
      setTimeout(() => {
        checkRetopup(result1.waddress, txId);
      }, 30000);
    } else if (tt == 0) {
      setTimeout(() => {
        checkRetopup(result1.waddress, txId);
      }, 50000);
    }
  } catch (error) {
    console.log("Error in Withdrawal ", error.message);
  }
}

//--------------------Cron API------------------------//

async function send_all_vip_club_income(req, res) {
  try {
    let remain_vip_income = 0;
    const vip1_count = await Registration.count({
      vip1: 1,
      vip1_income: {
        $gt: 0,
      },
    }).exec();
    const vip2_count = await Registration.count({
      vip2: 1,
      vip2_income: {
        $gt: 0,
      },
    }).exec();
    const vip3_count = await Registration.count({
      vip3: 1,
      vip3_income: {
        $gt: 0,
      },
    }).exec();
    let setting_data = await Setting.findOne({}).exec();
    let vip_club_amt = setting_data.vip_club;
    let vip_1_income = (Number(vip_club_amt) * 15) / 100;
    let vip_2_income = (Number(vip_club_amt) * 35) / 100;
    let vip_3_income = (Number(vip_club_amt) * 50) / 100;
    let single_vip_1_income =
      vip1_count != 0 ? vip_1_income / Number(vip1_count) : 0;
    let single_vip_2_income =
      vip2_count != 0 ? vip_2_income / Number(vip2_count) : 0;
    let single_vip_3_income =
      vip3_count != 0 ? vip_3_income / Number(vip3_count) : 0;
    const result_vip1 = await Registration.find({
      vip1: 1,
      vip1_income: {
        $gt: 0,
      },
    }).exec();
    const result_vip2 = await Registration.find({
      vip2: 1,
      vip2_income: {
        $gt: 0,
      },
    }).exec();
    const result_vip3 = await Registration.find({
      vip3: 1,
      vip3_income: {
        $gt: 0,
      },
    }).exec();
    let total_vip_wallet_income = 0;
    let a = result_vip1.map(async (it) => {
      if (Number(it.vip1_income) > Number(single_vip_1_income)) {
        const trancsaction = new Transaction({
          investorId: it.investorId,
          random_id: it.random_id,
          wallet_address: it.waddress,
          total_income: Number(single_vip_1_income) / 1e6,
          income_type: "VIP 1 INCOME",
          status: 1,
        });
        await trancsaction.save();
        remain_vip_income =
          Number(remain_vip_income) + Number(single_vip_1_income);
        total_vip_wallet_income =
          Number(total_vip_wallet_income) + Number(it.vip_income);
        await Registration.updateOne({
          _id: it._id,
        }, {
          $set: {
            vip_income: Number(total_vip_wallet_income) + Number(single_vip_1_income),
            vip1_income: Number(it.vip1_income) - Number(single_vip_1_income),
            vip1_wallet: Number(it.vip1_wallet) + Number(single_vip_1_income),
          },
        }).exec();
      } else {
        const trancsaction = new Transaction({
          investorId: it.investorId,
          random_id: it.random_id,
          wallet_address: it.waddress,
          total_income: Number(it.vip1_income) / 1e6,
          income_type: "VIP 1 INCOME",
        });
        await trancsaction.save();
        remain_vip_income = Number(remain_vip_income) + Number(it.vip1_income);
        total_vip_wallet_income =
          Number(total_vip_wallet_income) + Number(it.vip_income);
        await Registration.updateOne({
          _id: it._id,
        }, {
          $set: {
            vip1: 0,
            vip_income: Number(total_vip_wallet_income) + Number(it.vip1_income),
            vip1_income: 0,
            vip1_wallet: Number(it.vip1_wallet) + Number(it.vip1_income),
          },
        }).exec();
      }
    });
    Promise.all(a).then(function (res) {
      let b = result_vip2.map(async (it) => {
        if (Number(it.vip2_income) > Number(single_vip_2_income)) {
          const trancsaction = new Transaction({
            investorId: it.investorId,
            random_id: it.random_id,
            wallet_address: it.waddress,
            total_income: Number(single_vip_2_income) / 1e6,
            income_type: "VIP 2 INCOME",
          });
          await trancsaction.save();
          remain_vip_income =
            Number(remain_vip_income) + Number(single_vip_2_income);
          await Registration.updateOne({
            _id: it._id,
          }, {
            $set: {
              vip_income: Number(it.vip_income) + Number(single_vip_2_income),
              vip2_income: Number(it.vip2_income) - Number(single_vip_2_income),
              vip2_wallet: Number(it.vip2_wallet) + Number(single_vip_2_income),
            },
          }).exec();
        } else {
          const trancsaction = new Transaction({
            investorId: it.investorId,
            random_id: it.random_id,
            wallet_address: it.waddress,
            total_income: Number(it.vip2_income) / 1e6,
            income_type: "VIP 2 INCOME",
          });
          await trancsaction.save();
          remain_vip_income =
            Number(remain_vip_income) + Number(it.vip2_income);
          await Registration.updateOne({
            _id: it._id,
          }, {
            $set: {
              vip2: 0,
              vip_income: Number(total_vip_wallet_income) + Number(it.vip2_income),
              vip2_income: 0,
              vip2_wallet: Number(it.vip2_wallet) + Number(it.vip2_income),
            },
          }).exec();
        }
      });
      Promise.all(b).then(function (res1) {
        let c = result_vip3.map(async (it) => {
          if (Number(it.vip3_income) > Number(single_vip_3_income)) {
            const trancsaction = new Transaction({
              investorId: it.investorId,
              random_id: it.random_id,
              wallet_address: it.waddress,
              total_income: Number(single_vip_3_income) / 1e6,
              income_type: "VIP 3 INCOME",
            });
            await trancsaction.save();
            remain_vip_income =
              Number(remain_vip_income) + Number(single_vip_3_income);
            await Registration.updateOne({
              _id: it._id,
            }, {
              $set: {
                vip_income: Number(it.vip_income) + Number(single_vip_3_income),
                vip3_income: Number(it.vip3_income) - Number(single_vip_3_income),
                vip3_wallet: Number(it.vip3_wallet) + Number(single_vip_3_income),
              },
            }).exec();
          } else {
            const trancsaction = new Transaction({
              investorId: it.investorId,
              random_id: it.random_id,
              wallet_address: it.waddress,
              total_income: Number(it.vip3_income) / 1e6,
              income_type: "VIP 3 INCOME",
            });
            await trancsaction.save();
            remain_vip_income += it.vip3_income;
            await Registration.updateOne({
              _id: it._id,
            }, {
              $set: {
                vip3: 0,
                vip_income: Number(total_vip_wallet_income) + Number(it.vip3_income),
                vip3_income: 0,
                vip3_wallet: Number(it.vip3_wallet) + Number(it.vip3_income),
              },
            }).exec();
          }
        });
        Promise.all(c).then(function (res2) {
          console.log(
            "INCOME After Distribution",
            Number(setting_data.vip_club),
            Number(remain_vip_income),
            Number(
              setting_data ?
              setting_data.total_vip_club ?
              Number(setting_data.total_vip_club) :
              0 :
              0
            ) + Number(remain_vip_income)
          );
          Setting.updateOne({
            $set: {
              vip_club: Number(setting_data.vip_club) - Number(remain_vip_income),
              total_vip_club: Number(
                setting_data ?
                setting_data.total_vip_club ?
                Number(setting_data.total_vip_club) :
                0 :
                0
              ) + Number(remain_vip_income),
            },
          }).exec();
        });
      });
    });
  } catch (error) {
    console.log(" Error in send_all_vip_club_income! ", error.message);
  }
}

async function calculate_levelup_income_from_deposit(req, res) {
  // try {
  //   const result = await Deposit.find({
  //     up_level_paid_status: 0,
  //   })
  //     .limit(1)
  //     .exec();
  //   let a = result.map(async (it) => {
  //     let count = 0;
  //     const registration_data = await Registration.findOne({
  //       investorId: it.investorId,
  //     }).exec();
  //     let ref_id = registration_data.promoterId;
  //     // console.log(ref_id);
  //     let joining_amt = it.trx_amt / 1000000;
  //     // let joining_amt = (joining * 40) / 100;
  //     let i = 1;
  //     for (i = 1; i <= 20; i++) {
  //       if (ref_id == 1 || ref_id == 0) {
  //         // console.log("Break 1 Works");
  //         i--;
  //         break;
  //       }
  //       let net_income = (joining_amt * 1) / 100;
  //       let reg = await Registration.findOne({ investorId: ref_id }).exec();
  //       let w_amt = reg.wallet_amount;
  //       const trancsaction = new Transaction({
  //         investorId: ref_id,
  //         random_id: reg.random_id,
  //         wallet_address: reg.waddress,
  //         income_from_id: it.investorId,
  //         income_from_random_id: registration_data.random_id,
  //         total_income: net_income,
  //         income_type: "COMMUNITY LEVELUP INCOME",
  //         invest_type: it.invest_type,
  //         level: it.investorId - ref_id,
  //       });
  //       // console.log("Level Up", i, ref_id, reg.waddress, it.investorId);
  //       await trancsaction.save();
  //       await Registration.updateOne(
  //         { _id: reg._id },
  //         { $set: { wallet_amount: Number(w_amt) + Number(net_income) } }
  //       ).exec();
  //       ref_id = reg.promoterId;
  //       // count = i;
  //       if (ref_id == 1 || ref_id == 0) {
  //         // console.log("Break 2 Works")
  //         break;
  //       }
  //     }
  //     await Deposit.updateOne(
  //       { _id: it._id },
  //       { $set: { up_level_paid_status: 1, up_level_paid: i } }
  //     ).exec();
  //   });
  //   Promise.all(a);
  // } catch (error) {
  //   console.log(" error in Calculate Level income ", error.message);
  // }
}

async function calculate_leveldown_income_from_deposit() {
  // try {
  // const result = await Deposit.find({
  //   down_level_paid: { $lt: 20 },
  // })
  //   .limit(2)
  //   .exec();
  // await Deposit.aggregate([{ $sample: { size: 1 } }]);
  //   await Deposit.aggregate([
  //     { down_level_paid: { $lt: 20 } },
  //     { $sample: { size: 1 } },
  //   ]).pretty();
  //   let a = result.map(async (it) => {
  //     const result_registration_data = await Registration.findOne({
  //       investorId: it.investorId,
  //     }).exec();
  //     let last_user_investorId = await Registration.findOne({})
  //       .sort({ investorId: -1 })
  //       .exec();
  //     if (
  //       last_user_investorId.investorId >=
  //       it.investorId + it.down_level_paid + 1
  //     ) {
  //       let registration_data = await Registration.findOne({
  //         investorId: it.investorId + it.down_level_paid + 1,
  //       }).exec();
  //       // console.log("last_user_investorId", last_user_investorId.investorId, registration_data, it.investorId + it.down_level_paid + 1);
  //       let ref_id = registration_data.investorId
  //         ? registration_data.investorId
  //         : 0;
  //       let joining_amt = it.trx_amt / 1000000;
  //       let down_paid = it.down_level_paid;
  //       let net_income = (joining_amt * 1) / 100;
  //       let i = 1;
  //       if (last_user_investorId.investorId >= ref_id) {
  //         for (i = it.down_level_paid + 1; i <= 20; i++) {
  //           if (ref_id == 1) {
  //             console.log("BREAK", ref_id);
  //             break;
  //           }
  //           down_paid = down_paid + 1;
  //           let reg = await Registration.findOne({ investorId: ref_id }).exec();
  //           let w_amt = reg.wallet_amount;
  //           if (down_paid <= 20) {
  //             const trancsaction = new Transaction({
  //               investorId: ref_id,
  //               random_id: reg.random_id,
  //               wallet_address: reg.waddress,
  //               income_from_random_id: result_registration_data.random_id,
  //               income_from_id: it.investorId,
  //               total_income: net_income,
  //               income_type: "COMMUNITY LEVELDOWN INCOME",
  //               invest_type: it.invest_type,
  //               level: down_paid,
  //             });
  //             await trancsaction.save();
  //             // const w_amount = reg.wallet_amount?parseInt(reg.wallet_amount)+net_income:0;
  //             await Registration.updateOne(
  //               { investorId: reg.investorId },
  //               { $set: { wallet_amount: Number(w_amt) + Number(net_income) } }
  //             ).exec();
  //           }
  //           // let last_user_investorId = await Registration.findOne({ }).sort({investorId:-1}).exec();
  //           if (last_user_investorId.investorId == ref_id) {
  //             console.log("last_user_investorId break");
  //             break;
  //           }
  //           console.log("End Of the loop", last_user_investorId, ref_id);
  //           let next_reg = await Registration.findOne({
  //             investorId: ref_id + 1,
  //           }).exec();
  //           ref_id = next_reg.investorId ? next_reg.investorId : 0;
  //           if (ref_id == 1) {
  //             console.log("ref_id break");
  //             break;
  //           }
  //         }
  //       }
  //       console.log(it.down_level_paid, down_paid);
  //       await Deposit.updateOne(
  //         { _id: it._id },
  //         { $set: { down_level_paid: down_paid } }
  //       ).exec();
  //     } else {
  //       console.log("out", last_user_investorId.investorId);
  //     }
  //     return true;
  //   });
  //   Promise.all(a);
  // } catch (error) {
  //   console.log(" error in Calculate Level income ", error.message);
  // }
}

async function seven_level_paid(
  ref_id,
  trx_amt,
  random_id,
  investorId,
  invest_type,
  i,
  transaction_id
) {
  if (i < 8) {
    if (ref_id == 0) {
      return 0;
    }
    let income_per = level_income_per(i);
    let net_income = ((trx_amt / 1000000) * income_per) / 100;
    let reg = await Registration.findOne({
      investorId: ref_id,
    }).exec();
    let w_amt = reg.wallet_amount;
    if (i > 4 && reg.direct_member < 5) {
      ref_id = reg.referrerId;
      let d1 = await seven_level_paid(
        ref_id,
        trx_amt,
        random_id,
        investorId,
        invest_type,
        i + 1,
        transaction_id
      );
      return d1 + 1;
    } else {
      if (i <= 4) {
        const transaction = new Transaction({
          investorId: ref_id,
          random_id: reg.random_id,
          wallet_address: reg.waddress,
          income_from_random_id: random_id,
          income_from_id: investorId,
          total_income: net_income,
          income_type: "SPONSORING INCOME",
          invest_type: invest_type,
          transaction_id: transaction_id,
          level: i,
        });
        await transaction.save();
        await Registration.updateOne({
          investorId: reg.investorId,
        }, {
          $set: {
            wallet_amount: Number(w_amt) + Number(net_income),
          },
        }).exec();
      } else if (i > 4) {
        if (reg.direct_member > 3) {
          const transaction = new Transaction({
            investorId: ref_id,
            random_id: reg.random_id,
            wallet_address: reg.waddress,
            income_from_random_id: random_id,
            income_from_id: investorId,
            total_income: net_income,
            income_type: "SPONSORING INCOME",
            transaction_id: transaction_id,
            invest_type: invest_type,
            level: i,
          });
          await transaction.save();
          await Registration.updateOne({
            investorId: reg.investorId,
          }, {
            $set: {
              wallet_amount: Number(w_amt) + Number(net_income),
            },
          }).exec();
        }
      }
      ref_id = reg.referrerId;
      if (i < 8) {
        let d2 = await seven_level_paid(
          ref_id,
          trx_amt,
          random_id,
          investorId,
          invest_type,
          i + 1,
          transaction_id
        );
        return d2 + 1;
      }
    }
  } else {
    return 0;
  }
}

// async function calculate_level_income_from_deposit(req, res) {
//   try {
//     const result = await Deposit.find({
//       sponsor_level_paid: 0,
//     })
//       .limit(1)
//       .exec();
//     // console.log(result);
//     let a = result.map(async (it) => {
//       let i = 1;
//       const registration_data = await Registration.findOne({
//         investorId: it.investorId,
//       }).exec();
//       let ref_id = registration_data.referrerId;
//       i = await seven_level_paid(
//         ref_id,
//         it.trx_amt,
//         registration_data.random_id,
//         it.investorId,
//         it.invest_type,
//         i
//       );
//       console.log("sponsor_level_paid", i);
//       await Deposit.updateOne(
//         { _id: it._id },
//         { $set: { is_member_count: 2, sponsor_level_paid: i } }
//       ).exec();
//     });
//     Promise.all(a);
//   } catch (error) {
//     console.log(" error in Calculate Level income ", error.message);
//   }
// }

async function cron_reinvest_income(req, res) {
  try {
    const result = await Withdrawlhistory.find({
        payout_status: 1,
        withdrawal_type: "INCOME WITHDRAWAL",
      })
      .limit(10)
      .exec();
    let a = result.map(async (it) => {
      const deposit = new Deposit({
        investorId: it.investorId,
        trx_amt: Number(it.reinvest_amount) * 1000000,
        income_from_id: it.investorId,
        is_member_count: 1,
        transaction_id: it.transaction_id,
        invest_type: "REINVESTMENT",
      });
      await deposit.save();
      let reg_datas = await Registration.findOne({
        investorId: it.investorId,
      }).exec();
      await Registration.updateOne({
        investorId: it.investorId,
      }, {
        $set: {
          total_investment: Number(reg_datas.total_investment) +
            Number(it.reinvest_amount) * 1000000,
        },
      }).exec();
      await Withdrawlhistory.updateOne({
        _id: it._id,
      }, {
        $set: {
          payout_status: 2,
        },
      }).exec();
    });
    Promise.all(a);
  } catch (error) {
    console.log(" error in Calculate Level income ", error.message);
  }
}

async function cron_vip_club_income(req, res) {
  try {
    const result = await Deposit.find({
        vip_income_paid: 0,
      })
      .limit(1)
      .exec();
    let a = result.map(async (it) => {
      const setting_data = await Setting.findOne({}).exec();
      if (setting_data != null) {
        console.log(setting_data, setting_data.vip_club, it.trx_amt);
        await Setting.updateOne({
          $set: {
            total_vip_club: parseFloat(setting_data.total_vip_club) +
              (parseFloat(it.trx_amt) * 20) / 100,
            vip_club: parseFloat(setting_data.vip_club) +
              (parseFloat(it.trx_amt) * 20) / 100,
          },
        }).exec();
        await Deposit.updateOne({
          _id: it._id,
        }, {
          $set: {
            vip_income_paid: 1,
          },
        }).exec();
      }
    });
    Promise.all(a);
  } catch (error) {
    console.log(" Error! ", error.message);
  }
}

async function calculate_all_income_from_deposit() {
  //calculate_levelup_income_from_deposit
  let result1 = await Deposit.findOne({
      up_level_paid_status: 0,
      $and: [{
        investorId: {
          $ne: 127
        }
      }, {
        investorId: {
          $ne: 1
        }
      }]
    })
    .limit(1)
    .exec();
  console.log("result 1:: ", result1);
  if (result1 != null) {
    let registration_data1 = await Registration.findOne({
      investorId: result1.investorId,
    }).exec();
    let ref_id = registration_data1.promoterId;
    // console.log(ref_id);
    let joining_amt = result1.trx_amt / 1000000;
    // let joining_amt = (joining * 40) / 100;
    let i;
    for (i = 1; i <= 20; i++) {
      if (ref_id == 1 || ref_id == 0) {
        // console.log("Break 1 Works");
        i--;
        break;
      }
      let net_income = (joining_amt * 2) / 100;
      let reg = await Registration.findOne({
        investorId: ref_id,
      }).exec();
      let w_amt = reg.wallet_amount;
      let trancsaction = new Transaction({
        investorId: ref_id,
        random_id: reg.random_id,
        wallet_address: reg.waddress,
        income_from_id: result1.investorId,
        income_from_random_id: registration_data1.random_id,
        total_income: net_income,
        transaction_id: result1.transaction_id,
        income_type: "COMMUNITY LEVELUP INCOME",
        invest_type: result1.invest_type,
        level: result1.investorId - ref_id,
      });
      await trancsaction.save();
      await Registration.updateOne({
        investorId: reg.investorId,
      }, {
        $set: {
          wallet_amount: Number(w_amt) + Number(net_income),
        },
      }).exec();
      ref_id = reg.promoterId;
      // count = i;
      if (ref_id == 1 || ref_id == 0) {
        // console.log("Break 2 Works")
        break;
      }
    }
    await Deposit.updateOne({
      _id: result1._id,
    }, {
      $set: {
        up_level_paid_status: 1,
        up_level_paid: Number(i) - 1,
      },
    }).exec();
    console.log("up level paid finished");
  }

  // Sponsor Level Income Starts
  let result3 = await Deposit.findOne({
      sponsor_level_paid: 0,
      $and: [{
        investorId: {
          $ne: 127
        }
      }, {
        investorId: {
          $ne: 1
        }
      }]
    })
    .limit(1)
    .exec();
  console.log("result 2:: ", result3);

  if (result3 != null) {
    j = 1;
    registration_data3 = await Registration.findOne({
      investorId: result3.investorId,
    }).exec();
    ref_id = registration_data3.referrerId ? registration_data3.referrerId : 0;
    j = await seven_level_paid(
      ref_id,
      result3.trx_amt,
      registration_data3.random_id,
      result3.investorId,
      result3.invest_type,
      j,
      result3.transaction_id
    );
    await Deposit.updateOne({
      _id: result3._id,
    }, {
      $set: {
        sponsor_level_paid: j,
      },
    }).exec();
  }
}

async function delete_all_data() {
  //   await Registration.deleteMany({ investorId: { $gt: 1 } });
  //   await Deposit.deleteMany({ investorId: { $gt: 1 } });
  //   await Transaction.deleteMany({});
  //   await Withdrawlhistory.deleteMany({});
  //   await Setting.updateOne({
  //     $set: {
  //       vip_club: 0,
  //       total_vip_club: 0,
  //     },
  //   }).exec();
  console.log("delete_all_data called!");
  let i = 0;
  for (i = 0; i < 11; i++) {
    console.log("delete_all_data called", i, "Times");
    fetch("http://localhost:3001/api/vip3_income_withdrawal_request/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          investorId: 127,
          req_withdrawl: 101,
        }),
      })
      .then((response) => response.json())
      .then((response) => {
        console.log("response::", response);
      })
      .catch((resp) => {
        console.log("Error::", error);
      });
  }
}

//----------------------- End Cron API ------------------------

//----------------------- Start Correction VIP Income API ------------------------

async function vip1_wallet_correction(req, res) {
  try {
    let investorId = req.body.investorId;
    cf();
    async function cf() {
      let total_withdraw = 0;
      const it = await Registration.findOne({
        investorId: investorId,
      }).exec();
      await Registration.updateOne({
        investorId: investorId,
      }, {
        $set: {
          withdraw_vip_income: 0,
        },
      }).exec();
      if (it.vip1) {
        let total_withdraw_vip1 = 0;
        console.log("vip1 inner::", it.vip1, total_withdraw);
        let tot_vip1_amt = Number(it.vip1_wallet) + Number(it.vip1_income);
        let data = await Withdrawlhistory.find({
          investorId: investorId,
          withdrawal_type: "VIP 1 WITHDRAWAL",
        }).exec();
        if (data) {
          let a = data.map(async (loop) => {
            total_withdraw_vip1 =
              total_withdraw_vip1 + Number(loop.total_amount);
            total_withdraw = total_withdraw + Number(loop.total_amount);
          });
          Promise.all(a);
          await Registration.updateOne({
            investorId: investorId,
          }, {
            $set: {
              withdraw_vip_income: Number(total_withdraw) * 1e6,
            },
          }).exec();
          if (Number(total_withdraw_vip1 * 1e6) + tot_vip1_amt != 4000 * 1e6) {
            await Registration.updateOne({
              investorId: investorId,
            }, {
              $set: {
                vip1_income: 4000 * 1e6 - Number(total_withdraw_vip1 * 1e6),
                vip1_wallet: 0,
              },
            }).exec();
          }
        }
      }
      if (it.vip2) {
        console.log("vip2 inner::", it.vip2, total_withdraw);
        let total_withdraw_vip2 = 0;
        let tot_vip2_amt = Number(it.vip2_wallet) + Number(it.vip2_income);
        let data = await Withdrawlhistory.find({
          investorId: investorId,
          withdrawal_type: "VIP 2 WITHDRAWAL",
        }).exec();
        if (data) {
          let a = data.map(async (loop) => {
            total_withdraw_vip2 =
              total_withdraw_vip2 + Number(loop.total_amount);
            total_withdraw = total_withdraw + Number(loop.total_amount);
          });
          console.log(
            "VIP 2 total_withdraw:: ",
            total_withdraw_vip2,
            total_withdraw
          );
          console.log(
            "Pref 2 total_withdraw:: ",
            Number(total_withdraw_vip2 * 1e6),
            tot_vip2_amt
          );
          Promise.all(a);
          await Registration.updateOne({
            investorId: investorId,
          }, {
            $set: {
              withdraw_vip_income: Number(total_withdraw * 1e6),
            },
          }).exec();
          if (Number(total_withdraw_vip2 * 1e6) + tot_vip2_amt != 12500 * 1e6) {
            await Registration.updateOne({
              investorId: investorId,
            }, {
              $set: {
                vip2_income: 12500 * 1e6 - Number(total_withdraw_vip2 * 1e6),
                vip2_wallet: 0,
              },
            }).exec();
          }
        }
      }
      if (it.vip3) {
        console.log("vip3 inner::", it.vip3, total_withdraw);
        let total_withdraw_vip3 = 0;
        let tot_vip3_amt = Number(it.vip3_wallet) + Number(it.vip3_income);
        let data = await Withdrawlhistory.find({
          investorId: investorId,
          withdrawal_type: "VIP 3 WITHDRAWAL",
        }).exec();
        if (data) {
          let a = data.map(async (loop) => {
            total_withdraw_vip3 =
              total_withdraw_vip3 + Number(loop.total_amount);
            total_withdraw = total_withdraw + Number(loop.total_amount);
          });
          Promise.all(a);
          await Registration.updateOne({
            investorId: investorId,
          }, {
            $set: {
              withdraw_vip_income: Number(total_withdraw * 1e6),
            },
          }).exec();
          if (Number(total_withdraw_vip3 * 1e6) + tot_vip3_amt != 30000 * 1e6) {
            await Registration.updateOne({
              investorId: investorId,
            }, {
              $set: {
                vip3_income: 30000 * 1e6 - Number(total_withdraw_vip3 * 1e6),
                vip3_wallet: 0,
              },
            }).exec();
          }
        }
      }
    }
  } catch (error) {
    console.log("Error in Withdrawal ", error.message);
  }
}

module.exports = {
  calculate_leveldown_income_from_deposit,
  calculate_levelup_income_from_deposit,
  // calculate_level_income_from_deposit,
  calculate_all_income_from_deposit,
  vip1_income_withdrawal_request,
  vip2_income_withdrawal_request,
  vip3_income_withdrawal_request,
  get_vip_sponsor_level_incomes,
  // vip_income_withdrawal_request,
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
  get_activated_vip,
  get_direct_member,
  personal_details,
  getWalletBalance,
  delete_all_data,
  get_investorId,
  getWithdrawal,
  is_user_exist,
  get_randomId,
  get_last_Id,
  retopup,
};