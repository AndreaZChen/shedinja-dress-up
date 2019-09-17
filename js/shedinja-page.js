'use strict';

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

// Center Shedinja on load only. I can't be bothered to do it better than that right now.
function centerShedinja() {
  var shedinja = $("#shedinja");

  shedinja
    .css("left", (($(window).width() - shedinja.width()) / 2).toString() + "px")
    .css("top", (($(window).height() - shedinja.height()) / 2).toString() + "px");
}

centerShedinja();

$("#click-to-continue-text").on("click", function() {
  transitionToPage("./pages/page2.html");
});

var draggedElement = null;
let initialOffsetX = 0;
let initialOffsetY = 0;
let initialDraggedItemX = 0;
let initialDraggedItemY = 0;

function onStartDrag (event) {
  event.preventDefault();
  draggedElement = $(this);

  if (event.touches) {
    initialOffsetX = event.touches[0].clientX;
    initialOffsetY = event.touches[0].clientY;
  } else {
    initialOffsetX = event.clientX;
    initialOffsetY = event.clientY;
  };

  initialDraggedItemX = parseInt(draggedElement.css("left"));
  initialDraggedItemY = parseInt(draggedElement.css("top"));
};

$(".draggable-accessory").on("mousedown.dragdrop", onStartDrag);
$(".draggable-accessory").on("touchstart.dragdrop", onStartDrag);

function onDrag (event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();
    var eventX;
    var eventY;
    if (event.touches) {
      eventX = event.touches[0].clientX;
      eventY = event.touches[0].clientY;
    } else {
      eventX = event.clientX;
      eventY = event.clientY;
    };

    let newX = initialDraggedItemX + eventX - initialOffsetX;
    let newY = initialDraggedItemY + eventY - initialOffsetY;

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
}

$(document).on("mousemove.dragdrop", onDrag);
$(document).on("touchmove.dragdrop", onDrag);

const tiaraTargetPercentX = [-0.27, -0.1];
const tiaraTargetPercentY = [-0.31, -0.15];

const shedinjaPositiveDialogue = [
  "Thanks!",
  "Aw wow!",
  "I really appreciate that!",
  "Cool!",
  "Awesome!",
  "That's really sweet of you!",
  "I love it...",
];

const shedinjaNegativeDialogue = [
  "Wrong spot...",
  "Move it closer...",
  "Can you try harder...?",
  "Are you sure...?",
  "That's not where that goes...",
  "You're not supposed to put it there...",
  "Move it better please...",
];

function makeShedinjaSpeak (isHappy) {
  let words = "";
  if (isHappy) {
    let randomIndex = Math.floor(
      Math.random() * shedinjaPositiveDialogue.length
    );
    words = shedinjaPositiveDialogue[randomIndex];
  } else {
    let randomIndex = Math.floor(
      Math.random() * shedinjaNegativeDialogue.length
    );
    words = shedinjaNegativeDialogue[randomIndex];
  };

  let shedinja = $("#shedinja");
  let shedinjaHeadX =
    parseInt(shedinja.css("left"))
    + 0.25 * shedinja.width();
  let shedinjaHeadY =
    parseInt(shedinja.css("top"))
    + 0.3 * shedinja.height();

  // Heuristically good values for positioning Shedinja's speech bubbles
  let leftValue = shedinjaHeadX + (Math.random() - 0.5) * shedinja.width() * 0.1;
  let topValue = shedinjaHeadY - Math.random() * shedinja.height() * 0.15;

  let newSpanElement = $(`
    <span class="shedinja-spoken-words">${words}</span>
  `)
    .css("left", leftValue.toString() + "px")
    .css("top", topValue.toString() + "px");

  $("#app-content-display-area").append(newSpanElement);

  newSpanElement.fadeOut(1500, function() {
    newSpanElement.remove();
  });
}

function onDragEnd (event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();

    if (draggedElement.attr("id") === "tiara") {
      // Check if sufficiently close to Shedinja's beautiful head
      var shedinja = $("#shedinja");
      let shedinjaCenterX =
        parseInt(shedinja.css("left"))
        + shedinja.width() / 2;
      let shedinjaCenterY =
        parseInt(shedinja.css("top"))
        + shedinja.height() / 2;
      let currentDraggedItemCenterX =
        parseInt(draggedElement.css("left"))
        + draggedElement.width() / 2;
      let currentDraggedItemCenterY =
        parseInt(draggedElement.css("top"))
        + draggedElement.height() / 2;

      let percentOffsetX = (currentDraggedItemCenterX - shedinjaCenterX) / shedinja.width();
      let percentOffsetY = (currentDraggedItemCenterY - shedinjaCenterY) / shedinja.height();

      if ((percentOffsetX > tiaraTargetPercentX[0])
          && (percentOffsetX < tiaraTargetPercentX[1])
          && (percentOffsetY > tiaraTargetPercentY[0])
          && (percentOffsetY < tiaraTargetPercentY[1])) {
        makeShedinjaSpeak(true);
        draggedElement.attr("draggable", false);
        draggedElement.toggleClass("draggable-accessory", false);
        draggedElement.toggleClass("pulsating-accessory", true);
        draggedElement.off(".dragdrop");
      } else {
        makeShedinjaSpeak(false);
      }
    }

    draggedElement = null;
  }
};

$(document).on("mouseup.dragdrop", onDragEnd);
$(document).on("touchend.dragdrop", onDragEnd);