require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

// const assert = require('chai').assert;
const { assert, expect } = require('chai');
const Elevator = require('../web-app-version/elevator').default;
const Person = require('../web-app-version/person').default

// describe('Elevator', function() {
//   let elevator = new Elevator();

//   beforeEach(function() {
//     elevator.reset();
//   });

//   it('should bring a rider to a floor above their current floor', () => {
//     let mockUser = { name: "Brittany", currentFloor: 2, dropOffFloor: 5 };
//     elevator.requests.push(mockUser)
//     elevator.goToFloor(mockUser);

//     //check if the elevator automatically  returns to the loby and set the end values
//     const endFloor = elevator.checkReturnToLoby() ? 0 : 5
//     const floorsTraversed = elevator.checkReturnToLoby() ? 10 : 5

//     assert.equal(elevator.currentFloor, endFloor);
//     assert.equal(elevator.floorsTraversed, floorsTraversed)
//     assert.equal(elevator.stops, 2)
//   });

//   it('should bring a rider to a floor below their current floor', () => {
//     let mockUser = { name: "Brittany", currentFloor: 8, dropOffFloor: 3 };
//     elevator.requests.push(mockUser)
//     elevator.goToFloor(mockUser);

//     const endFloor = elevator.checkReturnToLoby() ? 0 : 3
//     const floorsTraversed = elevator.checkReturnToLoby() ? 16 : 13

//     assert.equal(elevator.currentFloor, endFloor);
//     assert.equal(elevator.floorsTraversed, floorsTraversed)
//     assert.equal(elevator.stops, 2)
//   });

//   it('The moveUp function should move the elevator up once',() => {
//     const nextFloor = elevator.currentFloor + 1
//     elevator.moveUp()

//     assert.equal(elevator.currentFloor, nextFloor)
//   })

//   it('The moveDown function should move the elevator down once until the bottom floor but no further',() => {
//     elevator.currentFloor++
//     const nextFloor = elevator.currentFloor - 1
//     elevator.moveDown()

//     assert.equal(elevator.currentFloor, nextFloor)

//     elevator.currentFloor = 0
//     assert.equal(elevator.currentFloor, 0)
//   })

//   it('should check if the current floor  of the elevator should stop (picking up/dropping off riders)', ()=> {
//     const riderA = new Person('Bob',4,5)    
//     const riderB = new Person('John',1,4)
//     elevator.currentFloor = elevator.floorsTraversed = 4  
    
//     elevator.requests.push(riderA) 
//     assert.equal(elevator.hasStop(), true)  
    
//     elevator.requests = []
//     elevator.riders.push(riderB)
//     assert.equal(elevator.hasStop(), true)  
//   })

//   it('when checking the floor, the person requesting the elevator will enter and become a rider', ()=> {
//     const request = new Person('Anne', 3, 1)
//     elevator.requests.push(request)
//     elevator.currentFloor = 3

//     elevator.hasPickup()

//     assert.equal(elevator.requests.length, 0)
//     assert.equal(elevator.riders[0], request)
//   })

//   it('dropping a person off the elevator should remove the person entirely', () => {
//     const rider = new Person('Anne', 1, 3)
//     elevator.riders.push(rider)
//     elevator.currentFloor = 3

//     elevator.hasDropoff()

//     assert.equal(elevator.riders.length, 0)
//   })

//   it('should cater to the riders in order (first come, first serve)', () => {
//     //both person A and B are going up
//     let personA = new Person('Oliver',3,6)
//     let personB = new Person('Angela',1,5)    
//     elevator.requests = [personA, personB]
//     let endFloor = elevator.checkReturnToLoby() ? 0 : 6
//     let floorsTraversed = elevator.checkReturnToLoby() ? 12 : 6

//     elevator.dispatch()

//     assert.equal(elevator.stops, 4)
//     assert.equal(elevator.floorsTraversed, floorsTraversed)
//     assert.equal(elevator.currentFloor, endFloor)

//     elevator.reset()

//     //person A goes up and B goes down
//     personA = new Person('Beverly',3,6)
//     personB = new Person('James',5,1)
//     elevator.requests = [personA, personB]
//     endFloor = elevator.checkReturnToLoby() ? 0 : 1
//     floorsTraversed = elevator.checkReturnToLoby() ? 12 : 11

