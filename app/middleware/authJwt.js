const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// 토큰 검증 미들웨어
verifyToken = (req, res, next) => {
  // 세션에서 토큰 가져오기
  let token = req.session.token;

  // 토큰이 없을 경우 권한 거부 응답
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  // 토큰 검증
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      // 토큰이 유효하지 않을 경우 권한 거부 응답
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    // 토큰에서 추출한 사용자 ID를 request에 추가
    req.userId = decoded.id;
    next();
  });
};

// 관리자 권한 확인 미들웨어
isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        // 사용자가 관리자 권한을 가지고 있다면 다음 미들웨어 호출
        return next();
      }
    }

    // 관리자 권한이 없을 경우 권한 거부 응답
    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    // 에러 발생 시 500 Internal Server Error 응답
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

// 모더레이터 권한 확인 미들웨어
isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        // 사용자가 모더레이터 권한을 가지고 있다면 다음 미들웨어 호출
        return next();
      }
    }

    // 모더레이터 권한이 없을 경우 권한 거부 응답
    return res.status(403).send({
      message: "Require Moderator Role!",
    });
  } catch (error) {
    // 에러 발생 시 500 Internal Server Error 응답
    return res.status(500).send({
      message: "Unable to validate Moderator role!",
    });
  }
};

// 모더레이터 또는 관리자 권한 확인 미들웨어
isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator" || roles[i].name === "admin") {
        // 사용자가 모더레이터 또는 관리자 권한을 가지고 있다면 다음 미들웨어 호출
        return next();
      }
    }

    // 모더레이터 또는 관리자 권한이 없을 경우 권한 거부 응답
    return res.status(403).send({
      message: "Require Moderator or Admin Role!",
    });
  } catch (error) {
    // 에러 발생 시 500 Internal Server Error 응답
    return res.status(500).send({
      message: "Unable to validate Moderator or Admin role!",
    });
  }
};

// 미들웨어 객체를 익스포트
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
module.exports = authJwt;
