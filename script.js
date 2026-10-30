// ---------- 1. TRAIL DATA (an array of objects, easy to edit) ----------
const trails = [
  { name: "Triund Trek", location: "Himachal Pradesh", level: "Easy", altitude: 2850, duration: "2 days", season: "March – June, Sept – Nov",
    start: "McLeod Ganj", desc: "A short climb with wide views of the Dhauladhar range. A good first trek." },
  { name: "Dayara Bugyal", location: "Uttarakhand", level: "Easy", altitude: 3408, duration: "4 days", season: "April – June, Sept – Nov",
    start: "Raithal", desc: "Gentle meadows that turn into a snow playground in winter." },
  { name: "Kedarkantha", location: "Uttarakhand", level: "Moderate", altitude: 3800, duration: "5 days", season: "December – April",
    start: "Sankri", desc: "Pine forests, frozen lakes and a summit with a 360 degree view." },
  { name: "Valley of Flowers", location: "Uttarakhand", level: "Moderate", altitude: 3658, duration: "6 days", season: "July – September",
    start: "Govindghat", desc: "A protected valley full of wildflowers during the monsoon." },
  { name: "Roopkund", location: "Uttarakhand", level: "Difficult", altitude: 5029, duration: "8 days", season: "May – June, Sept – Oct",
    start: "Lohajung", desc: "A glacial lake with ancient skeletons. Steep, cold and remote." },
  { name: "Stok Kangri", location: "Ladakh", level: "Difficult", altitude: 6153, duration: "8 days", season: "July – September",
    start: "Stok Village", desc: "A non-technical peak, but the extreme height needs full acclimatisation." }
];

// ---------- 2. SHOW TRAIL CARDS ----------
const grid = document.getElementById("trailGrid");

function showTrails(level) {
  grid.innerHTML = "";                       // clear old cards
  trails.forEach(function (t) {
    if (level !== "All" && t.level !== level) return;   // skip trails that do not match
    grid.innerHTML +=
      '<article class="card ' + t.level + '">' +
        '<h3>' + t.name + '</h3>' +
        '<p class="location">' + t.location + '</p>' +
        '<span class="badge ' + t.level + '">' + t.level + '</span>' +
        '<dl>' +
          '<dt>Altitude</dt><dd>' + t.altitude.toLocaleString() + ' m</dd>' +
          '<dt>Duration</dt><dd>' + t.duration + '</dd>' +
          '<dt>Best season</dt><dd>' + t.season + '</dd>' +
          '<dt>Start point</dt><dd>' + t.start + '</dd>' +
        '</dl>' +
        '<p class="desc">' + t.desc + '</p>' +
      '</article>';
  });
}
showTrails("All");

// ---------- 3. FILTER BUTTONS ----------
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    showTrails(btn.dataset.level);
  });
});

// ---------- 4. MOBILE MENU ----------
const navLinks = document.getElementById("navLinks");
document.getElementById("menuBtn").addEventListener("click", function () {
  navLinks.classList.toggle("open");
});
navLinks.addEventListener("click", function () { navLinks.classList.remove("open"); });

// ---------- 5. ALTITUDE SAFETY CHECKER ----------
document.getElementById("checkBtn").addEventListener("click", function () {
  const altitude = Number(document.getElementById("altInput").value);
  const exp = document.getElementById("expInput").value;
  const altError = document.getElementById("altError");
  const expError = document.getElementById("expError");
  const box = document.getElementById("result");

  altError.textContent = "";
  expError.textContent = "";
  box.className = "result";

  // Check the input first
  let ok = true;
  if (document.getElementById("altInput").value === "" || altitude < 0 || altitude > 8850) {
    altError.textContent = "Enter an altitude between 0 and 8,850 metres.";
    ok = false;
  }
  if (exp === "") {
    expError.textContent = "Please choose your experience level.";
    ok = false;
  }
  if (!ok) return;

  // Experienced trekkers get a little more room before each warning
  const bonus = { beginner: 0, intermediate: 500, experienced: 1000 }[exp];
  const adjusted = altitude - bonus;

  let status, title, advice;
  if (adjusted < 2500) {
    status = "safe"; title = "Low risk";
    advice = "You are at a comfortable height. Drink plenty of water and keep a steady pace.";
  } else if (adjusted < 3500) {
    status = "caution"; title = "Caution: watch for symptoms";
    advice = "Altitude sickness can start here. Ascend slowly, rest often and drink 3 to 4 litres of water. Stop climbing if you get a headache.";
  } else if (adjusted < 4500) {
    status = "danger"; title = "High risk: acclimatise first";
    advice = "Do not climb higher until you have spent at least one night at this height. Go with a guide, and descend if symptoms get worse.";
  } else {
    status = "danger"; title = "Very high risk";
    advice = "This height is dangerous for your experience level. Only continue with a trained guide, oxygen and an emergency plan. When in doubt, go down.";
  }

  // Extra note for beginners at real altitude
  if (exp === "beginner" && altitude >= 3000) {
    advice += " As a beginner, choose lower trails like Triund or Dayara Bugyal first.";
  }

  box.innerHTML = "<strong>" + title + "</strong>" + advice;
  box.className = "result show " + status;
});

// ---------- 6. CONTACT FORM ----------
document.getElementById("sendBtn").addEventListener("click", function () {
  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const msg = document.getElementById("cMsg").value.trim();
  const out = document.getElementById("contactResult");

  document.getElementById("nameError").textContent = name === "" ? "Please enter your name." : "";
  const emailOk = email.includes("@") && email.includes(".");
  document.getElementById("emailError").textContent = emailOk ? "" : "Enter a valid email like name@example.com.";
  document.getElementById("msgError").textContent = msg.length < 10 ? "Write at least 10 characters." : "";

  out.className = "result safe";
  if (name === "" || !emailOk || msg.length < 10) return;

  out.innerHTML = "<strong>Message sent</strong>Thank you, " + name.replace(/</g, "&lt;") + ". We will reply to your email soon.";
  out.className = "result safe show";
  document.getElementById("cName").value = "";
  document.getElementById("cEmail").value = "";
  document.getElementById("cMsg").value = "";
});
