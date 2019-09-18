'use strict';

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

var previousShedinjaWidth = null;
var previousShedinjaHeight = null;
function repositionShedinjaAndAccessories() {
  let shedinja = $("#shedinja");
  let accessories = $(".accessory");

  let shedinjaOldX = parseInt(shedinja.css("left"));
  let shedinjaOldY = parseInt(shedinja.css("top"));

  let shedinjaNewX = ($(window).width() - shedinja.width()) / 2;
  let shedinjaNewY = ($(window).height() - shedinja.height()) / 2;

  shedinja
    .css("left", shedinjaNewX.toString() + "px")
    .css("top", shedinjaNewY.toString() + "px");

  let diffX = shedinjaNewX - shedinjaOldX;
  let diffY = shedinjaNewY - shedinjaOldY;

  let isWidthResized = previousShedinjaWidth !== null && previousShedinjaHeight !== null
    && ((previousShedinjaWidth !== shedinja.width()) || (previousShedinjaHeight !== shedinja.height()));

  accessories.each(function () {
    let element = $(this);
    let elementOldX = parseInt(element.css("left"));
    let elementOldY = parseInt(element.css("top"));

    if (isWidthResized) {
      /* Shedinja grew fatter or thinner. Assume other elements resized by the same factor.
        Calculate what their new distance from Shedinja should be. */
      let fractionalXChange = shedinja.width() / previousShedinjaWidth;
      let fractionalYChange = shedinja.height() / previousShedinjaHeight;

      let elementOldDistanceX = elementOldX - shedinjaOldX;
      let elementOldDistanceY = elementOldY - shedinjaOldY;

      let elementNewDistanceX = elementOldDistanceX * fractionalXChange;
      let elementNewDistanceY = elementOldDistanceY * fractionalYChange;

      let elementNewX = shedinjaNewX + elementNewDistanceX;
      let elementNewY = shedinjaNewY + elementNewDistanceY;

      let viewportWidth = $(window).width();
      let viewportHeight = $(window).height();
      let elementNewWidth = element.width();
      let elementNewHeight = element.height();
      elementNewX = clamp(elementNewX, 0, viewportWidth - elementNewWidth);
      elementNewY = clamp(elementNewY, 0, viewportHeight - elementNewHeight);

      element
        .css("left", elementNewX.toString() + "px")
        .css("top", elementNewY.toString() + "px");
    } else {
      // Shedinja didn't grow fatter on thinner. Just translate along with it.
      element
        .css("left", (elementOldX + diffX).toString() + "px")
        .css("top", (elementOldY + diffY).toString() + "px");
    }
  });

  previousShedinjaWidth = shedinja.width();
  previousShedinjaHeight = shedinja.height();
}

repositionShedinjaAndAccessories();

$(window).on("resize.dragdrop", repositionShedinjaAndAccessories);

$("#click-to-continue-text").on("click", function() {
  transitionToPage("./pages/page2.html");
});

var draggedElement = null;
var initialOffsetX = 0;
var initialOffsetY = 0;
var initialDraggedItemX = 0;
var initialDraggedItemY = 0;

function onStartDrag (event) {
  event.preventDefault();
  draggedElement = $(this);
  draggedElement.toggleClass("shrunk", false);
  $(".most-recent-dragged").toggleClass("most-recent-dragged", false);
  draggedElement.toggleClass("most-recent-dragged", true);

  $(".attached.accessory").toggleClass("animating", false);
  $("#shedinja").toggleClass("animating", false);

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

$(".draggable.accessory").on("mousedown.dragdrop", onStartDrag);
$(".draggable.accessory").on("touchstart.dragdrop", onStartDrag);

function onDrag (event) {
  if (draggedElement !== null && draggedElement !== undefined) {
    event.preventDefault();
    let eventX;
    let eventY;
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
  "Move it somewhere else...",
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
    <span class="shedinja-spoken-words unselectable">${words}</span>
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

    // Check if sufficiently close to Shedinja's beautiful head
    let shedinja = $("#shedinja");
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

    let wasSuccessful;
    if (draggedElement.attr("id") === "tiara") {
      wasSuccessful = onTiaraDropped(percentOffsetX, percentOffsetY);
    }
    else if (draggedElement.attr("id") === "necktie") {
      wasSuccessful = onNecktieDropped(percentOffsetX, percentOffsetY);
    }
    else if (draggedElement.attr("id") === "croc") {
      wasSuccessful = onCrocDropped(percentOffsetX, percentOffsetY);
    }

    if (wasSuccessful) {
      draggedElement
        .toggleClass("shrunk", false)
        .toggleClass("draggable", false)
        .toggleClass("attached", true)
        .toggleClass("most-recent-dragged", false)
        .attr("draggable", false)
        .off(".dragdrop");
    } else {
      draggedElement.toggleClass("shrunk", true);
    }

    $(".attached.accessory").toggleClass("animating", true);
    shedinja.toggleClass("animating", true);
    draggedElement = null;

    if ($(".accessory.draggable").length == 0) {
      onAllAccessoriesAttached();
    }
  }
};

$(document).on("mouseup.dragdrop", onDragEnd);
$(document).on("touchend.dragdrop", onDragEnd);

const tiaraTargetPercentX = [-0.27, -0.1];
const tiaraTargetPercentY = [-0.31, -0.15];

function onTiaraDropped(percentOffsetX, percentOffsetY) {
  if ((percentOffsetX > tiaraTargetPercentX[0])
      && (percentOffsetX < tiaraTargetPercentX[1])
      && (percentOffsetY > tiaraTargetPercentY[0])
      && (percentOffsetY < tiaraTargetPercentY[1])) {
    makeShedinjaSpeak(true);
    return true;
  } else {
    makeShedinjaSpeak(false);
    return false;
  }
}

const necktieTargetPercentX = [-0.15, -0.03];
const necktieTargetPercentY = [0.2, 0.3];

function onNecktieDropped(percentOffsetX, percentOffsetY) {
  if ((percentOffsetX > necktieTargetPercentX[0])
      && (percentOffsetX < necktieTargetPercentX[1])
      && (percentOffsetY > necktieTargetPercentY[0])
      && (percentOffsetY < necktieTargetPercentY[1])) {
    makeShedinjaSpeak(true);
    return true;
  } else {
    makeShedinjaSpeak(false);
    return false;
  }
}

const crocTargetPercentX = [-0.07, 0.025];
const crocTargetPercentY = [0.35, 0.45];

function onCrocDropped(percentOffsetX, percentOffsetY) {
  if ((percentOffsetX > crocTargetPercentX[0])
      && (percentOffsetX < crocTargetPercentX[1])
      && (percentOffsetY > crocTargetPercentY[0])
      && (percentOffsetY < crocTargetPercentY[1])) {
    makeShedinjaSpeak(true);
    return true;
  } else {
    makeShedinjaSpeak(false);
    return false;
  }
}

function onAllAccessoriesAttached() {
  $("#success-message").show();
};
