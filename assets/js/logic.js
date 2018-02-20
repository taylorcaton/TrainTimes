firebase.initializeApp(config);

const database = firebase.database();

let trainData;

database.ref().on('value', (snapshot) => {
  if (!snapshot.val()) { // is there anything there? If not create a blank data array.
    trainData = [];

    database.ref().set({
      trainData: [],
    });
  } else {
    // fetch Firebase data and set it to the local array
    trainData = snapshot.val().trainData;
    updateTrainArray();

    // empty the table
    $('#train-table').empty();

    // Draw the the table
    for (let i = 0; i < trainData.length; i += 1) {
      const tr = $("<tr class='trainRow'>");
      tr.append(`<td>${trainData[i].name}</td>`);
      tr.append(`<td>${trainData[i].destination}</td>`);
      tr.append(`<td>${trainData[i].frequency}</td>`);

      const tempNextArrival = moment(JSON.parse(trainData[i].nextArrival));

      tr.append(`<td>${tempNextArrival.format('hh:mm A')}</td>`);
      tr.append(`<td>${trainData[i].minAway}</td>`);

      $('#train-table').append(tr);
    }
  }
});

// Submit button
$(document).on('click', '#submit-train', () => {

  event.preventDefault();

  const objToAdd = {
    name: $('#train-name').val().trim(),
    destination: $('#destination').val().trim(),
    firstTrainTime: $('#datetimepicker12')['0'].textContent.substring(0, 5),
    frequency: $('#frequency').val().trim(),
    nextArrival: '',
    minAway: '',
  };

  objToAdd.nextArrival = getNextArrival(objToAdd.firstTrainTime, objToAdd.frequency);
  objToAdd.minAway = getMinAway(objToAdd.nextArrival);

  objToAdd.nextArrival = JSON.stringify(objToAdd.nextArrival);

  $('#train-name').val('');
  $('#destination').val('');
  $('#first-train-time').val('');
  $('#frequency').val('');

  // Add object to local array
  trainData.push(objToAdd);

  // Send local array to Firebase
  database.ref().set({
    trainData,
  });
});

function getNextArrival(fT, frequency) {
  const currentDate = moment().format('YYYY-MM-DD');
  const currentTime = moment();
  let nextArrival = moment(`${currentDate} ${fT}`);

  if (nextArrival < currentTime) {
    while (nextArrival < currentTime) {
      nextArrival = nextArrival.add(frequency, 'm');
    }
  }

  return nextArrival;
}

function getMinAway(time) {
  const nextArrival = moment(time);

  // return nextArrival.to(moment(), 'minutes') + " min";
  return nextArrival.fromNow();
}

$('#datetimepicker12').datetimepicker({
  inline: true,
  format: 'hh:mm',
});

function updateTrainArray() { // updates Array and sends it to Firebase
  for (let i = 0; i < trainData.length; i += 1) {
    trainData[i].nextArrival = getNextArrival(trainData[i].firstTrainTime, trainData[i].frequency);
    trainData[i].minAway = getMinAway(trainData[i].nextArrival);
    trainData[i].nextArrival = JSON.stringify(trainData[i].nextArrival);

    // Send local array to Firebase
    database.ref().set({
      trainData,
    });
  }
}

setInterval(updateTrainArray, 60000);
