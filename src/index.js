module.exports = angular.module('ng-upload-s3')
  .directive('fileModel', /*@ngInject*/ function ($parse) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              
              element.bind('change', function(){
                  scope.$apply(function(){
                      modelSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  })
  .service('fileUpload', /*@ngInject*/ ($http, $q) => {
      this.uploadFileToUrl = (file, uploadUrl) => {
        var q = $q.defer(),
            fd = new FormData();
        
        fd.append('file', file);
        
        $http.post(uploadUrl, fd, { transformRequest: angular.identity, headers: {'Content-Type': undefined} })
          .success(res => { q.resolve(res) })
          .error(err => { q.reject(err) });

        return q.promise;
      }
  })
  .directive('fileInput', /*@ngInject*/ $parse => {
    return {
      restrict: 'E',
      scope: { file: '=', required: '@' },
      template: require('./index.jade'),
      controller: ($scope, fileUpload) => {
        var self = $scope;

        self.uploadFile = function(){
          fileUpload.uploadFileToUrl(self.selectedFile, "/api/v1/image").then(res => self.file = res.url);
        };
      }
    };
  })

