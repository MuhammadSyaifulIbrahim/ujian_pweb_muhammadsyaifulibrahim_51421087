import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const apiUrl = 'https://jsonplaceholder.typicode.com/users';

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const addProduct = () => {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts([...products, data]);
        setNewProduct({
          name: '',
          price: 0,
          stock: 0,
        });
      })
      .catch(error => console.error('Error adding product:', error));
  };

  const deleteProduct = id => {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })
      .then(() => setProducts(products.filter(product => product.id !== id)))
      .catch(error => console.error('Error deleting product:', error));
  };

  const editProductClick = product => {
    setEditProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  };

  const updateProduct = () => {
    fetch(`${apiUrl}/${editProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const updatedProducts = products.map(product =>
          product.id === data.id ? data : product
        );
        setProducts(updatedProducts);
        setEditProduct(null);
        setNewProduct({
          name: '',
          price: 0,
          stock: 0,
        });
      })
      .catch(error => console.error('Error updating product:', error));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Stock Management App</h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Price (IDR)"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Stock Quantity"
          value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
        />
        {editProduct ? (
          <button
            className="btn btn-warning mr-2"
            onClick={updateProduct}
          >
            Update Product
          </button>
        ) : (
          <button
            className="btn btn-primary mr-2"
            onClick={addProduct}
          >
            Add Product
          </button>
        )}
        {editProduct && (
          <button
            className="btn btn-secondary"
            onClick={() => setEditProduct(null)}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <ul className="list-group">
        {products.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            {product.name} - Price: {product.price} IDR - Stock: {product.stock}
            <div>
              <button
                className="btn btn-info mr-2"
                onClick={() => editProductClick(product)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
