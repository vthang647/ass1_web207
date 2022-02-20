// route
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/index.html",
      // controller: "IndexCtrl",
    })
    .when("/trangchu", {
      templateUrl: "/Trangchu.html",
      // controller: "TrangchuCtrl",
    })
    .when("/gioithieu", {
      templateUrl: "/GioiThieu.html",
      // controller: "GioiThieuCtrl",
    })
    .when("/gopy", {
      templateUrl: "/Gopy.html",
      // controller: "GopYCtrl",
    })
    .when("/hoidap", {
      templateUrl: "/Hoidap.html",
      // controller: "HoiDapCtrl",
    })
    .when("/lienhe", {
      templateUrl: "/Lienhe.html",
      // controller: "LienHeCtrl",
    })
    .when("/suadoitk", {
      templateUrl: "/SuaDoiTaiKhoan.html",
    })
    .when("/doimk", {
      templateUrl: "/DoiMatK.html",
    })
    .when("/qiz", {
      templateUrl: "/qiz.html",
    });
});

app.controller("dataQuiz", function ($scope, $http) {
  $scope.marks = 0;
  $scope.indexQ = parseInt(0);

  $scope.direct_questions = function (id) {
    var urll = "/db/Quizs/" + id + ".js";
    $http.get(urll).then(function (res) {
      $scope.marks = 0;
      $scope.indexQ = 0;
      $scope.questions = res.data;
    });
  };
  $scope.next_Qiz = function () {
    if ($scope.indexQ < $scope.questions.length) {
      $scope.marks += 1;
      $scope.indexQ += 1;
    } else {
      $scope.marks = 0;
      $scope.indexQ = 0;
    }
  };
});

app.controller("btvn", function ($scope) {
  $scope.total = function () {
    return parseInt($scope.x) + parseInt($scope.y);
  };
});

app.controller("Students", function ($scope, $http) {
  const url = "/db/Students.js";
  $http.get(url).then(function (response) {
    $scope.Students = response.data;
  });
});

app.controller("Subjects", function ($scope, $http) {
  const url = "/db/Subjects.js";
  $http.get(url).then(function (response) {
    $scope.Subjects = response.data;
  });
});

app.controller("phanTrang", function ($scope, $http) {
  const url = "/db/Subjects.js";
  $http.get(url).then(function (response) {
    $scope.subPage = response.data;
    $scope.pageCount = Math.ceil($scope.subPage.length / 8);
    console.log(pageCount);
  });
  $scope.begin = 0;

  $scope.prev = function () {
    if ($scope.begin > 0) {
      $scope.begin -= 8;
    }
  };
  $scope.next = function () {
    if ($scope.begin < ($scope.pageCount - 1) * 8) {
      $scope.begin += 8;
    }
  };
  $scope.last = function () {
    $scope.begin = ($scope.pageCount - 1) * 8;
  };
});
