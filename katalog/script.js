document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const productStockInput = document.getElementById('productStock');
    const productTableBody = document.getElementById('productTableBody');
    const emptyState = document.getElementById('emptyState');

    const DATA_FILE = 'products.json';

    function createStars() {
        const body = document.body;
        const starsContainer = document.createElement('div');
        starsContainer.style.position = 'fixed';
        starsContainer.style.top = '0';
        starsContainer.style.left = '0';
        starsContainer.style.width = '100%';
        starsContainer.style.height = '100%';
        starsContainer.style.zIndex = '-1';
        starsContainer.style.pointerEvents = 'none';
        body.appendChild(starsContainer);

        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const animationDelay = Math.random() * 3;
            star.style.animationDelay = `${animationDelay}s`;
            starsContainer.appendChild(star);
        };

        for (let i = 0; i < 100; i++) {
            createStar();
        }
    }

    function loadProducts() {
        let products = [];
        try {
            const storedData = localStorage.getItem(DATA_FILE);
            if (storedData) {
                products = JSON.parse(storedData);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
        return products;
    }

    function saveProducts(products) {
        try {
            localStorage.setItem(DATA_FILE, JSON.stringify(products));
        } catch (error) {
            console.error('Error saving products:', error);
        }
    }

    function renderProducts(products) {
        productTableBody.innerHTML = '';

        if (products.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.className = 'table-row';
            row.innerHTML = `
                <td class="px-6 py-5 font-medium text-white">${product.name}</td>
                <td class="px-6 py-5 text-gray-300">Rp ${product.price.toLocaleString('id-ID')}</td>
                <td class="px-6 py-5">
                    <span class="px-3 py-1 rounded-full text-sm font-semibold
                        ${product.stock > 0 ? 'bg-green-900/50 text-green-300 border border-green-500/30' : 'bg-red-900/50 text-red-300 border border-red-500/30'}">
                        ${product.stock}
                    </span>
                </td>
                <td class="px-6 py-5">
                    <button onclick="deleteProduct(${index})" class="text-red-400 hover:text-red-300 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    }

    function addProduct(product) {
        const products = loadProducts();
        products.push(product);
        saveProducts(products);
        renderProducts(products);
    }

    window.deleteProduct = function(index) {
        const products = loadProducts();
        products.splice(index, 1);
        saveProducts(products);
        renderProducts(products);
    };

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productName = productNameInput.value.trim();
        const productPrice = parseFloat(productPriceInput.value);
        const productStock = parseInt(productStockInput.value);

        if (productName && !isNaN(productPrice) && !isNaN(productStock)) {
            addProduct({
                name: productName,
                price: productPrice,
                stock: productStock
            });

            productForm.reset();
            productNameInput.focus();
        }
    });

    createStars();
    renderProducts(loadProducts());
});