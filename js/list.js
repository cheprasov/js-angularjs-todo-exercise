(function() {
    'use strict';

    angular.module('listApp', ['ngDraggable'])

        .directive('contenteditable', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) {
                        return;
                    }

                    var read = function() {
                        var html = element.html();
                        if (html === '<br>') {
                            html = '';
                        }
                        ngModel.$setViewValue(html);
                    };

                    var update = function() {
                        (scope.$$phase || scope.$root.$$phase) || scope.$apply(read);
                    };

                    ngModel.$render = function() {
                        element.html(ngModel.$viewValue || '');
                    };

                    element.bind('keydown', function(e) {
                        if (!e.ctrlKey && !e.metaKey) {
                            return;
                        }
                        switch (e.keyCode) {
                            case 73:
                                document.execCommand('italic', false, false);
                                break;
                            case 66:
                                document.execCommand('bold', false, false);
                                break;
                        }
                        update();
                        e.stopPropagation && e.stopPropagation();
                        e.preventDefault && e.preventDefault();
                    });

                    element.bind('blur change keyup', function() {
                        update();
                    });
                }
            };
        })

        .controller('ListController', function($scope) {
            var ths = this;

            var top = $scope.top = 0;
            var left = $scope.left = 0;

            /**
             * @param {number} deltaX
             * @param {number} deltaY
             */
            $scope.onMove = function(deltaX, deltaY) {
                ths.top = top + deltaY;
                ths.left = left + deltaX;
            };

            /**
             * @param {number} deltaX
             * @param {number} deltaY
             */
            $scope.onMoveEnd = function(deltaX, deltaY) {
                top = ths.top = top + deltaY;
                left = ths.left = left + deltaX;
            };

            $scope.models = {
                list: [
                    {text: 'There can be more than 1 element'},
                    {text: 'See?'},
                    {text: '<b>This one is bold</b>'},
                    {text: '<i>This one is italic</i>'},
                    {text: 'And this one has<br>a new line'}
                ]
            };

            var list = $scope.models.list;

            /**
             * @param {number} index
             */
            this.add = function (index) {
                list.splice(index + 1, 0, {text: ''});
            };

            /**
             * @param {number} index
             */
            this.del = function (index) {
                if (list.length === 1) {
                    return;
                }
                list.splice(index, 1);
            };

            /**
             * @param {number} index
             * @param {Object} item
             */
            this.move = function (index, item) {
                var otherItem = list[index];
                var otherIndex = list.indexOf(item);
                list[index] = item;
                list[otherIndex] = otherItem;
            };

            /**
             * @return {string}
             */
            this.export = function () {
                return angular.toJson({
                    data: list.map(function(item) {return item.text;})
                }, true);
            };

            $scope.$watch('models.list', function(model) {
                $scope.modelAsJson = ths.export();
            }, true);

        });

})();
