let stocks = [
    "AAPL",
    "UAL",
    "DAL"
];


const stockInput = document.getElementById("stockInput");
const addButton = document.getElementById("addButton");
const stockList = document.getElementById("stockList");
const stockCount = document.getElementById("stockCount");


function displayStocks() {

    stockList.innerHTML = "";

    if (stocks.length === 0) {

        stockList.innerHTML = `
            <div class="empty-message">
                No stocks added.<br>
                Enter a symbol above to get started.
            </div>
        `;

    } else {

        stocks.forEach(function(stock, index) {

            const card = document.createElement("div");

            card.className = "stock-card";

            card.innerHTML = `
                <div>
                    <div class="stock-symbol">${stock}</div>
                    <div class="stock-status">● DISPLAYING</div>
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


function addStock() {

    let symbol = stockInput.value
        .trim()
        .toUpperCase();

    if (symbol === "") {
        return;
    }

    /*
        * Don't allow duplicates.
        */

    if (stocks.includes(symbol)) {

        alert(symbol + " is already on the board.");

        stockInput.value = "";

        return;
    }

    stocks.push(symbol);

    stockInput.value = "";

    displayStocks();

}


function removeStock(index) {

    stocks.splice(index, 1);

    displayStocks();

}


addButton.addEventListener("click", addStock);


stockInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addStock();
    }

});


displayStocks();