(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  const errorMessage = document.getElementById("form-error");
  const successMessage = document.getElementById("form-success");

  if (!form || !errorMessage || !successMessage) {
    return;
  }

  const requiredFields = [
    document.getElementById("contact-name"),
    document.getElementById("contact-email"),
    document.getElementById("contact-subject"),
    document.getElementById("contact-message")
  ];

  function hideMessages() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    successMessage.textContent = "";
    successMessage.style.display = "none";
  }

  function showError(message, field) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    successMessage.textContent = "";
    successMessage.style.display = "none";

    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  requiredFields.forEach(function (field) {
    field.addEventListener("input", function () {
      field.removeAttribute("aria-invalid");
      if (field.checkValidity()) {
        field.setCustomValidity("");
      }
    });
    field.addEventListener("change", function () {
      field.removeAttribute("aria-invalid");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideMessages();

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        showError("Please complete all required fields before submitting.", field);
        return;
      }

      if (!field.checkValidity()) {
        showError("Please enter a valid email address and check the required fields.", field);
        return;
      }
    }

    const email = document.getElementById("contact-email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError("Please enter a valid email address, for example name@example.com.", email);
      return;
    }

    successMessage.textContent =
      "Thank you. Your form passed validation. This demonstration website does not send messages to a server.";
    successMessage.style.display = "block";
    form.reset();
  });
}());
