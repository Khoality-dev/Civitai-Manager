document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("sendRequest");

  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url;
      const model_id = currentUrl.split("/")[4];
        sendHttpRequest(model_id);
    });
  });
});

document.getElementById("sendRequest");

function sendHttpRequest(model_id) {
  const endpoint = "https://127.0.0.1:5000/fetch-model?model_id=" + model_id;
  const button = document.getElementById("sendRequest");
  button.textContent = "Fetching...";
  fetch(endpoint, {
    method: "GET",
  })
    .then((response) => {
      console.log("HTTP request sent successfully");
      button.textContent = "Success!";
      button.classList.remove("loading");
      setTimeout(() => {
        button.textContent = "Sync";
      }, 1000);
    })
    .catch((error) => {
      console.error("Error sending HTTP request:", error);
      button.textContent = "Failed!";
      button.classList.remove("loading");
      setTimeout(() => {
        button.textContent = "Sync";
      }, 1000);
    });
}
