angular.module('')
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
  .service('fileUpload', /*@ngInject*/ function ($http, $q) {
      this.uploadFileToUrl = function(file, uploadUrl){
        var q = $q.defer();

          var fd = new FormData();
          fd.append('file', file);
          $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
          })
          .success(function(res){
            q.resolve(res)
          })
          .error(function(err){
            q.reject(err)
          });

          return q.promise;
      }
  })
    .directive('fileInput', /*@ngInject*/ function ($parse) {
      return {
          restrict: 'E',
          scope: { file: '=', required: '@' },
          template: `
.full(ng-if="file")
  img(src="{{ file }}" ng-if="file" style="width:100px;height:100px;")
  a.close.ion-close-round(ng-click="file = ''")

.full(ng-if="!file")
  input( type="file" file-model="selectedFile" style="width:80%;" )
  a.button(ng-click="uploadFile()" style="width: 14%; height: 22px; padding: 6px 10px; float: right; text-align: center;") Upload`,
          controller: ($scope, fileUpload) => {
            var self = $scope;

        self.uploadFile = function(){
          fileUpload.uploadFileToUrl(self.selectedFile, "/api/v1/image")
            .then(res => self.file = res.url);
        };
          }
      };
  })

