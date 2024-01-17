const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// 중복된 사용자명 또는 이메일을 확인하는 미들웨어
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // 사용자명 확인
    let user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!",
      });
    }

    // 이메일 확인
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

// 유효하지 않은 역할을 확인하는 미들웨어
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

// verifySignUp 객체에 두 미들웨어를 추가
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

// 모듈 익스포트
module.exports = verifySignUp;
