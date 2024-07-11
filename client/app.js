const locations = [
    "School", "Park", "Library", "Bookstore", "Residential Complex", "Hospital", "Mall", "Office", "Gym", "Museum",
    "Restaurant", "Cafe", "Bank", "Post Office", "Police Station", "Fire Station", "Supermarket", "Pharmacy", "Daycare", "Community Center",
    "Stadium", "Theater", "Airport", "Train Station", "Bus Terminal", "University", "Courthouse", "City Hall", "Art Gallery", "Botanical Garden"
];

// Predefined coordinates for each location
const predefinedCoordinates = {
    "School": { x: 32, y: 41 },
    "Park": { x: 57, y: 24 },
    "Library": { x: 35, y: 63 },
    "Bookstore": { x: 66, y: 55 },
    "Residential Complex": { x: 42, y: 17 },
    "Hospital": { x: 72, y: 35 },
    "Mall": { x: 39, y: 75 },
    "Office": { x: 53, y: 48 },
    "Gym": { x: 38, y: 22 },
    "Museum": { x: 65, y: 8 },
    "Restaurant": { x: 29, y: 57 },
    "Cafe": { x: 14, y: 31 },
    "Bank": { x: 47, y: 69 },
    "Post Office": { x: 76, y: 48 },
    "Police Station": { x: 23, y: 48 },
    "Fire Station": { x: 60, y: 78 },
    "Supermarket": { x: 35, y: 39 },
    "Pharmacy": { x: 68, y: 18 },
    "Daycare": { x: 28, y: 84 },
    "Community Center": { x: 75, y: 54 },
    "Stadium": { x: 50, y: 5 },
    "Theater": { x: 14, y: 45 },
    "Airport": { x: 58, y: 65 },
    "Train Station": { x: 20, y: 31 },
    "Bus Terminal": { x: 43, y: 72 },
    "University": { x: 30, y: 18 },
    "Courthouse": { x: 63, y: 82 },
    "City Hall": { x: 72, y: 28 },
    "Art Gallery": { x: 55, y: 69 },
    "Botanical Garden": { x: 15, y: 14 }
};


let points = [];
let edges = [];
let pathLayer;
let markers = new Map();
let selectedPoints = [];

