#Project Overview

FoodLoop is a community-focused web application designed to help reduce food waste in Louisiana while supporting individuals, families, and shelters that experience food insecurity. The platform connects three groups: local businesses donating surplus food, volunteers who assist with distribution, and individuals or families who need food support. Our goal is to build a tool that is simple to use, helps people access food more easily, and gives donors a safe and organized way to share surplus items.

FoodLoop offers a structured signup system that separates users by role so each person sees features that match their needs. Business owners and volunteers complete one type of signup, while individuals in need complete another. Once registered, users can log in, view their profile, request or donate food, and navigate through resources that support food access in Louisiana.

The website also provides an educational history page explaining food waste in Louisiana, a resource page that directs users to nearby food pantries, and a FAQ page that answers common questions. To promote safe food sharing, all donors, individuals, and shelters sign liability agreements so FoodLoop is not responsible for illness or issues that may occur from donated food. Volunteers can also choose to help deliver food to individuals who cannot travel.

Each page includes a consistent navigation bar to make the interface easy to understand for people of all ages and backgrounds.

#Key Features

1. Role-Based Signup System
FoodLoop uses a two-path signup system with different fields depending on the user’s role.

Business and volunteer signup includes:
- Email and password
- Agreement to privacy policy and terms
- Redirection to an additional details page
  
Individual signup includes:
- First and last name
- Phone number
- Email and password
- Agreement to policies

Each signup validates the information before sending it to the server. Data is stored in the database so each user has a unique login account. When activity is logged and submitted, as a thank you and website will show confetti.

2. Login System
The login page allows users to access their account using the email and password they created. On successful login, users are redirected to their profile page. Login errors are clearly displayed on the screen, such as incorrect passwords or missing accounts. This helps users understand the issue without confusion.

3. Profile Pages with User Information and Photo Upload
After login, all users access a personalized profile page. The page allows them to:
- Upload a profile photo
- View their name and contact information
- See statistics or updates based on their role
  
For example:
- Individuals can see past requests and whether volunteers were assigned.
- Businesses can see a history of donations.
- Volunteers can see completed deliveries or upcoming assignments.
  
This page gives users a sense of ownership and connection to their activity on the site.

4. Food Request Page for Individuals
Individuals in need can submit a request for food directly through the form. The form includes:
- Item name
- Description of the item requested
- Allergy information
- Address
- Pickup date and time
- A checkbox asking whether they need a volunteer to deliver the item

This page gives individuals independence and flexibility when requesting help.

5. Donation Form Page for Businesses
Businesses donate surplus food through a structured form that gathers important food safety information. The form includes:
- Item name
- Date cooked or expiration date
- Allergen information
- Short description of the item
- Number of people the item can serve
- Pickup time range
  
Once submitted, the donation is stored in the database and added to the listings page.

6. Donation Listings Page
This page displays all available donations so individuals and shelters can quickly find what they need. Each listing includes:
- Item name
- Description
- Allergens
- Pickup location
- Time window for pickup
- Number of servings

The listings update automatically as donations are created. When an item is selected, the available quantity adjusts in the system.

7. Donation Review Page
After receiving a donation, individuals can submit feedback on:
- Food quality
- Packaging condition
- Accuracy of the listed information
- Whether the expiration date matched the listing
  
This helps businesses improve and keeps the system accountable.

8. Food Pantry and Resources Page
This page directs users to nearby resources. It includes:
- Louisiana food banks and pantries
- Operation hours
- Location information
- What types of food or services each site offers
- External links to official organizations
  
This page is especially helpful for users who may not know where to start.

9. History of Food Waste in Louisiana Page
This educational page explains:
- How food waste affects communities
- Statistics about hunger and waste in Louisiana
- How programs like FoodLoop can help
  
The information is easy to read and intended to help users understand the impact of the issue.

10. FAQ Page
The FAQ page answers common questions including:
- How to create an account
- How to donate food
- Safety policies for donated items
- How volunteer delivery works
- Eligibility for food assistance
- What the liability form covers
- How long listings stay active
  
This reduces confusion and supports new users as they learn the system.

11. Safety and Liability Forms
To keep the platform safe:
- Businesses agree that their donated food is provided in good faith
- Individuals and shelters agree that FoodLoop is not responsible for illness or complications
- Volunteers acknowledge transportation guidelines

This allows food redistribution to happen legally and responsibly.

12. Volunteer Delivery Option
If individuals cannot travel to pick up food, they can request volunteer delivery. Volunteers can view these requests in their account and accept them. This feature helps support people with disabilities, elderly individuals, or people without transportation.

13. Full Navigation Bar on Every Page
The navigation bar appears at the top of every page and allows users to move smoothly across the site. The links include:
- Home
- Receive
- Request
- Donate
- FAQ
- Sign Up
- Log In

This consistent structure makes the site easy to explore and prevents users from feeling lost.

#Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- MySQL
- GitHub
- VS Code

#How to Run FoodLoop
1. Running the Website Using Live Server
- Install the Live Server extension in VS Code
- Right-click any HTML file
- Select Open with Live Server
- The website will open in your browser
- You must still run the Node.js server for login and signup to work

2. Running the Backend with Node.js (another way to run the website)
This is required for all database features.
- Open the terminal inside the project folder
- Install backend dependencies
- npm install
- npm install mssql
- Start the server
- node server.js
- The terminal will show a link
- Open the link in your browser to use the full site

#Team Contributions

Nene Fall
- Project Manager
- Managed the Kanban board and assigned tasks
- Worked on backend and frontend for login and both signup paths
- Wrote the history of food waste in Louisiana
- Helped team members with errors and design

Salam Abualassl
- Created the navigation bar
- Built and styled the homepage
- Built the FAQ page
- Built the Louisiana history page
- Created the food listings page
- Built one of the main form pages

Ke'Anna Mckinney
- Created the user profile page
- Styled the interface for profile sections
- Connected profile data with user input
- Created the food banks and pantries listings page
- Fixed both the html login and signups to work with the other pages
- Created the profile page database

Christian Frazier
- Git Master
- Debugged frontend and backend issues
- Connected all pages into a functional site
- Ensured the styling was consistent across pages
- Produced the commercial video for the project

Hermyone Green
- ?
#PRESENTATION CANVA LINK
- https://www.canva.com/design/DAG6D7Ranb8/uymHlfeN8eETKBKsyJ7Gog/view?utm_content=DAG6D7Ranb8&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2ee43c082a
