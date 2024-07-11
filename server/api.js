const express = require('express');
const router = express.Router();
const app = express();
const port = 3001;

// Define the locations
const locations = [
    "School", "Park", "Library", "Bookstore", "Residential Complex", "Hospital", "Mall", "Office", "Gym", "Museum",
    "Restaurant", "Cafe", "Bank", "Post Office", "Police Station", "Fire Station", "Supermarket", "Pharmacy", "Daycare", "Community Center",
    "Stadium", "Theater", "Airport", "Train Station", "Bus Terminal", "University", "Courthouse", "City Hall", "Art Gallery", "Botanical Garden"
];

// Define the roads
const roads = [
    { start: "School", end: "Park", distance: 5 },
    { start: "School", end: "Library", distance: 8 },
    { start: "Park", end: "Bookstore", distance: 10 },
    { start: "Library", end: "Residential Complex", distance: 12 },
    { start: "Bookstore", end: "Hospital", distance: 7 },
    { start: "Residential Complex", end: "Mall", distance: 15 },
    { start: "Hospital", end: "Office", distance: 9 },
    { start: "Mall", end: "Gym", distance: 11 },
    { start: "Office", end: "Museum", distance: 13 },
    { start: "Gym", end: "Restaurant", distance: 6 },
    { start: "Museum", end: "Cafe", distance: 8 },
    { start: "Restaurant", end: "Bank", distance: 9 },
    { start: "Cafe", end: "Post Office", distance: 7 },
    { start: "Bank", end: "Police Station", distance: 11 },
    { start: "Post Office", end: "Fire Station", distance: 10 },
    { start: "Police Station", end: "Supermarket", distance: 8 },
    { start: "Fire Station", end: "Pharmacy", distance: 6 },
    { start: "Supermarket", end: "Daycare", distance: 9 },
    { start: "Pharmacy", end: "Community Center", distance: 12 },
    { start: "Daycare", end: "Stadium", distance: 14 },
    { start: "Community Center", end: "Theater", distance: 11 },
    { start: "Stadium", end: "Airport", distance: 18 },
    { start: "Theater", end: "Train Station", distance: 13 },
    { start: "Airport", end: "Bus Terminal", distance: 15 },
    { start: "Train Station", end: "University", distance: 12 },
    { start: "Bus Terminal", end: "Courthouse", distance: 16 },
    { start: "University", end: "City Hall", distance: 14 },
    { start: "Courthouse", end: "Art Gallery", distance: 11 },
    { start: "City Hall", end: "Botanical Garden", distance: 17 },
    { start: "Art Gallery", end: "School", distance: 9 },
    { start: "Botanical Garden", end: "Park", distance: 13 }
];

const trafficLevels = {
    light: 1,
    medium: 10,
    heavy: 25
};

// Generate the road data
function generateRoadData() {
    const roadData = [];
    for (let i = 0; i < roads.length; i++) {
        const trafficLevel = Math.floor(Math.random() * 3);
        const cost = roads[i].distance * trafficLevels[Object.keys(trafficLevels)[trafficLevel]];
        roadData.push({ start: roads[i].start, end: roads[i].end, cost, trafficLevel: Object.keys(trafficLevels)[trafficLevel] });
    }
    return roadData;
}

// app.get('/api/roads', (req, res) => {
//     const roads = generateRoadData();
//     res.json(roads);
// });

// app.listen(port, () => {
//     console.log(`API server listening at http://localhost:${port}`);
// });

router.get('/roads', (req, res) => {
    const roads = generateRoadData();
    res.json(roads);
});

module.exports = router;