/////////////////////////////////
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDCmtTF6zXDCWtlYjGReRgwwqbn8HRwxto",
    authDomain: "trainschedule-9e79e.firebaseapp.com",
    databaseURL: "https://trainschedule-9e79e.firebaseio.com",
    projectId: "trainschedule-9e79e",
    storageBucket: "",
    messagingSenderId: "392868461868"
  };
  firebase.initializeApp(config);


var database = firebase.database();
/////////////////////////////////


/////////////////////////////////
//Event Listener
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var initTrainTime = $("#start-input").val().trim();
    var start = moment(initTrainTime, "HH:mm").format("X");


    // Creates local object for holding train data
    var trains = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        start: start,
    };

    database.ref().push(trains);

    // Logs everything to console

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#start-input").val("");
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var start = childSnapshot.val().start;
    var minutesAway = calculate(start, (frequency * 60))
    var arrivalTime = moment().add(minutesAway, 'minutes').format('HH:mm A')

    $('#train-table tbody').append(`<tr><td>${trainName}</td><td>${destination}</td><td>${frequency}</td><td>${arrivalTime}</td><td>${minutesAway}</td></tr>`)


    function calculate(unixInitTrainTime, trainFreqSecs) {
        timeNow = moment().format("X");
        var diffInitNow = timeNow - unixInitTrainTime;
        var mod = diffInitNow % trainFreqSecs;
        var timeLeft = trainFreqSecs - mod;
        var timeMin = timeLeft / 60;
        var adjTime = Math.round(timeMin);
        return adjTime;
    }


});