import menuArray from './data.js'

const menuListEl = document.getElementById('menu-list');
const orderListEl = document.getElementById('order-list');
const totalPriceEl = document.getElementById('totalPrice');
const orderEl = document.getElementById('order');
const afterModalEl = document.getElementById('afterOrderModal');


const modal = document.getElementById("orderModal");
const btnCompleteOrder = document.getElementById('BtnComplete');
const spanClose = document.getElementById('close');


let orders = [];
let totalPrice = 0;

//get the menu in the page from menuarray
function getMenuHtml(menuArr){
    return menuArr.map(property => {
        const {
            name,
            ingredients,
            price,
            emoji,
            id 
        } = property;
        const ingredientsStr = ingredients.join(', ');

        return `
        <li>
            <div class="menu-item">
                <span class="emoji">${emoji}</span>    
                <div class="menu-item-text">
                    <h2>${name}</h2>
                    <p>${ingredientsStr}</p>
                    <h3>${price}$</h3>
                </div>
                <button class="plus-button" data-id="${id}">+</button>
            </div>
        </li>`;
    }).join('');
}

//get the orders in the page 
function updateOrderList(orderArr) {
    return orderArr.map(property => {
        const {
            name,
            price,
            id,
            number 
        } = property;

       // orderPrice = property.price + property.number;

        return `
        <li class="order-items">
            <div  class="item">
                <p>${name}</p>
                <p id="number">x ${number}</p>
                <button class="remove-item" data-id="${id}">Remove</button>
            </div>
            <div>
                <p class="price-item">${price}$</p>
            </div>       
        </li>`
    }).join('');
}

//when click plus button
function handlePlusButtonClick(event) {


   if (event.target.classList.contains('plus-button')) {
    const id = parseInt(event.target.dataset.id, 10);
    const menuItem = menuArray.find(item => item.id === id);

    if(menuItem){
        const order = orders.find(o => o.id === id);

        if (order) {
            order.number ++;
            order.price += menuItem.price;
            } else {
            orders.push({ ...menuItem, number: 1, price: menuItem.price });
            }        
        orderListEl.innerHTML = updateOrderList(orders);
    }
    updateTotalPrice();
    }
}

// get total price in the page
function updateTotalPrice(){
    totalPrice = orders.reduce((sum,order) => sum + order.price,0);
    //if order.price was const
    //totalPrice = orders.reduce((sum, order) => sum + (order.price * order.number), 0);
    totalPriceEl.innerHTML = totalPrice + "$";
    orderEl.style.display = orders.length > 0 ? "block" : "none";
}

// when remove button
function handleRemoveButtonClick(event) {
    if (event.target.classList.contains('remove-item')) {
        const id = parseInt(event.target.dataset.id, 10);        
        const orderToRemove = orders.find(o => o.id === id);

        if (orderToRemove) {
            orders = orders.filter(o => o.id !== id);
            orderListEl.innerHTML = updateOrderList(orders); 
            updateTotalPrice();           
        }
    }
 }

//orderModal functions
btnCompleteOrder.onclick = function() {
    modal.style.display = "block";
}

spanClose.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// when click pay button
document.getElementById('orderForm').onsubmit = function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    modal.style.display = "none";
    orderEl.style.display = "none";

    afterModalEl.innerHTML = `<h2>Thanks, ${name}! Your order is on its way!</h2>`
    afterModalEl.style.display = "block";
}

// get the menu
menuListEl.innerHTML = getMenuHtml(menuArray);

// get the orders
orderListEl.innerHTML = updateOrderList(orders);


//afterModalEl.innerHTML = getMenuHtml(orders);

//when click plus button
menuListEl.addEventListener('click', handlePlusButtonClick);

//when click remove button
orderEl.addEventListener('click', handleRemoveButtonClick);