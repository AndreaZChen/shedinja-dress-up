'use strict';

function transitionContentTo(htmlContent) {
  $('#app-content-display-area').fadeOut(500, function() {
    $(this).html(htmlContent).fadeIn(500);
  });
};

var isTransitioning = false;

function transitionToPage(pageFileName, scriptFileName) {
  if (!isTransitioning) {
    let contentDisplayArea = $('#app-content-display-area');
    isTransitioning = true;
    $.get(pageFileName, function(page) {
      contentDisplayArea.fadeOut(500, function() {
        contentDisplayArea.html(page);

        if (scriptFileName) {
          // If there is a script to load, don't fade in until script has executed
          $.getScript(scriptFileName, function() {
            contentDisplayArea.fadeIn(500, function() {
              isTransitioning = false;
            });
          })
            .fail(function (jqxhr, settings, exception) {
              console.log(exception);
            })
        } else {
          contentDisplayArea.fadeIn(500, function() {
            isTransitioning = false;
          });
        }
      });
    })
    .fail(function (jqxhr, settings, exception) {
      console.log(exception);
    });
  }
};

$("#audio-player").data("isPlaying", false);

$("#mute-button-div").on("click", function () {
  const player = $("#audio-player");
  const isPlaying = player.data("isPlaying");
  var clickedElement = $(this);
  if (isPlaying) {
    player.trigger("pause");
    player.data("isPlaying", false);
    clickedElement.html(
      `<img draggable=false class="clickable" src="./assets/volume_inactive.svg">
      </img>`
    );
  } else {
    player.trigger("play");
    player.data("isPlaying", true);
    clickedElement.html(
      `<img draggable=false class="clickable" src="./assets/volume_active.svg">
      </img>`
    );
  };
});

$("#click-to-begin-text").on("click", function() {
  transitionToPage("./pages/shedinja-page.html", "./js/shedinja-page.js");
});

function preloadImages(images) {
  $(images).each(function(){
      $('<img/>')[0].src = this;
  });
}

preloadImages([
  "./assets/volume_active.svg",
  "./assets/shedinja.png",
  "./assets/tiara.png",
  "./assets/necktie.png",
  "./assets/croc.png",
]);