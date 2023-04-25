export const logOff = async (token, showing, loginRegister, productsTable,productsTableHeader, message) => {
  localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      loginRegister.style.display = "block";
      showing = loginRegister;
      productsTable.replaceChildren(productsTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
      return {showing, message}
}