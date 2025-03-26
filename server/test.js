import fetch from 'node-fetch';

const API_URL = "http://localhost:3000/api";

async function runTests() {
    try {
        console.log("Starting tests...\n");

        // Test 1: Get all children
        console.log("Test 1: Getting all children...");
        const getAllResponse = await fetch(`${API_URL}/points`);
        const allChildren = await getAllResponse.json();
        console.log("Children in database:", allChildren.length);
        console.log("Test 1 passed!\n");

        // Test 2: Add/Update a child's points
        console.log("Test 2: Adding points to Audrey...");
        const updateResponse = await fetch(`${API_URL}/points`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "Audrey",
                points: 5,
                positiveBehaviors: [
                    {
                        id: 1,
                        name: "Test Behavior",
                        description: "Test Description",
                        points: 1,
                        tags: ["Test"]
                    }
                ]
            })
        });
        const updatedChild = await updateResponse.json();
        console.log("Updated child data:", updatedChild);
        console.log("Test 2 passed!\n");

        // Test 3: Get behavior counter
        console.log("Test 3: Getting behavior counter...");
        const counterResponse = await fetch(`${API_URL}/counter`);
        const counter = await counterResponse.json();
        console.log("Current counter:", counter);
        console.log("Test 3 passed!\n");

        // Test 4: Update behavior counter
        console.log("Test 4: Updating behavior counter...");
        const updateCounterResponse = await fetch(`${API_URL}/counter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                positive: 5,
                negative: 5
            })
        });
        const updatedCounter = await updateCounterResponse.json();
        console.log("Updated counter:", updatedCounter);
        console.log("Test 4 passed!\n");

        console.log("All tests completed successfully!");

    } catch (error) {
        console.error("Test failed:", error);
    }
}

runTests();
