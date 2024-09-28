

const table = document.querySelector('table tbody');
const form = document.querySelector('form');
const submit = document.querySelector('#productForm');
let currentProductId = null;

async function upload() {
    const res = await fetch('https://api.escuelajs.co/api/v1/products');
    const products = await res.json();
    console.log(products);
    table.innerHTML = '';
    products.forEach(prd => {
        var tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${prd.id}</td>
        <td class="flex items-center mr-16"><img class="h-12 w-10 rounded-full" src="${prd.images[0].split("\"")[1]}"/> ${prd.title}</td>
        <td>${prd.category.name}</td>
        <td>${prd.price}</td>
        <button id="edit" class="bg-blue-500 m-3 hover:bg-blue-600 text-white p-2 rounded" onclick="editIt(${prd.id})">Edit</button>
        <button id="delete" class="bg-red-500 m-3 hover:bg-red-600 text-white p-2 rounded" onclick="deleteIt(${prd.id})">Delete</button>`
        table.append(tr)
    });
}
upload();

//abhi tk manie sb display krvaya simply apni website pr

async function addProduct(newPrd) {
    const url = 'https://api.escuelajs.co/api/v1/products';
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPrd)
    });

    const result = await response.json();  // Parse the response
    console.log(result);  // Check if the response indicates success

    if (response.ok) {  // Check if the request was successful
        upload();  // Refresh the table
    } else {
        alert('Failed to add product');
    }
}


const create_btn = document.querySelector('#create');
create_btn.addEventListener('click', () => {
    form.classList.remove('hidden');
    form.reset();
    currentProductId = null;
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const price = parseFloat(document.querySelector('#price').value);
    const description = document.querySelector('#description').value;
    const images = [document.querySelector('#images').value];
    const categoryId = parseInt(document.getElementById('categoryId').value, 10);

    const newPrd = {
        title: title,
        price: price,
        description: description,
        categoryId: categoryId,
        images: images
    }
    if (currentProductId) {
        await updateProduct(currentProductId, newPrd)
    } else {
       await addProduct(newPrd);
    }
    form.classList.add('hidden');
    form.reset();
})

async function deleteIt(id) {
    const endPoint =` https://api.escuelajs.co/api/v1/products/${id}`;
    const response = await fetch(endPoint, {
        method: "DELETE"
    })
    if (response.ok) {
        upload();
    } else {
        alert('Failed to delete product')
    }
}

async function editIt(id) {
    const url = `https://api.escuelajs.co/api/v1/products/${id}`;
    const response = await fetch(url);
    const product = await response.json();
    form.classList.remove('hidden');

    document.querySelector('#title').value = product.title;
    document.querySelector('#price').value = product.price;
    document.querySelector('#description').value = product.description;
    document.querySelector('#images').value = product.images[0]; // assuming it's an array
    document.querySelector('#categoryId').value = product.category.id;

    currentProductId = id;
}

async function updateProduct(id, updatedProduct) {
    const url = `https://api.escuelajs.co/api/v1/products/${id}`;
    const answer = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    })

    if (answer.ok) {
        const dataPrd = await answer.json();
        console.log(dataPrd)
        upload();

    } else {
        alert('Failed to add product');
    }
}