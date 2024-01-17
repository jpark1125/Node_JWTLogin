// Express 애플리케이션에 라우팅을 정의하는 파일

// 필요한 모듈 및 컨트롤러 불러오기
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  // CORS 헤더 설정을 위한 미들웨어 추가
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // 회원가입 엔드포인트 설정
  app.post(
    "/api/auth/signup",
    [
      // 회원가입 전 중복된 사용자명 또는 이메일 확인 및 유효한 역할인지 확인하는 미들웨어 적용
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    // 회원가입 컨트롤러 호출
    controller.signup
  );

  // 로그인 엔드포인트 설정
  app.post("/api/auth/signin", controller.signin);

  // 로그아웃 엔드포인트 설정
  app.post("/api/auth/signout", controller.signout);
};
