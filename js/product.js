const productId = localStorage.getItem('selectedProductId');

fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id == productId);
    if (!product) return showNotFound();

    document.getElementById('productDetail').innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg" />
      <div>
        <h1 class="text-2xl font-bold mb-2">${product.name}</h1>
        <p class="text-gray-600 mb-2">${product.specs}</p>
        <p class="text-xl text-blue-600 font-semibold mb-4">PKR ${product.price.toLocaleString()}</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Call / Whatsapp</button>
      </div> 
    `;
  });

function showNotFound() {
  document.getElementById('productDetail').innerHTML = `
    <p class="text-center text-red-500 font-semibold">Product not found.</p>
  `;
}