//     elevator.dispatch()

//     assert.equal(elevator.stops, 4)   
//     assert.equal(elevator.floorsTraversed, floorsTraversed)
//     assert.equal(elevator.currentFloor, endFloor)

//     elevator.reset()

//     //person A goes down and B goes up
//     personA = new Person('Jeanne',7,1)
//     personB = new Person('Karl',2,8)
//     elevator.requests = [personA, personB]
//     endFloor = elevator.checkReturnToLoby() ? 0 : 1
//     floorsTraversed = elevator.checkReturnToLoby() ? 16 : 15

//     elevator.dispatch()
    
//     assert.equal(elevator.stops, 4)
//     assert.equal(elevator.floorsTraversed, floorsTraversed)
//     assert.equal(elevator.currentFloor, endFloor)
    
//     elevator.reset()
    
//     //both Person A and B go down
//     personA = new Person('Max',8,2)
//     personB = new Person('Charlie',5,0)
//     elevator.requests = [personA, personB]
    
//     elevator.dispatch()

//     assert.equal(elevator.stops, 4)
//     assert.equal(elevator.floorsTraversed, 16)
//     assert.equal(elevator.currentFloor, 0)
//   })
  
//   it('should check if the elevator must return to the loby when there are no riders and the time is earlier than 12PM', () => {
//     elevator.currentFloor = 5

//     if(new Date().getHours() < 12 && !elevator.riders.length){
//       assert.equal(elevator.checkReturnToLoby(), true)
//     }
//   })
// });

describe('Elevator Level 2 to level 4', () => {
	let elevator;

	beforeEach(() => {
		elevator = new Elevator();
	});

	// Level 2: Basic pickup and drop-off
	it('(Level 2) should take Person A up', () => {
		const alex = new Person("Alex", 2, 5); // Current floor 2, Drop-off 5
		elevator.requests.push(alex);
		elevator.dispatch();

		expect(elevator.currentFloor).to.equal(5);
		// 2 floors to pick up + 3 floors to drop off = 5
		expect(elevator.floorsTraversed).to.equal(5);
		// 1 stop for pickup + 1 stop for dropoff = 2
		expect(elevator.stops).to.equal(2);
	});

	// Level 2: Basic pickup and drop-off
	it('(Level 2) should take Person A down', () => {
		// Elevator starts at 0, goes to 10 to pick up, drops at 4
		const bob = new Person("Bob", 10, 4);
		elevator.requests.push(bob);
		elevator.dispatch();

		expect(elevator.currentFloor).to.equal(4);
		expect(elevator.floorsTraversed).to.equal(16); // 10 up + 6 down
		expect(elevator.stops).to.equal(2);
	});

	// Level 3: Accurate floor and stop tracking
	it('(Level 3) should accurately track floors and stops', () => {
		const elevator = new Elevator();
		const person = new Person("Alice", 3, 7); 
		
		elevator.requests.push(person);
		elevator.dispatch();

		// Logic check:
		// 1. Starts at 0, moves to 3 (3 floors traversed, 1 stop)
		// 2. At 3, moves to 7 (4 more floors, 1 stop)
		
		expect(elevator.floorsTraversed).to.equal(7); // 3 + 4
		expect(elevator.stops).to.equal(2); // Pickup stop + Drop-off stop
	});

	// Level 4: Multiple requests in order
	it('(Level 4) should pick up and drop off multiple people in order', () => {
		const elevator = new Elevator();
		
		// Bob: Floor 3 -> 9
		const bob = new Person("Bob", 3, 9);
		// Sue: Floor 6 -> 2
		const sue = new Person("Sue", 6, 2);

		elevator.requests.push(bob, sue);
		elevator.dispatch();

		// Efficiency Calculation for Level 3 metrics:
		// 1. 0 to 3 (Bob pickup): 3 floors, 1 stop
		// 2. 3 to 9 (Bob dropoff): 6 floors, 1 stop
		// 3. 9 to 6 (Sue pickup): 3 floors, 1 stop
		// 4. 6 to 2 (Sue dropoff): 4 floors, 1 stop
		
		expect(elevator.currentFloor).to.equal(2);
		expect(elevator.floorsTraversed).to.equal(16); // 3 + 6 + 3 + 4
		expect(elevator.stops).to.equal(4);
	});
});

