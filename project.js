function Project(id,name,description,site) {
  this.$id = id;
  this.name = name;
  this.description = description;
  this.site = site; 
}

function Ctrl($scope,$filter) {
  $scope.items =
      [{author:'Rahul', filesize:'225', crdate:'2001/12/31'},
       {author:'Krishan', filesize:'100', crdate: '2011/11/21'},
       {author:'Sharma', filesize:'4352', crdate:'2005/06/24'},
       {author:'Anisha', filesize:'123', crdate:'2006/08/10'},
       {author:'Mohan',filesize:'234', crdate: '2009/05/22'}]
  $scope.predicate = '-crdate';
  
  $scope.chckedIndexs=[];

     $scope.checkedIndex = function (item) {
         if ($scope.chckedIndexs.indexOf(item) === -1) {
             $scope.chckedIndexs.push(item);
         }
         else {
             $scope.chckedIndexs.splice($scope.chckedIndexs.indexOf(item), 1);
         }
     }

     $scope.selectedStudents = function () {
         return $filter('filter')($scope.items, { checked: true });
     };
      $scope.remove=function(index){
          angular.forEach($scope.chckedIndexs, function (value, index) {
              var index = $scope.items.indexOf(value);
              $scope.items.splice($scope.items.indexOf(value), 1);
          });
            $scope.chckedIndexs = [];
     };
    }



function Projects() {
  projects = [];
  this.projects = projects;
  this.loaded = 0;

  this.add = function(prj) {
    projects.splice(projects.length,0,prj);
  }
this.remove = function(id) {
    for(var i=0;i<projects.length;i++) {
      if(projects[i].$id == id) {
        projects.splice(i,1);
        return;
      }
    }
  }


  this.get = function(id) {
    for(var i=0;i<projects.length;i++) {
      var prj = projects[i];
      if(prj.$id == id)
        return prj;
    }
  }

  this.update = function(itemOrId) {
    alert(itemOrId);
  }
}

angular.projects = new Projects();

angular.module('project',[]).
  factory('Projects', function() {
    return angular.projects;
  }).
  config(function($routeProvider) {
    $routeProvider.
    when('/', {controller:ListCtrl, templateUrl:'list.html'}).
    when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
    when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
    otherwise({redirectTo:'/'});
  });

     
function ListCtrl($scope, $http, Projects) {
  if(Projects.loaded == 0) {
    $http.get("projects.json").success(function(data) {
      for(var i = 0;i<data.length;i++) {
        var itm = data[i];
        Projects.add(new Project(itm.$id,itm.name,itm.description,itm.site));
      }
    });
    Projects.loaded = 1;
  }
  $scope.projects = Projects;
}
     
function CreateCtrl($scope, $location, $timeout, Projects) {
  $scope.project = new Project();
  $scope.save = function() {
    $scope.project.$id = randomString(5,"abcdefghijklmnopqrstuvwxyz0123456789");
    Projects.add(angular.copy($scope.project));
    $location.path('/');
  }
}

function EditCtrl($scope, $location, $routeParams, Projects) {
   $scope.project = angular.copy(Projects.get($routeParams.projectId));
   $scope.isClean = function() {
      return angular.equals(Projects.get($routeParams.projectId), $scope.project);
   }
   $scope.destroy = function() {
      Projects.remove($routeParams.projectId);
      $location.path('/');
   };
   $scope.save = function() {
      var prj = Projects.get($routeParams.projectId);
      prj.name = $scope.project.name;
      prj.description = $scope.project.description;
      prj.site = $scope.project.site;
      $location.path('/');
   };
}

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) 
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}
