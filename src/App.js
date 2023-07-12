import React, { useState, useEffect } from 'react';

const App = () => {
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState(null);

  // Fetch the menu of dishes from the backend API
  useEffect(() => {
    fetch('/api/menu')
      .then((response) => response.json())
      .then((data) => setMenu(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  // Handle adding/removing items to/from the order
  const handleItemChange = (event, item) => {
    const { checked, value } = event.target;

    if (checked) {
      setSelectedItems([...selectedItems, { ...item, quantity: parseInt(value) }]);
    } else {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem._id !== item._id));
    }
  };

  // Handle placing the order
  const handlePlaceOrder = () => {
    const order = { items: selectedItems };

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        setOrderSummary(data.order);
        setSelectedItems([]);
      })
      .catch((error) => console.error('Error:', error));
  };

  // Handle retrieving order details
  const handleRetrieveOrder = (orderId) => {
    fetch(`/api/orders/${orderId}`)
      .then((response) => response.json())
      .then((data) => setOrderSummary(data.order))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <h1>Menu</h1>
      {menu.map((item) => (
        <div key={item._id}>
          <input type="checkbox" onChange={(e) => handleItemChange(e, item)} />
          <span>{item.name}</span>
          <span>{item.description}</span>
          <span>{item.price}</span>
          <input type="number" min="1" defaultValue="1" disabled={!selectedItems.includes(item)} />
        </div>
      ))}
      <button onClick={handlePlaceOrder}>Place Order</button>

      {orderSummary && (
        <div>
          <h2>Order Summary</h2>
          <p>Order ID: {orderSummary._id}</p>
          {/* Additional order summary information */}
        </div>
      )}
    </div>
  );
};

export default App;
