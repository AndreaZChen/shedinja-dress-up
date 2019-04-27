'use strict';

function transitionContentTo(htmlContent) {
  $('#app-main-wrapper').fadeOut(500, function() {
    $(this).html(htmlContent).fadeIn(500);
  });
};

function transitionToPage(pageFileName) {
  $.get(pageFileName, function(page) {
    transitionContentTo(page);
  });
};