'use strict';

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

$("#click-to-continue-text").on("click", function() {
  transitionToPage("./pages/page2.html");
});

var draggedElement = null;
let currentOffsetX = 0;
let currentOffsetY = 0;
let currentDraggedItemX = 0;
let currentDraggedItemY = 0;

$(".draggable-accessory").on("mousedown", function(event) {
  event.preventDefault();
  draggedElement = $(this);

  currentOffsetX = event.clientX;
  currentOffsetY = event.clientY;

  currentDraggedItemX = parseInt(draggedElement.css("left"));
  currentDraggedItemY = parseInt(draggedElement.css("top"));
})

$(document).on("mousemove", function(event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();
    let newX = currentDraggedItemX + event.clientX - currentOffsetX;
    let newY = currentDraggedItemY + event.clientY - currentOffsetY;

    let currentDraggedItemWidth = parseInt(draggedElement.css("width"));
    let currentDraggedItemHeight = parseInt(draggedElement.css("height"));
    let viewportWidth = $(window).width();
    let viewportHeight = $(window).height();

    newX = clamp(newX, 0, viewportWidth - currentDraggedItemWidth);
    newY = clamp(newY, 0, viewportHeight - currentDraggedItemHeight);

    draggedElement
      .css("left", newX.toString() + "px")
      .css("top", newY.toString() + "px");
  };
})

$(document).on("mouseup", function(event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();
    console.log("New left value");
    console.log(draggedElement.css("left"));
    console.log("New top value");
    console.log(draggedElement.css("top"));
    draggedElement = null;
  }
})