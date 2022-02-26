// route
app.config(function ($routeProvider) {
  // $routeProvider.errorOnUnhandledRejections(false);
  $routeProvider
    .when("/", {
      templateUrl: "/Trangchu.html",
      // controller: "IndexCtrl",
      // .when("/trangchu", {
      //   templateUrl: "/Trangchu.html",
      //   // controller: "TrangchuCtrl",
      // })
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

// qizzs
app.controller("dataQuiz", function ($scope, $http, $interval) {
  $scope.marks = 0;
  $scope.indexQ = parseInt(0);

  $scope.direct_questions = function (id) {
    $scope.startTime = 0;
    $scope.startMinute = 0;
    $scope.$parent.start = function () {
      $scope.$parent.stop();

      $scope.$parent.promise = $interval(function () {
        $scope.startTime++;
        if ($scope.startTime == 59) {
          $scope.startTime = 0;
          $scope.startMinute += 1;
        }
      }, 1000);
    };

    $scope.$parent.stop = function () {
      $interval.cancel($scope.$parent.promise);
    };

    if ($scope.$parent.loginSuccess == true) {
      $scope.$parent.start();
      if (id == "DBBS") {
        var urll = "https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/" + id;
        $http.get(urll).then(function (res) {
          $scope.selected = [];
          $scope.selectedbuf = 0;
          $scope.marks = 0;
          $scope.indexQ = 0;
          $scope.questions = res.data;
        });
      } else {
        var urll = "/db/Quizs/" + id + ".js";
        $http.get(urll).then(function (res) {
          $scope.selected = [];
          $scope.selectedbuf = 0;
          $scope.marks = 0;
          $scope.indexQ = 0;
          $scope.questions = res.data;
        });
      }
    } else {
      alert("you need login to do test");
      window.location.href = "index.html";
    }
  };

  $scope.chk = function (id) {
    if ($scope.selected[$scope.indexQ] == id) {
      return true;
    } else {
      return false;
    }
  };

  $scope.next_Qiz = function (id) {
    if ($scope.indexQ < $scope.questions.length) {
      if ($scope.selected[$scope.indexQ] == null) {
        if ($scope.checkCorrect()) {
          $scope.marks += 1;
        }
        $scope.selected.push($scope.selectedbuf);
        $scope.selectedbuf = 0;
      } else {
        // $scope.chk = true;
        if ($scope.selected[$scope.indexQ] == 0 && $scope.selectedbuf != 0) {
          if ($scope.checkCorrect()) {
            $scope.marks += 1;
          }
          $scope.selected.splice($scope.indexQ, 1, $scope.selectedbuf);
          $scope.selectedbuf = 0;
        } else if (
          $scope.selected[$scope.indexQ] != 0 &&
          $scope.selectedbuf != 0 &&
          $scope.selectedbuf != $scope.selected[$scope.indexQ]
        ) {
          if ($scope.checkCorrect()) {
            $scope.marks += 1;
          } else {
            $scope.marks -= 1;
          }
          $scope.selected.splice($scope.indexQ, 1, $scope.selectedbuf);
          $scope.selectedbuf = 0;
        }
      }
      if ($scope.indexQ != $scope.questions.length - 1) {
        $scope.indexQ += 1;
      }
    }
    $scope.cx = false;
  };

  $scope.prev_Qiz = function (id) {
    if ($scope.indexQ >= 0) {
      if ($scope.selected[$scope.indexQ] == null) {
        if ($scope.checkCorrect()) {
          $scope.marks += 1;
        }
        $scope.selected.push($scope.selectedbuf);
        $scope.selectedbuf = 0;
      } else {
        // $scope.chk = true;
        if ($scope.selected[$scope.indexQ] == 0 && $scope.selectedbuf != 0) {
          if ($scope.checkCorrect()) {
            $scope.marks += 1;
          }
          $scope.selected.splice($scope.indexQ, 1, $scope.selectedbuf);
          $scope.selectedbuf = 0;
        } else if (
          $scope.selected[$scope.indexQ] != 0 &&
          $scope.selectedbuf != 0 &&
          $scope.selectedbuf != $scope.selected[$scope.indexQ]
        ) {
          if ($scope.checkCorrect()) {
            $scope.marks += 1;
          } else {
            $scope.marks -= 1;
          }
          $scope.selected.splice($scope.indexQ, 1, $scope.selectedbuf);
          $scope.selectedbuf = 0;
        }
      }
      if ($scope.indexQ != 0) {
        $scope.indexQ -= 1;
      }
    }
    $scope.cx = false;
  };

  $scope.end_Qiz = function (id) {
    if (confirm("Are your sure to End game?")) {
      $scope.AddMark = $scope.$parent.Acc;
      $scope.AddMark.marks =
        parseInt($scope.AddMark.marks) + parseInt($scope.marks);
      $http({
        method: "PUT",
        url:
          "https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/Students/" +
          $scope.$parent.Acc.id,
        data: $scope.AddMark,
      }).then(
        function successCallback(response) {
          $scope.$parent.stop();

          alert("done Successfully");
        },
        function errorCallback(response) {
          alert("Error. Try Again!");
        }
      );
    }
  };

  $scope.cx = false;
  $scope.selectedToggle = function (id) {
    $scope.selectedbuf = id;
    $scope.cx = true;
  };

  $scope.checkCorrectFalse = function () {
    if ($scope.cx == true && $scope.checkCorrect() == false) {
      return false;
    }
    return true;
  };

  $scope.checkCorrect = function () {
    if ($scope.questions[$scope.indexQ].AnswerId == $scope.selectedbuf) {
      return true;
    } else {
      return false;
    }
  };
});

app.controller("btvn", function ($scope) {
  $scope.total = function () {
    return parseInt($scope.x) + parseInt($scope.y);
  };
});

app.controller("Subjects", function ($scope, $http) {
  var urll = "/db/Subjects.js";
  $http.get(urll).then(function (response) {
    $scope.Subjects = response.data;
    $scope.pageCount = Math.ceil($scope.Subjects.length / 8);
  });

  $scope.begin = 0;
  $scope.prev = function () {
    if ($scope.begin > 0) {
      $scope.begin -= 8;
    }
    console.log($scope.begin);
  };
  $scope.next = function () {
    if ($scope.begin < ($scope.pageCount - 1) * 8) {
      $scope.begin += 8;
    }
    console.log($scope.begin);
  };
  $scope.choosePage = function (i) {
    $scope.begin = 8 * i;
    console.log($scope.begin);
  };
});

app.controller("Stud", function ($scope) {
  $scope.indexChss = $scope.$parent.indexChs;
  $scope.useee = $scope.$parent.usee;
});

app.controller("Students_", function ($scope, $http) {
  $scope.usee = [];
  $http
    .get("https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/Students")
    .then(function (response) {
      $scope.usee = response.data;
    });

  $scope.loginSuccess = false;
  $scope.indexChs = 0;
  $scope.Acc = {};
  $scope.login = function () {
    console.log($scope.usee);
    for (let index = 0; index < $scope.usee.length; index++) {
      const element = $scope.usee[index];

      if (
        $scope.Accounts.username == element.username &&
        $scope.Accounts.passwd == element.password
      ) {
        $scope.Acc = element;
        $scope.indexChs = index;
        return true;
      }
    }
    return false;
  };

  $scope.DisplayAcc = function () {
    if ($scope.loginSuccess == true) {
      return true;
    }
    return false;
  };

  //login
  $scope.loginCheck = function () {
    if ($scope.login()) {
      $scope.loginSuccess = true;
      alert("login succesfully!");
      $("#DangNhap").modal("hide");
    } else {
      alert("login Fail!");
    }
  };

  //update information
  $scope.update = function () {
    if (confirm("Are you sure ?")) {
      $http({
        method: "PUT",
        url:
          "https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/Students/" +
          $scope.Acc.id,
        data: $scope.Acc,
      }).then(
        function successCallback(response) {
          alert("Update Successfully");
        },
        function errorCallback(response) {
          alert("Error. Try Again!");
        }
      );
    }
  };

  //change password
  $scope.changePass = function () {
    if ($scope.newPrePass == $scope.newPreRepeatPass) {
      console.log($scope.Acc.password + ",    ...." + $scope.newPrePass);
      if ($scope.Acc.password == $scope.prePass) {
        $scope.Acc.password = $scope.newPrePass;
        $scope.update();
        alert("Change password succesfully! ");
        $scope.newPrePass = "";
        $scope.newPreRepeatPass = "";
        $scope.prePass = "";
        console.log($scope.usee);
      } else {
        alert("pre pass is not correct");
      }
    } else {
      alert("new password and repeat password must be duplicate");
    }
  };

  //forgot password
  $scope.forgotPass = function () {
    for (let index = 0; index < $scope.usee.length; index++) {
      const element = $scope.usee[index];
      if ($scope.emailForgot == element.email) {
        alert("The password is: " + element.password);
        $("#forgotPasswd").modal("hide");
        return;
      }
    }
    alert("This account doesn't exist!");
  };
  // logout
  $scope.logout = function () {
    let text = "are you sure logout?";
    if (confirm(text) == true) {
      $scope.loginSuccess = false;
      $scope.stop();
    }
  };
  // register
  $scope.registerCheckb = function () {
    for (let index = 0; index < $scope.usee.length; index++) {
      const element = $scope.usee[index];
      if ($scope.resg.username == element.username) {
        return false;
      }
    }
    if ($scope.resg.passwd != $scope.resg.passRepwd) {
      return false;
    }
    return true;
  };
  $scope.Registed = function () {
    $scope.resg = {};
    $scope.resg = {
      email: $scope.res.emdk,
      username: $scope.res.resUser,
      passwd: $scope.res.resNewPasswd,
      passRepwd: $scope.res.resRepPasswd,
    };
    $scope.student = {
      username: $scope.resg.username,
      password: $scope.resg.passwd,
      email: $scope.resg.email,
    };
    if ($scope.registerCheckb()) {
      if (confirm("Are you sure to register?")) {
        $http.post("https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/Students/", $scope.student).then((data) => {
          console.log(data);
          if (data.statusText === "Created") {
            window.location.href = "index.html";
          }
        });
      }
      alert("Register succesfully!");
      $("#dangKy").modal("hide");
    } else {
      alert("Register Fail because this username existed!");
    }
  };
});

app.controller("changPasss", function ($scope) {
  $scope.changePass = function () {
    if ($scope.newPrePass == $scope.newPreRepeatPass) {
      console.log($scope.$parent.Acc.password + ",    ...." + $scope.newPrePass);
      if ($scope.$parent.Acc.password == $scope.prePass) {
        $scope.$parent.Acc.password = $scope.newPrePass;
        $scope.$parent.update();
        alert("Change password succesfully! ");
        $scope.newPrePass = "";
        $scope.newPreRepeatPass = "";
        $scope.prePass = "";
      } else {
        alert("pre pass is not correct");
      }
    } else {
      alert("new password and repeat password must be duplicate");
    }
  };
});

app.controller("manager", function ($scope, $http) {
  $scope.studentss = [];
  var urll = "https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/Students";
  $http.get(urll).then(function (response) {
    console.log($scope.studentss);
    $scope.studentss = response.data;
  });

  $scope.adminstrators = [];
  var urllad = "https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/manager";
  $http.get(urllad).then(function (response) {
    $scope.adminstrators = response.data;
  });

  $scope.thisAdmin = {};
  $scope.loginCheckAd = function () {
    for (let index = 0; index < $scope.adminstrators.length; index++) {
      const element = $scope.adminstrators[index];
      if (
        element.user == $scope.thisAdmin.username &&
        element.passwd == $scope.thisAdmin.passwd
      ) {
        $scope.thisAdmin = element.user;
        alert("login succesfully !");
        $("#DangNhapAdmin").modal("hide");
        window.location.href = "admin.html";
        return true;
      }
    }
    alert("login fail !");
    return false;
  };

  $scope.BufStudent = {};
  $scope.chooseStu = function (id) {
    $scope.BufStudent = $scope.studentss[id];
    $("#Studentsss").modal("show");
  };

  $scope.save = function () {
    if (confirm("Are you sure to Save?")) {
      $http({
        method: "PUT",
        url:
          "https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/Students/" +
          $scope.BufStudent.id,
        data: $scope.BufStudent,
      }).then(
        function successCallback(response) {
          alert("User has updated Successfully");
          $("#Studentsss").modal("hide");
        },
        function errorCallback(response) {
          alert("Error. while updating user Try Again!");
        }
      );
    }
  };
  $scope.add = function () {
    if (confirm("Are you sure to Add?")) {
      $http.post(urll, $scope.BufStudent).then((data) => {
        console.log(data);
        if (data.statusText === "Created") {
          window.location.href = "admin.html";
        }
      });
    }
  };
  $scope.delete = function () {
    if (confirm("Are you sure to Delete?")) {
      $http({
        method: "DELETE",
        url:
          "https://621591fcc9c6ebd3ce2bacc6.mockapi.io/api/v1/Students/" +
          $scope.BufStudent.id,
      }).then(
        function successCallback(response) {
          alert("User has deleted Successfully");
          var index = $scope.studentss.indexOf($scope.BufStudent);
          $scope.studentss.splice(index, 1);
          $("#Studentsss").modal("hide");
        },
        function errorCallback(response) {
          alert("Error. while deleting user Try Again!");
        }
      );
    }
  };
  $scope.refresh = function () {
    $scope.BufStudent = {
      username: "",
      password: "",
      fullname: "",
      email: "",
      gender: "true",
      birthday: "",
      schoolfee: "0",
      marks: "0",
    };
  };
});
