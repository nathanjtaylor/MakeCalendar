document.getElementById('checkbox').addEventListener('change', function() {
    var datePlannerContainer = document.getElementById('datePlannerContainer');
    var freqValue = parseInt(document.getElementById("freq_num").value);
    var freqPeriod = document.getElementById("freq_period").value;

    datePlannerContainer.innerHTML = ''; // Clear previous content

    if(freqPeriod === "week"){freqValue = 1;} // Sets max number of dosages per day to 1, if 8 medications per week, this breaks

    if (this.checked) {
      for (var i = 0; i < (freqValue); i++) {
        var textBox = document.createElement('input');
        textBox.type = 'time';
        textBox.id = 'time' + (i + 1);
        textBox.placeholder = 'Text Box ' + (i + 1);
        datePlannerContainer.appendChild(textBox);
      }
    }
  });

      // Function to append checkboxes when an weekly is selected
document.getElementById('freq_period').addEventListener('change', function() {
  var dayPlannerContainer = document.getElementById("dayPlannerContainer");
  var freq_num = parseInt(document.getElementById("freq_num").value);

  dayPlannerContainer.innerHTML = ''; // Clear previous content
  
  if (this.value === "week" && freq_num >= 1){
    const checkboxesHTML = `
    <label>What days do you take medication?</label><br>
    <input type="checkbox" class="dayCheckbox" name="day" value="Sunday">
    <label for="sunday">Sunday</label><br>
    <input type="checkbox" class="dayCheckbox" name="day" value="Monday">
    <label for="monday">Monday</label><br>
    <input type="checkbox" class="dayCheckbox" name="day" value="Tuesday">
    <label for="tuesday">Tuesday</label><br>
    <input type="checkbox" class="dayCheckbox" name="day" value="Wednesday">
    <label for="wednesday">Wednesday</label><br>
    <input type="checkbox" class="dayCheckbox" name="day" value="Thursday">
    <label for="thursday">Thursday</label><br>
    <input type="checkbox" class="dayCheckbox" name="day" value="Friday">
    <label for="friday">Friday</label><br>
    <input type="checkbox" class="dayCheckbox" name="day" value="Saturday">
    <label for="saturday">Saturday</label><br>
    `;

    dayPlannerContainer.innerHTML = checkboxesHTML;
    limitCheckboxSelection();
  }
});


function limitCheckboxSelection() {
  var maxAllowed = parseInt(document.getElementById("freq_num").value);
  const checkboxes = document.querySelectorAll('.dayCheckbox');

  checkboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
          let checkedCount = document.querySelectorAll('.dayCheckbox:checked').length;
          if (checkedCount > maxAllowed) {
              this.checked = false;
          }
      });
  });
}




// function updateForm() {
//   var selectedForm = document.getElementById("medicineForm").value;
//   if (selectedForm === "Solid Dosage") {
//     document.getElementById("solidDosageFields").style.display = "block";
//     document.getElementById("liquidDosageFields").style.display = "none";
//   } else if (selectedForm === "Liquid Dosage") {
//     document.getElementById("solidDosageFields").style.display = "none";
//     document.getElementById("liquidDosageFields").style.display = "block";
//   }
// }