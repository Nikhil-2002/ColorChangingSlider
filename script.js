const button = document.getElementById("draggable-button");
const bar = document.getElementById("horizontal-bar");
const colorCircle = document.getElementById("color-circle");
const colorNamesContainer = document.getElementById("color-names");

let stopPoints = [];
let isDragging = false;
let startX;
let startLeft;

fetch("colors.json")
  .then((response) => response.json())
  .then((data) => {
    stopPoints = data.stopPoints;
    createStopPoints(stopPoints);
  });

function createStopPoints(stopPoints) {
  stopPoints.forEach((point) => {
    const stopPoint = document.createElement("div");
    stopPoint.className = "stop-point";
    stopPoint.style.left = point.position;
    stopPoint.style.backgroundColor = point.color;
    stopPoint.setAttribute("data-color", point.color); 
    bar.appendChild(stopPoint);

    const colorName = document.createElement("div");
    colorName.className = "color-name";
    colorName.style.left = point.position;
    colorName.textContent = point.color;
    colorName.style.color = point.color;
    colorNamesContainer.appendChild(colorName);
  });
}

button.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startLeft = button.offsetLeft;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(e) {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  let newLeft = startLeft + dx;
  newLeft = Math.max(0, newLeft);
  newLeft = Math.min(newLeft, bar.clientWidth - button.clientWidth);
  button.style.left = newLeft + "px";
  updateCircleColor();
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  let closestPoint = getClosestPoint();
  if (closestPoint) {
    button.style.left = closestPoint.style.left;
  }
}

function getClosestPoint() {
  let closestPoint = null;
  let closestDistance = Infinity;
  stopPoints.forEach((point) => {
    const stopPointElement = document.querySelector(
      `.stop-point[style*="left: ${point.position}"]`
    );
    const pointRect = stopPointElement.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const distance = Math.abs(buttonRect.left - pointRect.left);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = stopPointElement;
    }
  });
  return closestPoint;
}

function updateCircleColor() {
  let closestPoint = getClosestPoint();
  if (closestPoint) {
    colorCircle.style.backgroundColor = closestPoint.getAttribute("data-color");
  } else {
    colorCircle.style.backgroundColor = "grey";
  }
}
