(function(angular) {
    'use strict';

    // Your starting point. Enjoy the ride!
    var app = angular.module('app', ['ngRoute']);
    // 路由配置
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/:status?', {
                controller: 'MyController',
                templateUrl: 'main_tmpl'
            })
            .otherwise({ redirectTo: '/' });
    }]);

    // 新增本地存储
    app.controller('MyController', [
        '$scope',
        '$routeParams',
        '$route',
        '$window',
        function($scope, $routeParams, $route, $window) {
            var storage = $window.localStorage;
            var todos = storage['my_todo_list'] ? JSON.parse(storage['my_todo_list']) : [];

            function getId() {
                var id = Math.random(); // 1 2
                for (var i = 0; i < $scope.todos.length; i++) {
                    if ($scope.todos[i].id === id) {
                        id = getId();
                        break;
                    }
                }
                return id;
            }
            // 文本框需要初始化好
            $scope.text = '';
            // 任务列表也需要, { id: 1, text: '学习', completed: true }
            $scope.todos = todos;

            // 列表的新增
            $scope.add = function() {
                    $scope.todos.push({
                        id: getId(), //自动增长
                        text: $scope.text,
                        completed: false
                    });
                    // 本地存储列表
                    storage['my_todo_list'] = JSON.stringify(todos);
                    // 清空文本框
                    $scope.text = ''
                }
                // 列表的删除
            $scope.remove = function(id) {
                for (var i = 0; i < $scope.todos.length; i++) {
                    if (id === $scope.todos[i].id) {
                        $scope.todos.splice(i, 1);
                    }
                }
                // 本地存储列表
                storage['my_todo_list'] = JSON.stringify(todos);
            }

            // 清空已完成
            $scope.clear = function() {
                var result = [];
                for (var i = 0; i < $scope.todos.length; i++) {
                    if (!$scope.todos[i].completed) {
                        result.push($scope.todos[i]);
                    }
                }
                $scope.todos = result;

                // 本地存储列表
                storage['my_todo_list'] = JSON.stringify(todos);
            };

            // 当前编辑哪个元素
            $scope.currentEditingId = -1;
            $scope.editing = function(id) {
                console.log("obj");
                $scope.currentEditingId = id;
            };
            $scope.save = function() {
                $scope.currentEditingId = -1;
            };

            var now = true;
            $scope.toggleAll = function() {
                    for (var i = 0; i < $scope.todos.length; i++) {
                        $scope.todos[i].completed = now;
                    }
                    now = !now;
                }
                // 状态筛选
            $scope.selector = {}; // {} {completed:true} {completed:false}
            // 取路由中匹配出来的数据
            var status = $routeParams.status;
            console.log($routeParams.status);
            switch (status) {
                case 'active':
                    $scope.selector = { completed: false };
                    break;
                case 'completed':
                    $scope.selector = { completed: true };
                    break;
                default:
                    $route.updateParams({ status: '' });
                    $scope.selector = {};
                    break;
            }

        }
    ]);




})(angular);
