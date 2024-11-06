let map;
let hiddenPoint;
let clickedPoint = null;
let clickedMarker = null;
let hiddenMarker = null;
const hintImage = document.getElementById("hint");
const distanceDisplay = document.getElementById("distance");
const resetButton = document.getElementById("resetButton");
const finalAnswerButton = document.getElementById("finalAnswerButton");

// 初期化
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.0, lng: 0.0 },
        zoom: 2,
    });

    setRandomHiddenPoint();

    map.addListener("click", (event) => {
        clickedPoint = event.latLng;
        distanceDisplay.textContent = "Distance: --";

        if (clickedMarker) {
            clickedMarker.setMap(null);
        }

        clickedMarker = new google.maps.Marker({
            position: clickedPoint,
            map: map,
            title: "Your Guess",
            label: "G",
        });
    });

    resetButton.addEventListener("click", setRandomHiddenPoint);
    finalAnswerButton.addEventListener("click", () => {
        if (clickedPoint) {
            calculateDistance(clickedPoint);

            if (hiddenMarker) {
                hiddenMarker.setMap(null);
            }

            hiddenMarker = new google.maps.Marker({
                position: hiddenPoint,
                map: map,
                title: "Hidden Location",
                label: "H",
            });

            adjustMapBounds();
        } else {
            alert("Please click on the map to make a guess.");
        }
    });
}

function setRandomHiddenPoint() {
    distanceDisplay.textContent = "Distance: --";
    hintImage.src = "";

    if (clickedMarker) {
        clickedMarker.setMap(null);
        clickedMarker = null;
    }
    if (hiddenMarker) {
        hiddenMarker.setMap(null);
        hiddenMarker = null;
    }

    fetch('/api/myapi?lat=' + hiddenPoint.lat + '&lng=' + hiddenPoint.lng)
        .then(response => response.json())
        .then(data => {
            hintImage.src = data.imageUrl;
        });
}

function calculateDistance(clickedPoint) {
    const R = 6371;
    const lat1 = clickedPoint.lat();
    const lon1 = clickedPoint.lng();
    const lat2 = hiddenPoint.lat;
    const lon2 = hiddenPoint.lng;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    distanceDisplay.textContent = `Distance: ${distance.toFixed(2)} km`;
}

function adjustMapBounds() {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(clickedPoint);
    bounds.extend(hiddenPoint);
    map.fitBounds(bounds);
}
