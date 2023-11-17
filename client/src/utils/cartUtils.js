export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate shipping charges (if order is over $100, then free; otherwise, $10 shipping charges)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // Calculate tax price (15% tax)
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice));

  // Calculate the total price for the items
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
  );

  // Update cart in local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
