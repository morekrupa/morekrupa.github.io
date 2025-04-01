// Initialize map when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const checkOrderForm = document.getElementById("check-order-form");

  if (checkOrderForm) {
      checkOrderForm.addEventListener("submit", (e) => {
          e.preventDefault();

          const orderId = document.getElementById("order-id").value.trim();
          const orderIdError = document.getElementById("order-id-error");
          const orderStatus = document.getElementById("order-status");
          const orderMap = document.getElementById("order-map");
          const locationError = document.getElementById("location-error");

          orderIdError.textContent = "";
          locationError.style.display = "none";

          if (!orderId) {
              orderIdError.textContent = "Please enter your order ID";
              return;
          }

          const statuses = ["preparing", "on-the-way", "delivered"];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

          orderStatus.className = "order-status " + randomStatus;
          orderStatus.style.display = "block";

          if (randomStatus === "on-the-way") {
              orderStatus.innerHTML = "<h3>Order Status: On the Way</h3><p>Your order is on the way!</p>";
              orderMap.style.display = "block";
              initLeafletMap();
          } else {
              orderStatus.innerHTML = `<h3>Order Status: ${randomStatus.charAt(0).toUpperCase() + randomStatus.slice(1)}</h3>`;
              orderMap.style.display = "none";
          }
      });
  }
});

let map, userMarker, deliveryMarker;

function initLeafletMap() {
  map = L.map('order-map').setView([0, 0], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
  }).addTo(map);

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          userMarker = L.marker([userLat, userLng]).addTo(map)
              .bindPopup("Your Location").openPopup();

          const deliveryPoint = [userLat + 0.005, userLng + 0.005];
          deliveryMarker = L.marker(deliveryPoint).addTo(map)
              .bindPopup("Delivery Incoming").openPopup();

          L.polyline([ [userLat, userLng], deliveryPoint ], { color: 'blue' }).addTo(map);

          map.fitBounds([ [userLat, userLng], deliveryPoint ]);
      }, () => {
          locationError.style.display = "block";
      });
  }
}
