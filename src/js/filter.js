
function grabFromBeerDB(target){
  var outputList = [];

  beerDatabaseRef.orderByChild("beerName").on("value",function(snapshot){
    snapshot.forEach(function(data){
      if(target == "brewery"){
        var idx = outputList.indexOf(data.val().breweryName);
        if(idx == -1){
          // console.log(data.val());
          outputList.push(data.val().breweryName);
        }
      }
      else if(target=="style"){
        var idx = outputList.indexOf(data.val().beerStyle);
        if(idx == -1){
          outputList.push(data.val().beerStyle);
        }
      }
    });
  });

  return outputList;
}



var filterVM = new Vue({
  el: '#filter-bar',
  data : {
    breweryName : grabFromBeerDB("brewery"),
    beerStyle : grabFromBeerDB("style"),
    breweryFilter : [],
    styleFilter : []
  },
  firebase : {
    beerList: beerDatabaseRef
  },
  methods : {
    renderFiltered: function(){
      var tempList = []
      if(this.breweryFilter.length > 0){
        collectionVM.filterSwitch = false;
        for(i = 0; i < this.breweryFilter.length; i++){
          console.log(this.breweryFilter[i]);
          beerDatabaseRef.orderByChild("breweryName").equalTo(this.breweryFilter[i]).on("value",function(snapshot){
            snapshot.forEach(function(data){
              var idx = tempList.indexOf(data.val().beerName);
              if(idx == -1){
                tempList.push(data.val());
              }

            });
          });
        }
      }
      if(this.styleFilter.length > 0){
        collectionVM.filterSwitch = false;
        for(i = 0; i < this.styleFilter.length; i++){
          console.log(this.styleFilter[i]);
          beerDatabaseRef.orderByChild("beerStyle").equalTo(this.styleFilter[i]).on("value",function(snapshot){
            snapshot.forEach(function(data){
              var idx = tempList.indexOf(data.val().beerName);
              if(idx == -1){
                tempList.push(data.val());
              }
            });
          });
        }
      }
      else if(this.styleFilter.length == 0 && this.breweryFilter.length == 0){
        collectionVM.filterSwitch = true;
      }
      collectionVM.filterBeerObject = tempList;
    }
  }
});
