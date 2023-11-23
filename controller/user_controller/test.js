function startResendTimer() {
  let remainingTime = 5;
  timerElement.style.display = "block";
  resendOTPButton.style.display = "none";
  sendOTPButton.style.display = "none"; // Hide the sendOTPButton

  countdown = setInterval(() => {
      timerElement.textContent = `Resend in ${remainingTime} seconds`;
      remainingTime--;

      if (remainingTime < 0) {
          clearInterval(countdown);
          timerElement.style.display = "none";
          resendOTPButton.style.display = "block";
          sendOTPButton.style.display = "none"; // Ensure sendOTPButton is hidden when timer expires
      }
  }, 1000);
}