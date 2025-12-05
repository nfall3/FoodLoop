/* FOOD PANTRIES DATA */
const pantriesData = [
  {
    id: 1,
    name: "Greater Baton Rouge Food Bank",
    location: "Baton Rouge, LA",
    description:
      "Serving 11 parishes in the Baton Rouge area for over 40 years. The food bank helps feed 7,300 people each day through more than 100 agency partners, providing food and educational outreach completely free of charge.",
    iconColor: "orange",
    icon: "🏢",
    website: "https://brfoodbank.org/",
  },
  {
    id: 2,
    name: "The Shepherd's Market",
    location: "230 Renee Drive, Baton Rouge, LA 70810",
    description:
      "A client-choice food pantry serving south Baton Rouge (zip codes 70808, 70809, 70810, 70820). Shop in a grocery-store setting with dignity. Operating hours: Monday 3:30-5:30 PM, Tuesday and Thursday 8:00-10:00 AM.",
    iconColor: "green",
    icon: "🛒",
    website: "https://shepherdsmarket.org/",
  },
  {
    id: 3,
    name: "HOPE Ministries Client Choice Food Pantry",
    location: "4643 Winbourne Ave, Baton Rouge, LA 70805",
    description:
      "Serving the 70805 zip code with a client-choice grocery store experience where families select food meeting their nutritional needs. Features Mr. Eddie's Kitchen with cooking demonstrations and nutrition classes.",
    iconColor: "red",
    icon: "❤️",
    website: "https://www.hopebr.org/client-choice-food-pantry",
  },
  {
    id: 4,
    name: "Lotus Food Pantry",
    location: "1701 Main St (The Lotus Center), Baton Rouge, LA 70802",
    description:
      "A senior-focused food pantry operated by the East Baton Rouge Council on Aging. Seniors 60+ receive fresh fruit, produce, baked goods, canned goods, and personal toiletries. Open Tuesday, Wednesday, and Thursday from 9:30 AM to 3:30 PM.",
    iconColor: "blue",
    icon: "🌸",
    website: "https://ebrcoa.org/lotus-food-pantry/",
  },
  {
    id: 5,
    name: "St. Agnes Food Pantry",
    location: "49 East Blvd, Baton Rouge, LA",
    description:
      "Works with the Greater Baton Rouge Food Bank and receives donations from parishioners. Volunteers sort and distribute food to certified clients. Open at 8:00 AM on the first Thursday of each month in the gym.",
    iconColor: "orange",
    icon: "🍞",
    website: "https://www.stagnesbr.com/foodpantry",
  },
  {
    id: 6,
    name: "Streams of Life",
    location: "8852 Greenwell Springs Rd, Baton Rouge, LA 70814",
    description:
      "An outreach ministry started in 1998 to touch Baton Rouge and surrounding areas with practical assistance. Functions as a distribution center providing food and essential items to those in need. Phone: (225) 243-5325",
    iconColor: "green",
    icon: "🌾",
    website: "https://www.freefood.org/l/la_70814_streams-of-life",
  },
  {
    id: 7,
    name: "St. Theresa of Avila Food Pantry",
    location: "1105 Burnside Ave, Gonzales, LA",
    description:
      "Serves the Gonzales community with a food pantry located across the street from the church. Open Wednesday afternoons from 1:00 PM to 4:00 PM.",
    iconColor: "red",
    icon: "⛪",
    website: "https://www.stachurch.net/",
  },
  {
    id: 8,
    name: "LSU Food Pantry",
    location: "LSU Student Union Room 108, Baton Rouge, LA 70803",
    description:
      "Serving LSU students experiencing food insecurity since 2013. Open to all currently enrolled students with a valid Tiger Card. The pantry serves 350-450 students daily. Open Monday-Thursday: 12:00-5:00 PM, Friday: 11:00 AM-4:00 PM.",
    iconColor: "blue",
    icon: "🎓",
    website: "https://www.lsu.edu/campus-life/food-pantry/index.php",
  },
  {
    id: 9,
    name: "Port Allen Food Pantries",
    location: "Port Allen, LA",
    description:
      "Multiple locations serving the Port Allen community. 850 7th St: Registration at 8:00 AM, distribution follows. 12419 Section Road: Open Monday-Friday 9:00 AM to noon.",
    iconColor: "blue",
    icon: "📍",
    website: null,
  },
];

/* FUNCTIONS */

// Function to create a pantry card HTML
function createPantryCard(pantry) {
  const websiteLink = pantry.website
    ? `<a href="${pantry.website}" class="link" target="_blank" rel="noopener noreferrer">
         Visit Website →
       </a>`
    : "";

  return `
    <div class="pantry-card">
      <div class="icon-container ${pantry.iconColor}">
        <div class="icon">${pantry.icon}</div>
      </div>
      <div class="content">
        <h2 class="pantry-name">${pantry.name}</h2>
        <p class="location">${pantry.location}</p>
        <p class="description">${pantry.description}</p>
        ${websiteLink}
      </div>
    </div>
  `;
}

// Function to render all pantry cards
function renderPantries() {
  const container = document.getElementById("pantries-container");
  const pantriesHTML = pantriesData.map(createPantryCard).join("");
  container.innerHTML = pantriesHTML;
}

// Function to show specific tab
function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => {
    tab.style.display = "none";
  });

  // Show selected tab
  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.style.display = "block";
  }

  // Update active nav link
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-tab") === tabName) {
      link.classList.add("active");
    }
  });
}

/* INITIALIZATION */

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Render pantries
  renderPantries();

  // Add click event listeners to nav links
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.getAttribute("data-tab");
      showTab(tabName);
    });
  });

  // Show pantries tab by default
  showTab("pantries");
});