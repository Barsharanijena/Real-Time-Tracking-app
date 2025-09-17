const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: " scs college ",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  console.log("Received location:", data);
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);

  if (markers[id]) {
    console.log("Updating existing marker for:", id);
    markers[id].setLatLng([latitude, longitude]);
  } else {
    console.log("Creating new marker for:", id);
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`User: ${id.substring(0, 8)}`); // Show first 8 chars of socket ID
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
