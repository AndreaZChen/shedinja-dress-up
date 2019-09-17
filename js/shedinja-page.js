'use strict';

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

$("#click-to-continue-text").on("click", function() {
  transitionToPage("./pages/page2.html");
});

var draggedElement = null;
let initialOffsetX = 0;
let initialOffsetY = 0;
let initialDraggedItemX = 0;
let initialDraggedItemY = 0;

function onStartDrag (event) {
  // console.log("onStartDrag event");
  // console.log(event);

  event.preventDefault();
  draggedElement = $(this);

  initialOffsetX = event.clientX;
  initialOffsetY = event.clientY;

  initialDraggedItemX = parseInt(draggedElement.css("left"));
  initialDraggedItemY = parseInt(draggedElement.css("top"));
};

$(".draggable-accessory").on("mousedown.dragdrop", onStartDrag);
$(".draggable-accessory").on("touchstart.dragdrop", onStartDrag);

$(document).on("mousemove.dragdrop", function(event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();
    let newX = initialDraggedItemX + event.clientX - initialOffsetX;
    let newY = initialDraggedItemY + event.clientY - initialOffsetY;

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

const tiaraTargetX = [-130, -50];
const tiaraTargetY = [-150, -70];

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
    - 0.25 * shedinja.width();
  let shedinjaHeadY =
    parseInt(shedinja.css("top"))
    - 0.5 * shedinja.height();

  let leftValue = shedinjaHeadX + (Math.random() - 0.5) * 50;
  let topValue = shedinjaHeadY + Math.random() * 70;

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

$(document).on("mouseup.dragdrop", function(event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();

    if (draggedElement.attr("id") === "tiara") {
      // Check if sufficiently close to Shedinja's beautiful head
      var shedinja = $("#shedinja");
      let shedinjaX = parseInt(shedinja.css("left"));
      let shedinjaY = parseInt(shedinja.css("top"));
      let currentDraggedItemCenterX =
        parseInt(draggedElement.css("left"))
        + draggedElement.width() / 2;
      let currentDraggedItemCenterY =
        parseInt(draggedElement.css("top"))
        + draggedElement.height() / 2;

      if ((currentDraggedItemCenterX - shedinjaX > tiaraTargetX[0])
          && (currentDraggedItemCenterX - shedinjaX < tiaraTargetX[1])
          && (currentDraggedItemCenterY - shedinjaY > tiaraTargetY[0])
          && (currentDraggedItemCenterY - shedinjaY < tiaraTargetY[1])) {
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
})