
function main() {

   const apiSettings = {
      "baseUrl":"http://localhost:3000"
   };
   
   const apiManager = new ApiManager(apiSettings);
   const singlePriceModule = new Module();
   singlePriceModule.init(document,apiManager);
}

window.addEventListener("load", main);