const map = L.map('map').setView([7.5, 7.5], 3); // Center map based on average coordinates
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const startIcon = L.divIcon({
    html: '📍',
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const endIcon = L.divIcon({
    html: '🚩',
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const defaultIcon = L.divIcon({
    html: '⚪',
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});


async function fetchRoadData() {
    try {
        const response = await fetch('/api/roads');
        const roads = await response.json();

        // points = [...new Set(roads.flatMap(road => [road.start, road.end]))].map((location, index) => ({
        //     id: index + 1,
        //     x: Math.floor(Math.random() * 36) + 1,
        //     y: Math.floor(Math.random() * 42) + 1,
        //     name: location
        // }));
        points = locations.map((location, index) => ({
            id: index + 1,
            x: predefinedCoordinates[location].x,
            y: predefinedCoordinates[location].y,
            name: location
        }));

        edges = roads.map(road => ({
            start: points.find(point => point.name === road.start).id,
            end: points.find(point => point.name === road.end).id,
            weight: road.cost,
            trafficLevel: road.trafficLevel
        }));

        drawMap();
        populateDropdowns();
    } catch (error) {
        console.error('Error fetching road data:', error);
    }
}

fetchRoadData();

function drawMap() {
    points.forEach(point => {
        const marker = L.marker([point.x, point.y], { icon: defaultIcon })
            .addTo(map)
            .bindPopup(`${point.name}`);
            markers.set(point.id, marker);

            marker.on('click', () => {
                handlePointSelection(point.id);
            });
    });

    edges.forEach(edge => {
        const start = points.find(point => point.id === edge.start);
        const end = points.find(point => point.id === edge.end);
        const edgeLine = L.polyline([[start.x, start.y], [end.x, end.y]], { color: '#cccccc', weight: 1, dashArray: '5, 5' })
            .addTo(map);
    });

    drawEdges();
    //populateDropdowns();
}

function findShortestPath(start, end) {
    const result = dijkstra(start, end);

    // Clear previous path
    if (pathLayer) {
        map.removeLayer(pathLayer);
    }

    const pathCoordinates = result.path.map(id => {
        const point = points.find(p => p.id === id);
        return [point.x, point.y];
    });

    // Instead of creating one polyline, we create individual segments
    result.path.forEach((id, index) => {
        if (index === 0) return;

        const prevId = result.path[index - 1];
        const edge = edges.find(e => (e.start === id && e.end === prevId) || (e.start === prevId && e.end === id));
        const start = points.find(point => point.id === edge.start);
        const end = points.find(point => point.id === edge.end);
        const trafficLevel = edge.trafficLevel;
        const lineColor = trafficLevel === 'light' ? 'green' : trafficLevel === 'medium' ? 'yellow' : 'red';

        L.polyline([[start.x, start.y], [end.x, end.y]], { color: lineColor, weight: 4 })
            .addTo(map);
    });

    let totalCost = 0;
    result.path.forEach((id, index) => {
        if (index === 0) return;
        const edge = edges.find(e => (e.start === id && e.end === result.path[index - 1]) || (e.start === result.path[index - 1] && e.end === id));
        totalCost += edge.weight;
    });

    document.getElementById('distance-text').innerText = `Minimum cost required: ${totalCost.toFixed(2)} INR`;

}

//let selectedPoints = [];

function populateDropdowns() {
    const startDropdown = document.getElementById('start-point');
    const endDropdown = document.getElementById('end-point');

    points.forEach(point => {
        const optionStart = document.createElement('option');
        optionStart.value = point.id;
        optionStart.text = point.name;
        startDropdown.add(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = point.id;
        optionEnd.text = point.name;
        endDropdown.add(optionEnd);
    });
}

function updateSelection() {
    const startDropdown = document.getElementById('start-point');
    const endDropdown = document.getElementById('end-point');

    const startValue = startDropdown.value;
    const endValue = endDropdown.value;

    selectedPoints = [];
    if (startValue) selectedPoints.push(parseInt(startValue));
    if (endValue) selectedPoints.push(parseInt(endValue));

    updateMarkers();
}

function handlePointSelection(pointId) {
    const startDropdown = document.getElementById('start-point');
    const endDropdown = document.getElementById('end-point');

    if (selectedPoints.length < 2 && !selectedPoints.includes(pointId)) {
        selectedPoints.push(pointId);
        updateMarkers();

        if (selectedPoints.length === 1) {
            startDropdown.value = pointId;
        } else {
            endDropdown.value = pointId;
        }
    }
}

function updateMarkers() {
    points.forEach(point => {
        const marker = markers.get(point.id);
        if (selectedPoints.includes(point.id)) {
            marker.setIcon(selectedPoints[0] === point.id ? startIcon : endIcon);
        } else {
            marker.setIcon(defaultIcon);
        }
    });
}

//const markers = new Map();
points.forEach(point => {
    const marker = L.marker([point.x, point.y], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(`${point.id}`);

    markers.set(point.id, marker);

    marker.on('click', () => {
        const startDropdown = document.getElementById('start-point');
        const endDropdown = document.getElementById('end-point');

        if (selectedPoints.length < 2 && !selectedPoints.includes(point.id)) {
            selectedPoints.push(point.id);
            updateMarkers();

            if (selectedPoints.length === 1) {
                startDropdown.value = point.id;
            } else {
                endDropdown.value = point.id;
            }
        }
    });
});

document.getElementById('plan-route').addEventListener('click', () => {
    if (selectedPoints.length === 2) {
        findShortestPath(selectedPoints[0], selectedPoints[1]);

        document.getElementById('button-container').style.display = 'none';
        document.getElementById('distance-container').style.display = 'block';
    }
});

const adjList = new Map();

function addEdge(start, end, weight) {
    if (!adjList.has(start)) adjList.set(start, []);
    if (!adjList.has(end)) adjList.set(end, []);
    adjList.get(start).push({ node: end, weight: weight });
    adjList.get(end).push({ node: start, weight: weight });
}

function drawEdges() {
    edges.forEach(edge => {
        const start = points.find(point => point.id === edge.start);
        const end = points.find(point => point.id === edge.end);
        const distance = edge.weight;

        addEdge(edge.start, edge.end, distance);

        const edgeLine = L.polyline([[start.x, start.y], [end.x, end.y]], { color: '#666', weight: 1, dashArray: '5, 5' })
            .addTo(map);
        const middlePoint = [(start.x + end.x) / 2, (start.y + end.y) / 2];
        const edgeText = L.marker(middlePoint, {
            icon: L.divIcon({
                className: 'edge-label',
                html: `<span>${distance.toFixed(2)}</span>`,
                iconSize: [0, 0]
            })
        }).addTo(map);
    });
}

function dijkstra(start, end) {
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    const priorityQueue = new Set();

    points.forEach(point => {
        distances.set(point.id, point.id === start ? 0 : Infinity);
        priorityQueue.add(point.id);
    });

    while (priorityQueue.size > 0) {
        const current = [...priorityQueue].reduce((minNode, node) =>
            distances.get(node) < distances.get(minNode) ? node : minNode
        );

        if (current === end) break;

        priorityQueue.delete(current);
        visited.add(current);

        const neighbors = adjList.get(current);
        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor.node)) {
                const alt = distances.get(current) + neighbor.weight;
                if (alt < distances.get(neighbor.node)) {
                    distances.set(neighbor.node, alt);
                    previous.set(neighbor.node, current);
                }
            }
        });
    }

    const path = [];
    let currentNode = end;
    while (previous.has(currentNode)) {
        path.unshift(currentNode);
        currentNode = previous.get(currentNode);
    }
    if (currentNode === start) path.unshift(currentNode);

    return { path, distance: distances.get(end) };
}

document.getElementById('start-point').addEventListener('change', updateSelection);
document.getElementById('end-point').addEventListener('change', updateSelection);