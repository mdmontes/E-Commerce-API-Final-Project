import {logIn} from './login-and-register/log-in.js';
import { buildProductsTable } from './build-prod-table.js';
import { loginButtonActive } from './login-and-register/log-in-button.js';
import { logOff } from './login-and-register/log-off.js';
import { registerButtonActive } from './login-and-register/register-button.js';
import { addingProductButton } from './table-manipulate/adding-product-button.js';
import { viewProductButton } from './table-manipulate/view-product-button.js';


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
  const accountType = document.getElementById('account_type');
  const gender = document.getElementById('gender');
  const birthDate = document.getElementById('birthDate');
  const address = document.getElementById('address');
  const zipCode = document.getElementById('zipCode');

  
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
  const deleteproduct = document.getElementById("delete-product");
  const buyproduct = document.getElementById("buy-product");

  const productsMessage = document.getElementById("products-message");
  const editCancel = document.getElementById("edit-cancel");

  let edit_delete = ''
  let getRoute = ''
 
  // section 2
  let showing = loginRegister;
  let token = null;
  let myProductsOnly = false
  let responseAccountType = ''

  document.addEventListener("startDisplay", async () => {
    showing = loginRegister;
    token = localStorage.getItem("token");
    responseAccountType = localStorage.getItem("responseAccountType");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildProductsTable(
        productsTable,
        productsTableHeader,
        token,
        message,
        myProductsOnly,
        getRoute
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
       let logOffOutput = await logOff(
        token, 
        showing, 
        loginRegister, 
        productsTable, 
        productsTableHeader, 
        message)
      message.textContent = logOffOutput.message.textContent
      showing = logOffOutput.showing
    } else if (e.target === login) {
      showing = await logIn(showing, loginDiv)
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === loginCancel || e.target == registerCancel) {
      showing.style.display = "none";
      loginRegister.style.display = "block";
      showing = loginRegister;
      console.log(showing)
      console.log(typeof showing)
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
      gender.value ="";
      birthDate.value ="";
      address.value = "";
      zipCode.value = "";

    } else if (e.target === loginButton) {
      suspendInput = true;
      suspendInput = await loginButtonActive(
        message,
        token,
        responseAccountType,
        showing,
        email,
        password,
        suspendInput,
        thisEvent);
    } else if (e.target === registerButton) {
      suspendInput = await registerButtonActive(
        message, 
        name, 
        email1, 
        password1, 
        password2, 
        accountType,
        gender,
        birthDate,
        address,
        zipCode, 
        suspendInput, 
        token,
        responseAccountType, 
        showing, 
        thisEvent)
    }
     // section 4
    else if(e.target === viewMyProduct){
      if (!myProductsOnly){
        viewMyProduct.textContent = 'View All Products in Market'
        myProductsOnly = true;
        console.log('clicked myproducts so that its true')
      }
      else if(myProductsOnly){
        viewMyProduct.textContent = 'View My Products Only'
        myProductsOnly = false;
        console.log('clicked myproducts so that its false')
      }
      showing.style.display = "none";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent)
    } else if (e.target === addproduct) {

      product.disabled = false;
      price.disabled = false;
      featured.disabled = false;
      rating.disabled = true;
      manufacturer.disabled = false
      shippingStatus.disabled = true;

      console.log(responseAccountType)
      if(responseAccountType =='seller'){
        addingproduct.style.visibility = 'visible';
        deleteproduct.style.display = 'none';
        buyproduct.style.display= 'none';

        console.log(` add clicked addingproduct is ${addingproduct.style.visibility}`);
        console.log(` add clicked deleteproduct is ${deleteproduct.style.visibility}`)
        editproduct.style.display = "block";

        showing.style.display = "none";
        console.log(`pressed add product`);
        showing = editproduct;
        delete editproduct.dataset.id;
        product.value = "";
        price.value = "";
        featured.value = "";
        rating.value="";
        manufacturer.value ="";
        shippingStatus.value ="ordered";
        addingproduct.textContent = "add";
        } else{
          message.textContent = 'You must have the account type SELLER to create products'
          product.disabled = false;
          price.disabled = false;
          featured.disabled = false;
          rating.disabled = false;
          manufacturer.disabled = false
          shippingStatus.disabled = false;

        }
    } else if (e.target === editCancel) {
      console.log('edit cancel being pressed')
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
       console.log(showing.style.display)
      let addingProductOutput = await addingProductButton(
        token,
        editproduct, 
        suspendInput, 
        product, 
        price, 
        featured, 
        rating, 
        manufacturer, 
        shippingStatus, 
        thisEvent, 
        showing, 
        message, 
        edit_delete,
        responseAccountType)
      message.textContent = addingProductOutput.message.textContent;
      showing = addingProductOutput.showing;
      suspendInput = addingProductOutput.suspendInput;
      responseAccountType = addingProductOutput.responseAccountType
    } // section 5
    else if (e.target.classList.contains("viewButton")) {
      suspendInput = true;
      addingproduct.style.visibility = "visible";
      deleteproduct.style.display= "inline-block";
      buyproduct.style.display= 'inline-block';

      console.log(` edit clicked addinproduct is ${addingproduct.style.visibility}`);
      console.log(` edit clicked deleteproduct is ${deleteproduct.style.visibility}`);

      let viewProductOutput = await viewProductButton(
        e,
        editproduct,
        suspendInput, 
        showing, 
        product, 
        price, 
        featured, 
        rating, 
        manufacturer, 
        shippingStatus,
        deleteproduct, 
        addingproduct, 
        edit_delete, 
        message, 
        thisEvent,
        token,
        responseAccountType);
      showing = viewProductOutput.showing;
      console.log(`the showing currently is ${showing.style.display}`)
      suspendInput = viewProductOutput.suspendInput;
      editproduct.dataset.id  = viewProductOutput.editproduct.dataset.id;
      edit_delete = viewProductOutput.edit_delete;
      responseAccountType = viewProductOutput.responseAccountType
    }
    else if (e.target === deleteproduct) {
      console.log(`trying to delete and the response account type is ${responseAccountType}`)
      if (responseAccountType == 'seller'){
        edit_delete = 'delete button pressed';
        console.log(showing.style.display)
        let addingProductOutput = await addingProductButton(
          token,
          editproduct, 
          suspendInput, 
          product, 
          price, 
          featured, 
          rating, 
          manufacturer, 
          shippingStatus, 
          thisEvent, 
          showing, 
          message, 
          edit_delete,
          responseAccountType)
        edit_delete = addingProductOutput.showing.edit_delete;
        showing = addingProductOutput.showing;
        suspendInput = addingProductOutput.suspendInput;
        // editproduct.dataset.id  = addingProductOutput.editproduct.dataset.id;
        // edit_delete = addingProductOutput.edit_delete;
      } else{
        message.textContent = 'You must have the account type SELLER to DELETE products';
        edit_delete = 'edit button pressed'
      }
    }
    else if (e.target === buyproduct) {
      console.log(`trying to buy and the response account type is ${responseAccountType}`)
      if (responseAccountType == 'buyer'){
        edit_delete = 'purchase button pressed';
        console.log(showing.style.display)
        let addingProductOutput = await addingProductButton(
          token,
          editproduct, 
          suspendInput, 
          product, 
          price, 
          featured, 
          rating, 
          manufacturer, 
          shippingStatus, 
          thisEvent, 
          showing, 
          message, 
          edit_delete,
          responseAccountType)
        edit_delete = addingProductOutput.edit_delete;
        console.log(`Edit delete after purchase rejected is ${edit_delete}`)
        showing = addingProductOutput.showing;
        suspendInput = addingProductOutput.suspendInput;
        // editproduct.dataset.id  = addingProductOutput.editproduct.dataset.id;
        // edit_delete = addingProductOutput.edit_delete;
      } else{
        message.textContent = 'You must have the account type BUYER to purchase products';
        edit_delete = 'edit button pressed'
      }
    }
  })
});
