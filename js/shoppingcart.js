let products = [];
let cart = [];

/* ---------------------------
   STORAGE FUNCTIONS
---------------------------- */

function saveProductsToStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function loadProductsFromStorage() {
    const stored = localStorage.getItem("products");
    if (stored) products = JSON.parse(stored);
}

function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem("cart");
    if (stored) cart = JSON.parse(stored);
}

/* ---------------------------
   LOAD PRODUCTS FROM TABLE
---------------------------- */

function loadProductsFromTable() {
    products = []; // 🔥 reset so no duplicates

    $("#productTable tr").each(function () {
        const product = {
            productId: $(this).find("td:eq(0)").text(),
            description: $(this).find("td:eq(1)").text(),
            category: $(this).find("td:eq(2)").text(),
            unit: $(this).find("td:eq(3)").text(),
            price: parseFloat($(this).find("td:eq(4)").text().replace("$", ""))
        };

        products.push(product);
    });

    saveProductsToStorage();
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

function addToCart(index) {
    cart.push(products[index]);
    saveCartToStorage();
    displayCart();
}

/* ---------------------------
   REMOVE FROM CART (FIXED)
---------------------------- */

$(document).on("click", ".remove-btn", function () {
    const index = $(this).data("index");
    cart.splice(index, 1);
    saveCartToStorage();
    displayCart();
});

/* ---------------------------
---------------------------- */

$(document).on("click", "#productTable button", function () {
    const rowIndex = $(this).closest("tr").index();
    addToCart(rowIndex);
});

/* ---------------------------
   SEARCH FILTER
---------------------------- */

$("#searchInput").on("keyup", function () {
    const value = $(this).val().toLowerCase();

    $("#productTable tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().includes(value));
    });
});

/* ---------------------------
   ADD PRODUCT FORM
---------------------------- */

$("#productForm").submit(function (e) {
    e.preventDefault();

    const productId = $("#productId").val();
    const description = $("#description").val();
    const category = $("#category").val();
    const unit = $("#unit").val();
    const price = $("#price").val();

    if (!productId || !description || !category || !unit || !price) {
        alert("Please fill in all required fields!");
        return;
    }

    if (price <= 0) {
        alert("Price must be greater than 0!");
        return;
    }

    const newProduct = {
        productId,
        description,
        category,
        unit,
        price: parseFloat(price)
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

    alert("Product added successfully!");
    this.reset();
});

/* ---------------------------
   INITIALIZATION
---------------------------- */

$(document).ready(function () {
    loadProductsFromStorage();

    if (products.length === 0) {
        loadProductsFromTable();
    }

    loadCartFromStorage();
    displayCart();
});
