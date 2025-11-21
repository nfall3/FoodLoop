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

/*REACT COMPONENTS */
// Individual Pantry Card Component
function PantryCard({ pantry }) {
  return (
    <div className="pantry-card">
      {/* Icon container with colored background */}
      <div className={`icon-container ${pantry.iconColor}`}>
        <div className="icon">{pantry.icon}</div>
      </div>

      {/* Content section */}
      <div className="content">
        <h2 className="pantry-name">{pantry.name}</h2>
        <p className="location">{pantry.location}</p>
        <p className="description">{pantry.description}</p>

        {/* Show website link if available */}
        {pantry.website && (
          <a
            href={pantry.website}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website →
          </a>
        )}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  // State to track which tab is active
  const [activeTab, setActiveTab] = React.useState("pantries");

  // Function to handle tab changes
  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      {/* Navigation Header */}
      <header className="header">
        <nav className="nav">
          <div className="logo">FoodLoop</div>
          <ul className="nav-links">
            <li>
              <a href="#" onClick={() => showTab("home")}>
                Home
              </a>
            </li>
            <li>
              <a href="#" onClick={() => showTab("volunteer")}>
                Volunteer
              </a>
            </li>
            <li>
              <a href="#" onClick={() => showTab("donate")}>
                Donate
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => showTab("pantries")}
                className={activeTab === "pantries" ? "active" : ""}
              >
                Food Pantries
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container">
        {/* Show content based on active tab */}
        {activeTab === "home" && (
          <div className="tab-content">
            <h1>Welcome to FoodLoop</h1>
            <p>Connecting communities with food resources in Baton Rouge.</p>
          </div>
        )}

        {activeTab === "volunteer" && (
          <div className="tab-content">
            <h1>Volunteer Opportunities</h1>
            <p>
              Get involved with local food pantries and make a difference in
              your community.
            </p>
          </div>
        )}

        {activeTab === "donate" && (
          <div className="tab-content">
            <h1>Donate</h1>
            <p>Support local food pantries with monetary or food donations.</p>
          </div>
        )}

        {activeTab === "pantries" && (
          <>
            {/* Page header */}
            <h1>Food Pantries & Food Banks</h1>

            {/* Render all pantry cards */}
            <div id="pantries-container">
              {pantriesData.map((pantry) => (
                <PantryCard key={pantry.id} pantry={pantry} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* RENDER THE APP */
// Get the root element and render the React app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
