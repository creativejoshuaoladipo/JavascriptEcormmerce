//Variable
const cartBtn = document.querySelector(".cart-btn");
const closeCart = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-Items");
const cartTotal = document.querySelector(".cart-Total");
const cartContent = document.querySelector(".cart-content");
const productDOM = document.querySelector(".product-center");

//Cart
let cart = []; //The variable we will use to store all the Purchased Product

let ButtonsDom = []; //To save all the Buttons

//To Get All our Products From a Sorage file/ Server
class Products {

    async getProduct() {

        try {

            let result = await fetch('Products.json');
            let data = await result.json();
            let products = data.items;

            //Mapping of JSON Properties to the Products Arrays in order to extract what we need.
           products = products.map(item => {
               const { title, price } = item.fields;
               const { id } = item.sys;
               const image = item.fields.image.fields.file.url;

               return { title, price, id, image };
            }
                )

            return products;

        } catch (error) {
            console.log(error);
        }     
    }

    
}

class UI {
    //For Displaying the Product that will be gotten after it has been searched
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += 
               ` <article class="product">
                    <div class="img-container">
                    <img src=${product.image}
                            alt="product" class="product-img" />
                        <button class="bag-btn" data-id= ${product.id}>
                            <i class="fas fa-shopping-cart">ADD TO BAG</i>
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
            </article> `;
        });
        productDOM.innerHTML = result;
    }


    //To Get BagButtons of each Products
    getBagButton() {
        //Using our DOM method of locating the HTMLtage for buttons and convert it to an Array using ...
        const Buttons = [...document.querySelectorAll("bag-btn")];
        ButtonsDom = Buttons;
        //Get the ID of each Button Pressed to locate the Product associated with it
        buttons.forEach(button => {
            // To acess the Id from the button, you make use of Dataset Attributes
            let id = Buttons.dataSet.id;

            //To check if the Item is already in the Cart using the Id
            let inCart = cart.find(item => item.id === id);

            if (inCart) {
                button.innerText = "In Cart";
                // After Checking it, disable the button if it is in the Cart
                button.disabled = true;
            } 
                //If the button is not in the Cart, we will create an EventListener to add it to the Cart when the button is clicked

                button.addEventListener("click", (event) => {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;

                    //Get Products
                  /**When the Button of a Product is clicked- Get Product From Products Stored in the local Variable
                  Use the spread operator({...}) to get all the properties of the value gotten then add an amount property
                  Your getProuct Method is coming from the Storage Class as a static Method **/
                    let cartItem = { ...Storage.getProduct(id), amount:1 };

                    //Add Product to Cart
                    //After you have gotten your cartItem from the Local Storage, then Add it to the Cart
                    //Mind you, you have already initially declared your cart before now as an empty array cart =[];
                    //You are Adding all the Item in the Cart and the New CartItem
                    let cart = [...cart, cartItem];

                    //Save Cart in Local Storage
                    Storage.saveCart(cart);

                    //Set Cart Value
                    //To Add the Number of Items that will appear on an Cart Icon when a Product is added
                    this.setCartValue(cart);

                    //Add cart Item 
                    this.addCartItem(cartItem);

                    //Show cart Item
                    this.showCart();
                })


        })     
    }

    setCartValue(cart) {
        let tempTotal = 0;
        let itemTotal = 0;

        cart.forEach(item => {
            tempTotal += item.price * item.amount;
            itemTotal += item.amount;
        })
  //To ensure the tempTotal doesn't release a value more than 2 dec places for Price we used .toFixed(2) then convert it back to a float value
        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
        cartItems.innerHTML = itemTotal;
    }


    addCartItem(item) {

        // Create an HTML Div tag using doc.creatElement
        const div = document.createElement('div');
        //Use Your Created Div to create a Class using .classList
        div.classList.Add('cart Item');

        //Use your temperate literals to insert your HTML tags of your Cart SEssion to be included in the DIV
        div.innerHTML = `
             <img src= ${item.image} alt="product" />
                    <div>
                        <h4> ${item.title}</h4>
                        <h5>  $${item.price}</h5>
                        <span class= "remove-items" data-id =${item.id}>Remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id =${item.id}></i>
                        <p class="item-amount">${item.price}</p>
                        <i class="fas fa-chevron-down" data-id =${item.id}></i>
                    </div>

                    <!-- End Cart Session-->

                    <div class="cart-footer">
                        <h3> Your Total : <span class="cart-total">0</span></h3>
                        <button class="clear-cart banner-btn"> Clear Chart</button>
                    </div> `
        //Once you are done creating the DIV Element you cand add it to the Main DIV Class of Cart as a child Div= cart-content
        //using appendChild()

        cartContent.appendChild(div);

    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showChart');
    }

    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showChart');
    }

    cartLogic() {

        clearCartBtn.addEventListener('click', () => { this.clearCart(); });
         //Cart Funtionalities for adding and Remove and Increasing/ Decreasing Button
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;

                let id = removeItem.dataSet.id;
                //Since Remove Item is a grandChild of CartContent, we will have to reference the two Parent Elements
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItems(id);

            }//For Increasing Items
            else if (event.target.classList.contains('fa-chevron-up'))
            {
                let increaseItem = event.target;

                let id = increaseItem.dataSet.id;

                //Find item in Cart
                let tempItem = cart.find(item => { item.id === id });

                tempItem.amount = temptItem.amount + 1;

                //Save Updated Value inside the Local Storage
                Storage.saveCart(cart);

                //To set Cart Values on the cartDOM
                this.setCartValue(cart);

                //To automatically Increase the Price while the Items are Increasing
                increaseItem.nextElementSibling.innerHTML = tempItem.amount;

                //To decrease the Item
            } else if (event.target.classList.contains('fa-chevron-down')) {
                let decreaseItem = event.target;

                let id = decreaseItem.dataSet.id;

                //Find item in Cart
                let tempItem = cart.find(item => { item.id === id });

                tempItem.amount = temptItem.amount - 1;
                //When decreasing and the Item get to 0, totally remove the entire Products completly
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValue(cart);
                    decreaseItem.previousElementSibling.innerHTML = tempItem.amount;

                } else {
                    cartContent.removeChild(decreaseItem.parentElement.parentElement)
                    this.removeItems(id);
                }

                //Save Updated Value inside the Local Storage
                Storage.saveCart(cart);

                //To set Cart Values on the cartDOM
                this.setCartValue(cart);

                //To automatically Increase the Price while the Items are Increasing
                decreaseItem.nextElementSibling.innerHTML = tempItem.amount;

            }

    })
    }
   
   

    clearCart() {
        //Get the IDs of the Products currently in the Cart
        let cartItem = cart.map(item => item.id);
//After getting the IDs, remove the Items from the Cart 
        cartItem.forEach(id => this.removeItems(id))

        //wE STILL HAVE TO CLEAR THE DOM IN THE DIV-> CART-CONTENT
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();

    }

    getSingleButton(id) {
        return ButtonsDom.find(button => button.dataSet.id === id);
    }

    removeItems(id) {
//Filter the Cart and return Items that are not equal to these IDs that is been passed from CartItem  which automatically returns an EmptyArrayList and clear the Cart
        cart.filter(item => item.id !== id);
        //Edit your EmptyResult to the setCartValue
        this.setCartValue(cart);
        //Save Cart into localStorage
        Storage.saveCart(cart);
        //Change the Button fron INCART to ADDTOBAG when the cart has been cleared
        let button = this.getBagButton(id);
        //Enable the Button by changing theDisable status to false
        button.disabled = false;
        //Change the InnerHTML of the NewButtonTag to ADD TO CART
        button.innerHTML = `<i class ="fa fa-shopping-cart"></i>ADD TO CART`
    }

    setUpAPP() {
        //Checking For Items in the Local Storage and Saving it
        cart = Storage.getCart();
        //Passing your Saved Value to your method
        this.setCartValue(cart);
        //Add to the Cart
        this.populateCart(cart);
        //Show Cart when a ProductBtn is clicked using EventListener
        cartBtn.addEventListener('click', this.showCart);
        //Adding Event Listener to the Button so as to Hide the Cart when you are done with the cart
        cartBtn.addEventListener('click', this.hideCart);
    }

    //Ading Item to a Cart
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item))
    }

    


}

