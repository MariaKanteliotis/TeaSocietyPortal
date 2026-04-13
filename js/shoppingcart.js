let products = [];
let cart = [];

/* ---------------------------
   JSON STORAGE FUNCTIONS
---------------------------- */

function saveProductsToStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function loadProductsFromStorage() {
    let stored = localStorage.getItem("products");
    if (stored) products = JSON.parse(stored);
}

function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
    let stored = localStorage.getItem("cart");
    if (stored) {
        cart = JSON.parse(stored);
        displayCart();
    }
}

/* ---------------------------
   EXPORT JSON FUNCTIONS
---------------------------- */

function exportProductsJSON() {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();

    URL.revokeObjectURL(url);
}

function exportCartJSON() {
    const dataStr = JSON.stringify(cart, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cart.json";
    a.click();

    URL.revokeObjectURL(url);
}

/* ---------------------------
   PRODUCT + CART FUNCTIONS
---------------------------- */

function loadProductsFromTable() {
    $("#productTable tr").each(function () {
        let product = {
            productId: $(this).find("td:eq(0)").text(),
            description: $(this).find("td:eq(1)").text(),
            category: $(this).find("td:eq(2)").text(),
            unit: $(this).find("td:eq(3)").text(),
            price: parseFloat($(this).find("td:eq(4)").text().replace("$", ""))
        };
        products.push(product);
    });
}

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
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                            Remove
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    $("#cartTable").html(output);
}

function addToCart(index) {
    cart.push(products[index]);
    saveCartToStorage();
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    displayCart();
}

function attachAddButtons() {
    $("#productTable tr").each(function (index) {
        $(this).find("button").click(function () {
            addToCart(index);
        });
    });
}

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
   ADD PRODUCT FORM
---------------------------- */

$("#productForm").submit(function (e) {
    e.preventDefault();

    let productId = $("#productId").val();
    let description = $("#description").val();
    let category = $("#category").val();
    let unit = $("#unit").val();
    let price = $("#price").val();
    let weight = $("#weight").val();
    let color = $("#color").val();

    if (!productId || !description || !category || !unit || !price) {
        alert("Please fill in all required fields!");
        return;
    }

    if (price <= 0) {
        alert("Price must be greater than 0!");
        return;
    }

    let newProduct = {
        productId,
        description,
        category,
        unit,
        price: parseFloat(price),
        weight,
        color
    };

    products.push(newProduct);
    saveProductsToStorage();

    $("#productTable").append(`
        <tr>
            <td>${productId}</td>
            <td>${description}</td>
            <td>${category}</td>
            <td>${unit}</td>
            <td>$${parseFloat(price).toFixed(2)}</td>
            <td><button class="btn btn-success btn-sm">Add</button></td>
        </tr>
    `);

    attachAddButtons();

    $("#jsonPreview").text(JSON.stringify(newProduct, null, 2));

    alert("Product added successfully!");

    this.reset();
});

/* ---------------------------
   SEND CART TO API
---------------------------- */

function sendCartData() {
    $.ajax({
        url: "https://example.com/api/cart",
        method: "POST",
        data: JSON.stringify(cart),
        contentType: "application/json",
        success: function () {
            alert("Cart sent successfully!");
        },
        error: function () {
            alert("Error sending cart.");
        }
    });
}

$(".hidden-section button").click(function () {
    sendCartData();
});

/* ---------------------------
   INITIALIZATION
---------------------------- */

$(document).ready(function () {
    loadProductsFromStorage();
    loadCartFromStorage();

    if (products.length === 0) {
        loadProductsFromTable();
        saveProductsToStorage();
    }

    attachAddButtons();
});
