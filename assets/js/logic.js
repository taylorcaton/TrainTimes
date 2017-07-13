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

    //empty the table
    $("#train-table").empty();

    //Draw the the table
    for (var i = 0; i < trainData.length; i++) {
      
      console.log(i);
      var tr = $("<tr class='trainRow'>");
      tr.append("<td>"+trainData[i].name+"</td>");
      tr.append("<td>"+trainData[i].destination+"</td>");
      tr.append("<td>"+trainData[i].frequency+"</td>");

      trainData[i].nextArrival = getNextArrival(trainData[i].firstTrainTime, trainData[i].frequency);
      tr.append("<td>" + trainData[i].nextArrival + "</td>");

      trainData[i].minAway = getMinAway(trainData[i].nextArrival);
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

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");

  //Add object to local array
  trainData.push(objToAdd);

  //Send local array to Firebase
  database.ref().set({
    trainData: trainData
  })

});

function getNextArrival(fT, frequency){

  var currentDate = moment().format("YYYY-MM-DD");
  var currentTime = moment();
  var nextArrival = moment(currentDate+" "+fT);

  if(nextArrival < currentTime){
    
    while(nextArrival < currentTime){
      nextArrival = nextArrival.add(frequency, 'm');
    }

  }
  
  return nextArrival.format("hh:mm A")
  
}

function getMinAway(time){

  var currentDate = moment().format("YYYY-MM-DD");
  var nextArrival = moment(currentDate+" "+time.substring(0, 5));

  return moment().diff(nextArrival, 'minutes') + " min";

}