function isPositiveInteger(number) {
    return Number.isInteger(number) && number > 0;
}

function handleForm() {
    var pname = (document.getElementById("pname").value).trim();
    var qty = parseInt(document.getElementById("qty").value);
    var amount = parseInt(document.getElementById("amount").value);
    var freq_num = parseInt(document.getElementById("freq_num").value);
    var freq_period = document.getElementById("freq_period").value;
    var refills = parseInt(document.getElementById("refills").value);
    console.log("Console Test");


    // FORM VALIDATION
    // All fields must have content
    if (pname === "" || isNaN(qty) || isNaN(amount) || isNaN(freq_num) || freq_period === "" || isNaN(refills)) {
        alert("All fields must be filled out");
        return false;
    }

    // All numbered fields must be positive integers, except for refills which may be 0
    if (isPositiveInteger(qty) && isPositiveInteger(freq_num) && isPositiveInteger(amount)){
        if (!(Number.isInteger(refills) && refills > -1)){
            alert("Refills must be a whole number 0 or greater");
            return false;
        }
        // true case, pass to makeCalendar
        makeCalendar(pname, qty, amount, freq_num, freq_period, refills); 
        return true;

    } else{
        alert("Inputs must be positive whole numbers");
        return false;
    }
}

function findEarliestDayOfWeek(date) {
    const checkboxes = document.querySelectorAll('.dayCheckbox');
    let earliestDay = null;

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            const dayOfWeek = checkbox.value;
            const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayOfWeek);
        
            const checkboxDate = new Date(date);
            checkboxDate.setDate(date.getDate() - date.getDay() + dayIndex);
            
            if (earliestDay === null || checkboxDate < earliestDay) {
                earliestDay = checkboxDate;
            }   
        }
    });

    return earliestDay;
}

// MAKE CALENDAR
function makeCalendar(pname, qty, amount, freq_num, freq_period, refills) {
    var currentDate = new Date(); 
    currentDate.setHours(10);
    currentDate.setMinutes(0);

    if (freq_period === "day"){
        var days_per_refill = ((qty / amount) / freq_num) - 1;
    } else if (freq_period === "week"){
        var weeks_per_refill = ((qty / amount) / freq_num);
        var days_per_refill = (weeks_per_refill * 7) - 1;
        currentDate = findEarliestDayOfWeek(currentDate);
    }

    var endTime = new Date(); 
    endTime.setDate(currentDate.getDate());
    endTime.setHours(currentDate.getHours() + 1);
    calendar = ics(); // Creates calendar object from ics.js

    // For each refill create an event to remind of next refill
    for (let i = 0; i< refills+1; i++){
        currentDate.setDate(currentDate.getDate() + days_per_refill);
        endTime.setDate(endTime.getDate() + days_per_refill);

        var startDateString = currentDate.toISOString();
        var endTimeString = endTime.toISOString(); 

        calendar.addEvent('Last Day of Medication for ' + pname + ' Refill', '', '', startDateString, endTimeString);

        if (i === 0){ days_per_refill += 1;}
    }

    const checkbox = document.getElementById('checkbox');
    if (checkbox.checked) {     // If checkbox ticked, then run makeReminders
        currentDate.setDate(currentDate.getDate());
        currentDate.setHours(23);   // Set to end to day to never miss a reminder
        currentDate.setMinutes(59);
        var startDateString = currentDate.toISOString();

        makeReminders(calendar, freq_num, startDateString);
    }

    calendar.download(pname + ' Calendar File'); // Download calendar file
}


document.getElementById("prescription-form").addEventListener("submit", function(event) {
    event.preventDefault();
    handleForm();
});


// CREATE REMINDERS
function makeReminders(calendar, freq_num, endDate) {
    var currentDate = new Date(); 
    var endTime = new Date(); 

    var rrule = {freq:"DAILY", until:endDate}; // Recurrence rule

    for (var i = 0; i < (freq_num); i++) {
        var reminderTime = (document.getElementById('time' + (i + 1)).value).trim(); // Get reminder times
        var timeParts = reminderTime.split(':');
        var hours = parseInt(timeParts[0]);
        var minutes = parseInt(timeParts[1]);


        currentDate.setHours(hours); // Set the correct time for each reminder time
        currentDate.setMinutes(minutes);
        endTime = currentDate; // Could not add minutes, don't know why, having a time difference of 0 may break the event for some calendars

        var reminderName = "REMINDER: " + pname.value;
        calendar.addEvent(reminderName,'','', currentDate, endTime, rrule); // Create a recurring event for reminders
    } 
}