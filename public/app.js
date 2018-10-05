// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "#saveComment", function() {
  
  console.log("saving comment")
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#comment").val()
    }
  })
    // With that done, add the note information to the page
    .then(function(data) {
      // console.log(data);
      
      // The title of the article
      console.log("Append")
      // An input to enter a new title
      // $("#comment").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $(data.body).append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      // $("#comment").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
     
    });
});

// When you click the savenote button
$(document).on("click", "#save", function() {

  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/savedarticles/" + thisId,
  })
    .then(function(data) {      
      location.reload();
    })
    .catch(function (err) {
    });
  });

  $("body").on("click", "#delete", function (event) {

    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/deletearticles/" + thisId,
    })
      .then(function (data) {
        location.reload();
      })
      .catch(function (err) {
      });
  });

  $("body").on("click", "#unsave", function (event) {

    var thisId = $(this).attr("data-id");
    console.log("article saved with this id: " + thisId);
    $.ajax({
      method: "PUT",
      url: "/unsavedarticles/" + thisId,
    })
      .then(function (data) {
        location.reload();
      })
      .catch(function (err) {
      });
  });