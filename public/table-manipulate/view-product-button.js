export const viewProductButton =async ( 
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
  responseAccountType) => {
  
  product.disabled = false;
  price.disabled = false;
  featured.disabled = false;
  rating.disabled = false;
  manufacturer.disabled = false
  shippingStatus.disabled = false;
  
  console.log(showing.style.display)
  console.log(responseAccountType)
  editproduct.dataset.id = e.target.dataset.id
  try {
    const response = await fetch(`/api/v1/products/${responseAccountType}/${e.target.dataset.id}`, {
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
      if ( responseAccountType === 'seller'){
        rating.disabled = true;
        shippingStatus.disabled = true;
        }
      else if ( responseAccountType === 'shipper'){
      product.disabled = true;
      price.disabled = true;
      featured.disabled = true;
      rating.disabled = true;
      manufacturer.disabled = true;
      }
      else if ( responseAccountType === 'buyer'){
        product.disabled = true;
        price.disabled = true;
        featured.disabled = true;
        manufacturer.disabled = true;
        shippingStatus.disabled = true;
        }
      showing.style.display = "none";
      showing = editproduct;
      showing.style.display = "block";
      addingproduct.textContent = "update";
      // updateproduct.style.display ="block";
      // deleteproduct.style.display ="block";
      edit_delete = 'edit button pressed';
      message.textContent = "";
    } else {
      // might happen if the list has been updated since last display
      message.textContent = data.msg;
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    }
  } catch (err) {
    message.textContent = "A communications error has occurred.";
  }
  suspendInput = false
  return {suspendInput, showing, editproduct, edit_delete,responseAccountType}
}