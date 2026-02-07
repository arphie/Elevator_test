import Elevator from './elevator.js';
import Person from './person.js';

const elevator = new Elevator();
const elevatorEl = document.getElementById('elevator');
const riderCountEl = document.getElementById('rider-count');
const statusLogEl = document.getElementById('status-log');
const riderListEl = document.getElementById('rider-list');
const API_URL = 'http://localhost:3000/elevator';

// --- API HELPERS ---

async function syncState() {
  try {
    const res = await fetch(`${API_URL}/state`);
    const data = await res.json();
    // Update local elevator instance to match Server
    elevator.requests = data.requests;
    elevator.riders = data.riders;
    updateUI();
  } catch (err) {
    console.error("Server Connection Error", err);
  }
}

async function addRequestAPI(person) {
  await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person)
  });
  await syncState();
}

async function pickupRiderAPI(person) {
  // 1. Remove from Requests
  await fetch(`${API_URL}/requests/${person.name}`, { method: 'DELETE' });
  // 2. Add to Riders
  await fetch(`${API_URL}/riders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person)
  });
}

async function dropoffRiderAPI(person) {
  await fetch(`${API_URL}/riders/${person.name}`, { method: 'DELETE' });
}

// --- UI UPDATES ---

function updateUI() {
  // Update Rider Count
  riderCountEl.innerText = elevator.riders.length;
  
  // Update List
  riderListEl.innerHTML = '';
  if (elevator.riders.length === 0) {
    riderListEl.innerHTML = '<li class="empty-message">Elevator is empty</li>';
  } else {
    elevator.riders.forEach(person => {
      const li = document.createElement('li');
      li.innerHTML = `<span>👤 ${person.name}</span> <span>To: Fl ${person.dropOffFloor}</span>`;
      riderListEl.appendChild(li);
    });
  }
}

function logStatus(message) {
    console.log(message);
    if(statusLogEl) statusLogEl.innerText = message;
}

// --- ELEVATOR OVERRIDES ---

// Override handleArrival to use API calls instead of array methods
elevator.handleArrival = async function(floor) {
    // 1. Drop off API calls
    const droppingOff = this.riders.filter(p => p.dropOffFloor === floor);
    for (const person of droppingOff) {
        await dropoffRiderAPI(person);
    }

    // 2. Pickup API calls
    const pickingUp = this.requests.filter(p => p.currentFloor === floor);
    for (const person of pickingUp) {
        await pickupRiderAPI(person);
    }

    // 3. Sync everything to be safe
    await syncState();
};

elevator.travelTo = async function(targetFloor) {
    if (this.currentFloor === targetFloor) return;
    this.stops++;
    const direction = targetFloor > this.currentFloor ? 1 : -1;
    
    logStatus(`Moving ${direction > 0 ? 'UP' : 'DOWN'} to Floor ${targetFloor}...`);

    while (this.currentFloor !== targetFloor) {
        const oldFloor = document.getElementById(`floor-${this.currentFloor}`);
        if(oldFloor) oldFloor.classList.remove('active-floor');

        this.currentFloor += direction;
        this.floorsTraversed++;

        const newFloor = document.getElementById(`floor-${this.currentFloor}`);
        if(newFloor) newFloor.classList.add('active-floor');

        elevatorEl.style.bottom = `${this.currentFloor * 50}px`;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
};

elevator.dispatch = async function() {
    // Sync before starting to ensure we have latest data
    await syncState();

    while (this.requests.length > 0 || this.riders.length > 0) {
        const nextStop = this.findBestNextFloor();
        
        if (nextStop !== null) {
            await this.travelTo(nextStop);
            
            // This now calls our API-enabled override above
            await this.handleArrival(nextStop);
            
            logStatus(`Stopped at floor ${nextStop}.`);
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Re-sync loop condition data
            await syncState();
        }
    }

    if (this.riders.length === 0 && new Date().getHours() < 12) {
        logStatus("Returning to Lobby...");
        await this.travelTo(0);
        logStatus("Idle at Lobby.");
    } else {
        logStatus("Idle.");
    }
};

// --- EVENTS ---

window.requestElevator = async (name, start, end) => {
    const p = new Person(name, start, end);
    // Use API instead of push
    await addRequestAPI(p);
    
    logStatus(`${name} requested floor ${end} from floor ${start}`);
    alert(`${name} is waiting at floor ${start}`);
};

const dispatchBtn = document.getElementById('dispatch-btn');
if(dispatchBtn) {
    dispatchBtn.addEventListener('click', () => {
        elevator.dispatch();
    });
}

// Initial Sync on Load
syncState();