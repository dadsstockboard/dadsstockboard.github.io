// Your Cloudflare Worker
const API_URL = "https://dads-stock-board.dadsstockboard.workers.dev";


let stocks = [];


const stockInput = document.getElementById("stockInput");
const addButton = document.getElementById("addButton");
const stockList = document.getElementById("stockList");
const stockCount = document.getElementById("stockCount");


/*
* Load the saved stock list
*/
async function loadStocks() {

    try {

        stockList.innerHTML = `
            <div class="empty-message">
                Loading stocks...
            </div>
        `;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load stocks");
        }

        const data = await response.json();

        stocks = data.stocks || [];

        displayStocks();

    } catch (error) {

        console.error(error);

        stockList.innerHTML = `
            <div class="empty-message">
                Unable to load stocks.<br>
                Please try again.
            </div>
        `;

    }

}


/*
* Save the current stock list
*/
async function saveStocks() {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            stocks: stocks
        })

    });


    if (!response.ok) {

        const error = await response.text();

        console.error(error);

        throw new Error("Could not save stocks");

    }

}


/*
* Display stocks on the webpage
*/
function displayStocks() {

    stockList.innerHTML = "";


    if (stocks.length === 0) {

        stockList.innerHTML = `
            <div class="empty-message">
                No stocks added yet.<br>
                Enter a ticker above to get started.
            </div>
        `;

    } else {

        stocks.forEach(function(stock, index) {

            const card = document.createElement("div");

            card.className = "stock-card";

            card.innerHTML = `
                <div>
                    <div class="stock-symbol">${stock}</div>
                    <div class="stock-status">
                        ● DISPLAYING
                    </div>
                </div>

                <button
                    class="remove-button"
                    onclick="removeStock(${index})"
                    title="Remove ${stock}"
                >
                    ×
                </button>
            `;

            stockList.appendChild(card);

        });

    }


    stockCount.textContent =
        stocks.length +
        (stocks.length === 1 ? " stock" : " stocks");

}


/*
* Add a stock
*/
async function addStock() {

    let symbol = stockInput.value
        .trim()
        .toUpperCase();


    if (symbol === "") {
        return;
    }


    // Prevent duplicates
    if (stocks.includes(symbol)) {

        alert(symbol + " is already on the board.");

        stockInput.value = "";

        return;

    }


    // Temporarily disable button
    addButton.disabled = true;

    addButton.textContent = "Saving...";


    try {

        stocks.push(symbol);

        await saveStocks();

        displayStocks();

        stockInput.value = "";

    } catch (error) {

        // Undo the change if saving failed
        stocks.pop();

        alert(
            "Could not save the stock. Please try again."
        );

    }


    addButton.disabled = false;

    addButton.textContent = "+ Add Stock";

}


/*
* Remove a stock
*/
async function removeStock(index) {

    const removedStock = stocks[index];


    // Remove it locally
    stocks.splice(index, 1);

    displayStocks();


    try {

        await saveStocks();

    } catch (error) {

        // Put it back if saving failed
        stocks.splice(index, 0, removedStock);

        displayStocks();

        alert(
            "Could not remove the stock. Please try again."
        );

    }

}


/*
* Pressing Enter adds the stock
*/
stockInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addStock();

        }

    }
);


/*
* Clicking the Add button
*/
addButton.addEventListener(
    "click",
    addStock
);


/*
* Load saved stocks when page opens
*/
loadStocks();
