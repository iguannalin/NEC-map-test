window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
  const container = document.getElementById("container");

  // fetch("https://nec-airtable.netlify.app/.netlify/functions/api").then((r) => r.json()).then((data) => {
  //   console.log(data);
  // });
  fetch("scratch.json").then((r) => r.json()).then((data) => {
    console.log(data);
  });
});
