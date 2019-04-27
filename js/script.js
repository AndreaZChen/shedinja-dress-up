'use strict';

setTimeout(function() {
  $.get("html/introPage.html", function(page) {
    $('#app-main-wrapper').html(page);
  })
}, 2000);