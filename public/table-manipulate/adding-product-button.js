export const addingProductButton = async(
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
  responseAccountType) => {
  
  if (!editproduct.dataset.id) {
    // this is an attempted add
    if (responseAccountType == 'seller'){
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/products/${responseAccountType}`, {
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
            shipping_status: 'On Sale'
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
          shippingStatus.value ='';
        } else {
          // failure
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communication error occurred.";
      }
    } else{
      message.textContent = 'You must have the account type SELLER to ADD products'
    }
    
    suspendInput = false;
  } else if(edit_delete === 'edit button pressed') {
    // this is an update
    suspendInput = true;
    try {
      const productID = editproduct.dataset.id;
      const response = await fetch(`/api/v1/products/${responseAccountType}/${productID}`, {
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
        shippingStatus.value ="Ordered";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      } else {
        message.textContent = data.msg;
      }
    } catch (err) {
      message.textContent = "A communication error occurred.";
    }
  }
  else if(edit_delete === 'purchase button pressed') {
    // this is an update
    suspendInput = true;
    try {
      const productID = editproduct.dataset.id;
      const response = await fetch(`/api/v1/products/buy/${productID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          purchased: true,
          shipping_status: 'Ordered'
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
        shippingStatus.value ="Ordered";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
      } else {
        edit_delete ='edit button pressed'
        message.textContent = data.msg;
      }
    } catch (err) {
      message.textContent = "A communication error occurred.";
    }
  }
  else if(edit_delete === 'delete button pressed') {
    // this is a delete
    if (responseAccountType === 'seller'){
      suspendInput = true;
      try {
        const productID = editproduct.dataset.id;
        const response = await fetch(`/api/v1/products/${responseAccountType}/${productID}`, {
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
    } else{
      message.textContent = "You must have the account type SELLER to DELETE products";
    }
  }
  suspendInput = false;
return {showing ,message, suspendInput,responseAccountType, edit_delete}
}