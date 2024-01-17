// Express 애플리케이션에 라우팅을 정의하는 파일

// 필요한 모듈 및 컨트롤러 불러오기
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  // CORS 헤더 설정을 위한 미들웨어 추가
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // 모든 사용자에게 접근 가능한 엔드포인트 설정
  app.get("/api/test/all", controller.allAccess);

  // 사용자 역할이 필요한 엔드포인트 설정
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // 모더레이터 역할이 필요한 엔드포인트 설정
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  // 관리자 역할이 필요한 엔드포인트 설정
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