describe('Elevator Level 5 - Directional Combinations', () => {
	let elevator;

	beforeEach(() => {
		elevator = new Elevator();
	});

	it('Person A goes up, Person B goes up', () => {
		const personA = new Person("A", 1, 3);
		const personB = new Person("B", 4, 6);

		elevator.requests.push(personA, personB);
		elevator.dispatch();

		// Math: (0->1) + (1->3) + (3->4) + (4->6) = 1 + 2 + 1 + 2 = 6
		expect(elevator.floorsTraversed).to.equal(6);
		expect(elevator.stops).to.equal(4);
		expect(elevator.requests.length).to.equal(0);
		expect(elevator.riders.length).to.equal(0);
	});

	it('Person A goes up, Person B goes down', () => {
		const personA = new Person("A", 1, 5);
		const personB = new Person("B", 4, 2);

		elevator.requests.push(personA, personB);
		elevator.dispatch();

		// Math: (0->1) + (1->5) + (5->4) + (4->2) = 1 + 4 + 1 + 2 = 8
		expect(elevator.floorsTraversed).to.equal(8);
		expect(elevator.stops).to.equal(4);
		expect(elevator.requests.length).to.equal(0);
		expect(elevator.riders.length).to.equal(0);
	});

	it('Person A goes down, Person B goes up', () => {
		const personA = new Person("A", 5, 2);
		const personB = new Person("B", 1, 3);

		elevator.requests.push(personA, personB);
		elevator.dispatch();

		// Efficient: (0->1) + (1->3) + (3->5) + (5->2) = 1 + 2 + 2 + 3 = 8
		expect(elevator.floorsTraversed).to.equal(8);
		expect(elevator.stops).to.equal(4);
		expect(elevator.requests.length).to.equal(0);
		expect(elevator.riders.length).to.equal(0);
	});

	it('Person A goes down, Person B goes down', () => {
		const personA = new Person("A", 3, 1);
		const personB = new Person("B", 5, 2);

		elevator.requests.push(personA, personB);
		elevator.dispatch();

		// Efficient: (0->3) + (3->5) + (5->2) + (2->1) = 3 + 2 + 3 + 1 = 9
		expect(elevator.floorsTraversed).to.equal(9);
		expect(elevator.stops).to.equal(4);
		expect(elevator.requests.length).to.equal(0);
		expect(elevator.riders.length).to.equal(0);
	});
});

describe('Elevator Level 6 - Time Based Logic', () => {
	let elevator;

	beforeEach(() => {
		elevator = new Elevator();
	});

	it('should return to lobby if finished before 12:00 PM', () => {
		// We create a spy/mock for the Date object
		const originalDate = global.Date;
		global.Date = class extends Date {
		getHours() { return 9; } // Simulate 9:00 AM
		};

		const person = new Person("Morning Rider", 2, 5);
		elevator.requests.push(person);
		elevator.dispatch();

		// Floor 5 (dropoff) then back to 0 (lobby)
		expect(elevator.currentFloor).to.equal(0);
		
		global.Date = originalDate; // Restore original Date
	});

	it('should stay at last floor if finished after 12:00 PM', () => {
		const originalDate = global.Date;
		global.Date = class extends Date {
		getHours() { return 14; } // Simulate 2:00 PM
		};

		const person = new Person("Afternoon Rider", 2, 5);
		elevator.requests.push(person);
		elevator.dispatch();

		// Should remain at the last drop-off floor (5)
		expect(elevator.currentFloor).to.equal(5);

		global.Date = originalDate;
	});
});

// implemented the SCAN algorithm (also known as the Elevator Algorithm).
// Instead of finishing one person's entire trip before starting the next,
// the elevator will pick up anyone it passes as long as they are going in the same direction.
describe('Elevator Level 7 - Efficient Dispatch', () => {
	it('implementation of SCAN Algorithm (Level 7)', () => {
		const elevator = new Elevator();
		const bob = new Person("Bob", 3, 9);
		const sue = new Person("Sue", 4, 10);

		elevator.requests.push(bob, sue);
		elevator.dispatch();

		// The elevator traveled to 3, then 4, then 9, then 10.
		expect(elevator.floorsTraversed).to.equal(10); 
		expect(elevator.floorsTraversed).to.be.below(20); // Proving it beat FIFO
	});
});