export default class Elevator {
	constructor() {
		this.currentFloor = 0;
		this.stops = 0;
		this.floorsTraversed = 0;
		this.requests = []; // People waiting
		this.riders = [];   // People inside
	}

	// Level 7: Efficient Dispatch
	// implemented the SCAN algorithm (also known as the Elevator Algorithm).
	// Instead of finishing one person's entire trip before starting the next,
	// the elevator will pick up anyone it passes as long as they are going in the same direction.
	dispatch() {
		while (this.requests.length > 0 || this.riders.length > 0) {
			const nextStop = this.findBestNextFloor();
			
			if (nextStop !== null) {
				this.travelTo(nextStop);
				this.handleArrival(nextStop);
			}
		}
		this.checkReturnToLoby();
	}

	// will find the closest floor that either has a waiting passenger or is a drop-off point for a current rider.
	findBestNextFloor() {
		// Collect all floors we NEED to visit
		const pickupFloors = this.requests.map(p => p.currentFloor);
		const dropoffFloors = this.riders.map(p => p.dropOffFloor);
		const allPotentialStops = [...new Set([...pickupFloors, ...dropoffFloors])];

		if (allPotentialStops.length === 0) return null;

		// Find the floor closest to the current position
		return allPotentialStops.reduce((prev, curr) => {
		return (Math.abs(curr - this.currentFloor) < Math.abs(prev - this.currentFloor) ? curr : prev);
		});
	}

	// When the elevator arrives at a floor, it needs to:
	// 1. Drop off anyone who needed this floor
	// 2. Pick up anyone waiting at this floor
	handleArrival(floor) {
		// 1. Drop off anyone who needed this floor
		const stayingRiders = this.riders.filter(p => p.dropOffFloor !== floor);
		this.riders = stayingRiders;

		// 2. Pick up anyone waiting at this floor
		const waitingAtFloor = this.requests.filter(p => p.currentFloor === floor);
		const stillWaiting = this.requests.filter(p => p.currentFloor !== floor);
		
		this.riders.push(...waitingAtFloor);
		this.requests = stillWaiting;
	}

	// This method will move the elevator to the target floor, counting stops and floors traversed.
	travelTo(targetFloor) {
		if (this.currentFloor === targetFloor) return;
		this.stops++;
		while (this.currentFloor < targetFloor) { this.moveUp(); }
		while (this.currentFloor > targetFloor) { this.moveDown(); }
	}

	// Move up one floor
	moveUp() { this.currentFloor++; this.floorsTraversed++; }

	// Move down only if we're above the ground floor (0)
	moveDown() { if (this.currentFloor > 0) { this.currentFloor--; this.floorsTraversed++; } }

	// After all requests are handled, if there are no riders and it's before noon,
	// the elevator should return to the lobby (floor 0).
	checkReturnToLoby() {
		const now = new Date();
		const currentHour = now.getHours();

		// If there are no riders and it is before 12:00 PM (noon)
		if (this.riders.length === 0 && currentHour < 12) {
		this.returnToLoby();
		}
		// Otherwise, it stays at the current floor
	}

	// This method will return the elevator to the lobby (floor 0) if it's not already there.
	returnToLoby() {
		if (this.currentFloor !== 0) {
			this.travelTo(0);
		}
	}

	// This method is for testing purposes to reset the elevator's state between tests.
	reset() {
		this.currentFloor = 0
		this.stops = 0
		this.floorsTraversed = 0
		this.riders = []
		this.requests = []
	}
}