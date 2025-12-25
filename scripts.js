function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added to cart!");
}

function renderCart() {
  const items = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsEl = document.getElementById("cart-items");
  const totalAmountEl = document.getElementById("total-amount");
  let total = 0;
  cartItemsEl.innerHTML = "";
  items.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center p-4 bg-gray-100 rounded";
    li.innerHTML = `<span>${item.name} - ₹${item.price.toFixed(2)}</span>
                    <button onclick="removeFromCart(${index})" class="text-red-600 hover:underline">Remove</button>`;
    cartItemsEl.appendChild(li);
  });
  if (totalAmountEl) {
    totalAmountEl.textContent = total.toFixed(2);
  }
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

window.onload = function () {
  if (document.getElementById("cart-items")) {
    renderCart();
  }
};

// Fetch and render books from data.json, and handle category filtering
async function fetchBooks() {
  const res = await fetch('data.json');
  return await res.json();
}

function renderBooks(books) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  books.forEach(book => {
    const card = document.createElement('div');
    card.className = `book-card border p-4 rounded shadow`;
    card.setAttribute('data-category', book.category);
    card.innerHTML = `
      <img src="${book.image}" alt="${book.title}" class="w-full h-48 object-cover mb-4 rounded">
      <h3 class="text-lg font-semibold">${book.title}</h3>
      <p class="text-sm text-gray-500">by ${book.author}</p>
      <p class="text-indigo-700 font-bold mt-2">₹${book.price.toFixed(2)}</p>
      <button onclick="addToCart('${book.title.replace(/'/g, "\'")}', ${book.price})" class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

let allBooks = [];
fetchBooks().then(books => {
  allBooks = books;
  renderBooks(allBooks);
});

// Category filter
if (document.querySelectorAll('.category-btn').length) {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('bg-indigo-200', 'font-bold'));
      this.classList.add('bg-indigo-200', 'font-bold');
      if (category === 'all') {
        renderBooks(allBooks);
      } else {
        renderBooks(allBooks.filter(book => book.category === category));
      }
    });
  });
}

window.addToCart = addToCart;

function addToCartByTitle(title) {
  // Find the book in allBooks by title
  const book = allBooks.find(b => b.title === title);
  if (book) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name: book.title, price: book.price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(book.title + " added to cart!");
  } else {
    alert("Book not found!");
  }
}
window.addToCartByTitle = addToCartByTitle;
