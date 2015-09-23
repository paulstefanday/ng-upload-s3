module.exports = angular.module('ng-upload-s3').directive('fileModel', /*@ngInject*/function ($parse) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}).service('fileUpload', /*@ngInject*/function ($http, $q) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var q = $q.defer();

        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (res) {
            q.resolve(res);
        }).error(function (err) {
            q.reject(err);
        });

        return q.promise;
    };
}).directive('fileInput', /*@ngInject*/function ($parse) {
    return {
        restrict: 'E',
        scope: { file: '=', required: '@' },
        template: require('./index.jade'),
        controller: function controller($scope, fileUpload) {
            var self = $scope;

            self.uploadFile = function () {
                fileUpload.uploadFileToUrl(self.selectedFile, "/api/v1/image").then(function (res) {
                    return self.file = res.url;
                });
            };
        }
    };
});
