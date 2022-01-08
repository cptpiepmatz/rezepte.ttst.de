function switchLight() {
  console.log("will switch light, now!");
  const sessionItem = "lightSwitch";
  let currentLight = localStorage.getItem(sessionItem);
  if (currentLight !== "dark") {
    localStorage.setItem(sessionItem, "dark");
    document.body.classList.add("dark");
    document.getElementById("light-switch").innerHTML = "Licht an!";
    return;
  }
  localStorage.setItem(sessionItem, "light");
  document.body.classList.remove("dark");
  document.getElementById("light-switch").innerHTML = "Licht aus!";
}

function loadLightSwitch() {
  if (localStorage.getItem("lightSwitch") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("light-switch").innerHTML = "Licht an!";
  }
}