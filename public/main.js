$(function() {
  // set h1 and zip variables equal to header and input field
  const $h1 = $("h1");
  const $zip = $("input[name='zip']");

  $("form").on("submit", function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    // jQuery .trim removes whitespace (space, tabs, newlines, etc.. from beginning of the line)
    const zipCode = $.trim($zip.val());
    // Change h1 text to say loading
    $h1.text("Loading...");

    // SEND AN AJAX REQUEST
    const request = $.ajax({
      // Request URL is "/" + "zipcode"
      url: "/" + zipCode,
      // Request ask for JSON response?
      dataType: "json"
    });
    // When the request Succeeds, update the "h1" with the current Temperature
    request.done(function(data) {
      // Set the temperature variable to the data returned from response.
      // (Response is a JSON object with a temperature property, being used here
      const temperature = data.temperature; // <-
      $h1.html("It is " + temperature + "&#176; in " + zipCode + ".");
    });

    // If there's an error, make sure the error is shown
    request.fail(function() {
      $h1.text("Error!");
    });
  });
});
