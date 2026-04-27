let products = [];
let cart = [];

/* ---------------------------
   STORAGE FUNCTIONS
---------------------------- */

function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
    let stored = localStorage.getItem("cart");
    if (stored) {
        cart = JSON.parse(stored);
    }
}

/* ---------------------------
   DISPLAY CART
---------------------------- */

function displayCart() {
    let output = "";

    if (cart.length === 0) {
        output = `<tr><td colspan="6" class="text-center">Cart is empty</td></tr>`;
    } else {
        cart.forEach((item, index) => {
            output += `
                <tr>
                    <td>${item.productId}</td>
                    <td>${item.description}</td>
                    <td>${item.category}</td>
                    <td>${item.unit}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">
                            Remove
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    $("#cartTable").html(output);
}

/* ---------------------------
   ADD TO CART (FIXED)
---------------------------- */

$(document).on("click", "#productTable button", function () {
    const row = $(this).closest("tr");

    const product = {
        productId: row.find("td:eq(0)").text(),
        description: row.find("td:eq(1)").text(),
        category: row.find("td:eq(2)").text(),
        unit: row.find("td:eq(3)").text(),
        price: parseFloat(row.find("td:eq(4)").text().replace("$", ""))
    };

    cart.push(product);
    saveCartToStorage();
    displayCart();
});

/* ---------------------------
   REMOVE FROM CART
---------------------------- */

$(document).on("click", ".remove-btn", function () {
    const index = $(this).data("index");

    cart.splice(index, 1);
    saveCartToStorage();
    displayCart();
});

/* ---------------------------
   SEARCH FILTER
---------------------------- */

$("#searchInput").on("keyup", function () {
    let value = $(this).val().toLowerCase();

    $("#productTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

/* ---------------------------
   INIT
---------------------------- */

$(document).ready(function () {
    loadCartFromStorage();
    displayCart();
});
