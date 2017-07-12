// Initialize Firebase
var config = {
  apiKey: "AIzaSyDcB96O0vgoVzLZUwjEUALBpKqITvdSHIo",
  authDomain: "train-times-f2030.firebaseapp.com",
  databaseURL: "https://train-times-f2030.firebaseio.com",
  projectId: "train-times-f2030",
  storageBucket: "train-times-f2030.appspot.com",
  messagingSenderId: "1090310853838"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainData;

database.ref().on("value", function(snapshot) {

  if(!snapshot.val()){ //is there anything there? If not create a blank data array.
    
    trainData = [];

    database.ref().set({
      trainData: []
    })

  }else{
    //fetch Firebase data and set it to the local array 
    trainData = snapshot.val().trainData

    //Draw the the table
    for (var i = 0; i < trainData.length; i++) {
      
      console.log(i);
      var tr = $("<tr class='trainRow'>");
      tr.append("<td>"+trainData[i].name+"</td>");
      tr.append("<td>"+trainData[i].destination+"</td>");
      tr.append("<td>"+trainData[i].frequency+"</td>");

      //trainData[i].nextArrival = getNextArrival(trainData[i]);
      trainData[i].nextArrival = "TBD"
      tr.append("<td>" + trainData[i].nextArrival + "</td>");

      //trainData[i].minAway = getMinAway(trainData[i]);
      trainData[i].minAway = "TBD"
      tr.append("<td>" + trainData[i].minAway + "</td>");

      $("#train-table").append(tr);
    }
  }
});

//Submit button
$(document).on("click","#submit-train", function(){

  event.preventDefault();

  var objToAdd = {
    name: $("#train-name").val().trim(),
    destination: $("#destination").val().trim(),
    firstTrainTime: $("#first-train-time").val().trim(), 
    frequency: $("#frequency").val().trim()
  }

  //Add object to local array
  trainData.push(objToAdd);

  //Send local array to Firebase
  database.ref().set({
    trainData: trainData
  })

})