var progressStatus = ["Basic Information", "Goals", "Health", "Schedule"];
function handleInputChange(input) {
  if (
    input.value === "" ||
    input.checkValidity() === false ||
    (input.type === "checkbox" && checkStep1Checkboxes() === false)
  ) {
    input.classList.add("border-danger");
    // Show the error message
    var errorElement = document.querySelector(`p[name="${input.name}Error"]`);
    if (errorElement) {
      errorElement.hidden = false;
    }
  } else {
    input.classList.remove("border-danger");
    // Hide the error message
    var errorElement = document.querySelector(`p[name="${input.name}Error"]`);
    if (errorElement) {
      errorElement.hidden = true;
    }
  }
}

function validateCurrentStep(step) {
  var isValid = true;
  var inputs = document.querySelectorAll(
    "#" + step + " .form-control[required]"
  );
  // Check if step1 and if any checkbox is checked
  if (step === "step2") {
    isValid = checkStep1Checkboxes();
  }

  inputs.forEach(function (input) {
    if (input.value === "" || input.checkValidity() === false) {
      isValid = false;
      input.classList.add("border-danger");
      var errorElement = document.querySelector(`p[name="${input.name}Error"]`);
      if (errorElement) {
        errorElement.hidden = false;
      }
    } else {
      input.classList.remove("border-danger");
      var errorElement = document.querySelector(`p[name="${input.name}Error"]`);
      if (errorElement) {
        errorElement.hidden = true;
      }
    }
  });

  return isValid;
}

document
  .querySelectorAll(".test-step .button")
  .forEach(async function (button) {
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      var stepEl = this.closest(".test-step");
      var stepId = stepEl.getAttribute("id");
      if (!validateCurrentStep(stepId)) {
        return;
      }

      // Check if it's step 4 and handle form submission
      if (stepId === "step4") {
        var formData = collectFormData();

        // Indicate that the form is being submitted
        this.textContent = "Submitting...";
        this.disabled = true;

        try {
          await sendFormDataToBackend(formData);
          // On successful submission, enable the button and change the text back
          this.textContent = "Next";
          this.disabled = false;
        } catch (error) {
          console.error("Submission failed:", error);
          // Handle submission failure (e.g., show error message)
          this.textContent = "Failed. Try Again";
          this.disabled = false;
          return; // Stop the process if submission fails
        }
      }

      // Move to next step
      var nextStep = stepEl.nextElementSibling;

      if (nextStep) {
        stepEl.classList.remove("active");
        nextStep.classList.add("active");
      }

      // Update current step counter
      var currentStep = parseInt(
        document.querySelector(".current-step").textContent,
        10
      );
      document.querySelector(".progressStatus").textContent =
        progressStatus[currentStep];
      document.querySelector(".current-step").textContent = currentStep + 1;
      if (currentStep + 1 == 5) {
        nextStep.classList.add("final");
        //hide this elemet
        document.querySelector(".covid-header").style.display = "none";
        document.querySelector(".anfra-nav").classList.add("last-page");
      }
    });
  });

document.querySelectorAll(".test-step .prev-btn").forEach(function (button) {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    var stepEl = this.closest(".test-step");
    var prevStep = stepEl.previousElementSibling;
    if (prevStep) {
      stepEl.classList.remove("active");
      prevStep.classList.add("active");
    }

    // Update current step counter
    var currentStep = parseInt(
      document.querySelector(".current-step").textContent,
      10
    );
    document.querySelector(".progressStatus").textContent =
      progressStatus[currentStep - 2];
    document.querySelector(".current-step").textContent = currentStep - 1;
  });
});

document.querySelectorAll(".form-control").forEach(function (input) {
  input.addEventListener("input", function () {
    handleInputChange(input);
  });
});
// document.querySelectorAll('.form-control').forEach(function(input) {
//   input.addEventListener('select', function() {
//     handleInputChange(input);
//   });
// });

function checkStep1Checkboxes() {
  var checkboxes = document.querySelectorAll('#step2 input[type="checkbox"]');
  var isAnyCheckboxChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );
  var checkboxErrorElement = document.querySelector("#step2 .input-error");

  if (!isAnyCheckboxChecked) {
    checkboxErrorElement.hidden = false;
    return false;
  } else {
    checkboxErrorElement.hidden = true;
    return true;
  }
}

function collectFormData() {
  var formData = {};
  // Collect data from each input field
  document.querySelectorAll(".form-control").forEach(function (input) {
    if (input.type === "checkbox" || input.type === "radio") {
      if (input.checked) {
        formData[input.name] = input.value;
      }
    } else {
      formData[input.name] = input.value;
    }
  });
  return formData;
}

async function sendFormDataToBackend(formData) {
  return await fetch("YOUR_BACKEND_ENDPOINT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
}
