# Swift-route
A minimal cost finder website, while adjusting with the real-time traffic system

### **Intro**

**Swift** is a sophisticated route planning and traffic information system designed to optimize travel by calculating the minimum cost between various locations. The system not only determines the best route but also adapts dynamically to real-time traffic conditions. This project highlights my ability to integrate real-time data into decision-making processes and develop algorithms for route optimization.

### **Architecture**

**Swift** operates on a client-server architecture:

1. **Client-side**: 
   - **User Interface**: Developed using HTML, CSS, and JavaScript, this includes a dynamic map view with interactive elements like dropdowns for selecting start and end points, and buttons for initiating route planning.
   - **Map Visualization**: Utilizes Leaflet.js for map rendering and interaction, displaying markers for locations and routes.

2. **Server-side**: 
   - **Traffic Information Server**: Built with Node.js and Express, this server handles requests for traffic data and route calculations.
   - **API Integration**: Fetches real-time traffic data from external sources to update the route planning model.
   - **Database**: Stores predefined locations and their coordinates. Traffic information and road data are managed and processed on the server to update the route calculations.

### **Functionalities**

1. **Route Planning**: Users can select a start and end location from dropdown menus. The system calculates and displays the most cost-effective route based on current traffic conditions.
2. **Traffic Data Integration**: Fetches and integrates real-time traffic data to dynamically adjust route recommendations. The traffic levels are visualized on the map using different colors for light, medium, and heavy traffic.
3. **Dynamic Route Adjustment**: The system recalculates routes in response to traffic changes and updates the map view to reflect new route information.

### **Implementation**

1. **Client-Side Implementation**:
   - **Map Initialization**: Leaflet.js is used to initialize and render the map, with custom markers for start and end points.
   - **Dropdown Population**: Dynamically populated dropdowns allow users to select locations from a predefined list.
   - **Route Calculation**: Users initiate route planning which triggers an API call to the server for route calculation.

2. **Server-Side Implementation**:
   - **Data Handling**: The server fetches traffic data from external APIs, processes it, and integrates it into the route planning model.
   - **Algorithm**: Implemented Dijkstra's algorithm for shortest path calculation, considering real-time traffic conditions to determine the most cost-effective route.
   - **Data Storage**: Used a simple in-memory storage for predefined location coordinates and traffic data. 

### **Challenges**

1. **Real-Time Data Integration**: One of the main challenges was integrating real-time traffic data effectively. Ensuring that the data was accurately reflected in route calculations required careful handling of data updates and API responses.
2. **Dynamic Route Optimization**: Adapting route calculations on-the-fly based on changing traffic conditions was complex. It involved fine-tuning the Dijkstra's algorithm to account for traffic levels and ensuring that updates were quickly reflected on the map.
3. **User Interface Responsiveness**: Balancing a user-friendly interface with the need for real-time updates posed a challenge. Ensuring smooth interactions and fast updates required optimization of both frontend and backend components.

### **Conclusion**

**Swift** successfully demonstrates my ability to integrate real-time data into a route planning system, handle complex algorithmic challenges, and develop a responsive and interactive user interface. The project not only enhanced my skills in JavaScript and server-side development but also provided practical experience in real-time data integration and dynamic system optimization.

---