class Storage {
    //Saving your Products fetched from JSON to your LocalStorage of the Browser
    static saveProducts(products) {
        //When Passing your Product to your Local Storage, Stringify it for it to save as a string while setting the items
        localStorage.setItem("products", JSON.stringify(products));

    }
 //To get Saved Product from the Local Storage
    static getProduct(id) {
 //Since our Products in the Local Storage is in String, we will just parse it when getting the Item Arrays
        let products = JSON.parse(localStorage.getItem("products"));
  //After Getting the Array of Products from the local Storage, we searched for the Specific Product using the find method the returned it for the class that will need it
        return products.find(item => { item.id === id });
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart() {
        //To check if there is anythinside the Cart if yes? Parse it else :[]
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')):[]}

}

document.addEventListener("DOMcontentLoader", () => {
    const ui = new UI();
    const product = new Products();

    //Set Up Application
    ui.setUpAPP();

    //Add Product
    //Fetch the Products then Display the Products then Save the Products-- ADDEventListener
    product.getProduct().then(products => {
        ui.displayProducts(products);
    //One beauty of Static Method is that you don't need to instantiate the class when you want to use the method
        Storage.saveProducts(products);
    // After the Products has been saved in the Local Storage then get the Product based on the button clicked
    }).then(() => { ui.getBagButton(); ui.cartLogic()});
});