export const buildProductsTable = async (productsTable, productsTableHeader, token, message, myproducts,getRoute) => {
  if(myproducts){
    getRoute = '/api/v1/products/myproducts';
  } else{
    getRoute ='/api/v1/products';
  }
  try {
    const response = await fetch(`
    ${getRoute}`, {
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
          let viewButton = `<td><button type="button" class="viewButton" data-id=${data.products[i]._id}>view</button></td>`;
          let rowHTML = 
          `<td>${data.products[i].name}</td>
          <td style="text-align:center;">${data.products[i].price}</td>
          <td style="text-align:center;">${data.products[i].featured}</td>
          <td style="text-align:center;">${data.products[i].rating}</td>
          <td>${data.products[i].createdAt}</td>
          <td style="text-align:center;">${data.products[i].manufacturer}</td>
          <td style="text-align:center;">${data.products[i].shipping_status}</td>
          <td>${data.products[i].seller_name}</td>
          <td style="text-align:center;">${data.products[i].purchased}</td>
          </td>${viewButton}`;
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
