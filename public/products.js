import {logOff, testingVariable} from './log-off';
// const testingfunction = require('./build-product-table')

async function buildProductsTable(productsTable, productsTableHeader, token, message, myproducts) {
  if(myproducts){
    getRoute = '/api/v1/products/myproducts';
    console.log(getRoute)
  } else{
    getRoute ='/api/v1/products'
    console.log(myproducts)
    console.log(getRoute)
  }
  try {
    const response = await fetch(`${getRoute}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [productsTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        productsTable.replaceChildren(...children); // clear this for safety
        return 0;
      } else {
        for (let i = 0; i < data.products.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.products[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.products[i]._id}>delete</button></td>`;
          let rowHTML = `<td>${data.products[i].name}</td><td>${data.products[i].price}</td><td>${data.products[i].featured}</td><td>${data.products[i].rating}</td><td>${data.products[i].createdAt}</td><td>${data.products[i].manufacturer}</td><td>${data.products[i].shipping_status}</td><td>${data.products[i].user_name}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        productsTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const loginRegister = document.getElementById("login-register");
  const login = document.getElementById("login");
  const register = document.getElementById("register");
  const loginDiv = document.getElementById("login-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginButton = document.getElementById("login-button");
  const loginCancel = document.getElementById("login-cancel");
  const registerDiv = document.getElementById("register-div");
 
  const name = document.getElementById("name");
  const email1 = document.getElementById("email1");
  const password1 = document.getElementById("password1");
  const password2 = document.getElementById("password2");
  const accountType = document.getElementById('account_type')
  
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");
  
  const products = document.getElementById("products");
 
  const productsTable = document.getElementById("products-table");
  const productsTableHeader = document.getElementById("products-table-header");
  const addproduct = document.getElementById("add-product");
  const editproduct = document.getElementById("edit-product");
  const viewMyProduct = document.getElementById("my-products-only");

  const product = document.getElementById("product");
  const price = document.getElementById("price");
  const featured = document.getElementById("featured");
  const rating = document.getElementById("rating");
  const manufacturer = document.getElementById("manufacturer");
  const shippingStatus = document.getElementById("shipping-status");

  const addingproduct = document.getElementById("adding-product");
  const productsMessage = document.getElementById("products-message");
  const editCancel = document.getElementById("edit-cancel");

  let edit_delete = ''

  // section 2
  let showing = loginRegister;
  let token = null;
  let myProductsOnly = false

  document.addEventListener("startDisplay", async () => {
    showing = loginRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildProductsTable(
        productsTable,
        productsTableHeader,
        token,
        message,
        myProductsOnly
      )
      if (count > 0) {
        productsMessage.textContent = "";
        productsTable.style.display = "block";
      } else {
        productsMessage.textContent = "There are no products to display for this user.";
        productsTable.style.display = "none";
      }
      products.style.display = "block";
      showing = products;
    } else {
      loginRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      loginRegister.style.display = "block";
      showing = loginRegister;
      productsTable.replaceChildren(productsTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
    } else if (e.target === login) {
      showing.style.display = "none";
      loginDiv.style.display = "block";
      console.log
      testingFunction();
      console.log(testingVariable);
      showing = loginDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === loginCancel || e.target == registerCancel) {
      showing.style.display = "none";
      loginRegister.style.display = "block";
      showing = loginRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === loginButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = data.msg;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          // How will we modify the front end so that the 'startDisplay" below accounts for different types of users?
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
              accountType: accountType.value
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = data.msg;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      }
    }
     // section 4
    else if(e.target === viewMyProduct){
      if (!myProductsOnly){
        myProductsOnly = true;
        console.log('clicked myproducts so that its true')
      }
      else if(myProductsOnly){
        myProductsOnly = false;
        console.log('clicked myproducts so that its true')
      }
      showing.style.display = "none";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent)

    } else if (e.target === addproduct) {
      showing.style.display = "none";
      editproduct.style.display = "block";
      showing = editproduct;
      delete editproduct.dataset.id;
      product.value = "";
      price.value = "";
      featured.value = "";
      rating.value="";
      manufacturer.value ="";
      shippingStatus.value ="ordered";
      addingproduct.textContent = "add";
    } else if (e.target === editCancel) {
      showing.style.display = "none";
      product.value = "";
      price.value = "";
      featured.value = "false";
      rating.value="";
      manufacturer.value ="";
      shippingStatus.value ="ordered";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingproduct) {
      if (!editproduct.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: product.value,
              price: price.value,
              featured: featured.value,
              rating: rating.value,
              manufacturer: manufacturer.value,
              shipping_status: shippingStatus.value
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = data.msg;
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            product.value = "";
            price.value = "";
            featured.value = "false";
            rating.value="";
            manufacturer.value ="";
            shippingStatus.value ="ordered";
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      } else if(edit_delete === 'edit button pressed') {
        // this is an update
        suspendInput = true;
        try {
          const productID = editproduct.dataset.id;
          const response = await fetch(`/api/v1/products/${productID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: product.value,
              price: price.value,
              featured: featured.value,
              rating: rating.value,
              manufacturer: manufacturer.value,
              shipping_status: shippingStatus.value
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = data.msg;
            showing.style.display = "none";
            product.value = "";
            price.value = "";
            featured.value = "false";
            rating.value="";
            manufacturer.value ="";
            shippingStatus.value ="ordered";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
      }
      else if(edit_delete === 'delete button pressed') {
        // this is a delete
        suspendInput = true;
        try {
          const productID = editproduct.dataset.id;
          const response = await fetch(`/api/v1/products/${productID}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = data.msg;
            showing.style.display = "none";
            product.value = "";
            price.value = "";
            featured.value = "false";
            rating.value="";
            manufacturer.value ="";
            shippingStatus.value ="ordered";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5
    else if (e.target.classList.contains("editButton")) {
      editproduct.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/products/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          product.value = data.name;
          price.value = data.price;
          featured.value = data.featured;
          rating.value = data.rating;
          manufacturer.value = data.manufacturer;
          shippingStatus.value = data.shipping_status;
          showing.style.display = "none";
          showing = editproduct;
          showing.style.display = "block";
          addingproduct.textContent = "update";
          edit_delete = 'edit button pressed'
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The products entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
    else if (e.target.classList.contains("deleteButton")) {
      editproduct.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/products/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          product.value = data.name;
          price.value = data.price;
          featured.value = data.featured;
          rating.value = data.rating;
          manufacturer.value = data.manufacturer;
          shippingStatus.value = data.shipping_status;
          showing.style.display = "none";
          showing = editproduct;
          showing.style.display = "block";
          addingproduct.textContent = "delete";
          edit_delete = 'delete button pressed'
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The products entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
  })
});

// export {logoff, message, loginRegister, login, register, loginDiv, email, password, loginButton, loginCancel, registerDiv, name, email1, password1, password2, accountType, registerButton, registerCancel, products, productsTable, productsTableHeader, addproduct, editproduct, viewMyProduct, product, price, featured, rating, manufacturer, shippingStatus, addingproduct, productsMessage, editCancel}