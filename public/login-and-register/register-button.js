export const registerButtonActive = async (
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
  thisEvent) =>{

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
          userName: name.value,
          email: email1.value,
          password: password1.value,
          accountType: accountType.value,
          gender: gender.value,
          birthDate: birthDate.value,
          address: address.value,
          zipCode: zipCode.value,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        message.textContent = data.msg;
        token = data.token;
        responseAccountType = data.accountType;
        localStorage.setItem("token", token);
        localStorage.setItem('responseAccountType', responseAccountType)
        showing.style.display = "none";
        thisEvent = new Event("startDisplay");
        document.dispatchEvent(thisEvent);
        name.value = "";
        email1.value = "";
        password1.value = "";
        password2.value = "";
        gender.value = "";
        birthDate.value= "";
        address.value= "";
        zipCode= "";
      } else {
        message.textContent = data.msg;
      }
    } catch (err) {
      message.textContent = "A communications error occurred.";
    }
    suspendInput = false;
    return suspendInput
  }
}