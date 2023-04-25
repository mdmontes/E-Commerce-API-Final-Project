export const loginButtonActive = async (
  message,
  token,
  responseAccountType,
  showing,
  email,
  password,
  suspendInput,
  thisEvent) =>{
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
      responseAccountType = data.accountType;
      localStorage.setItem("token", token);
      localStorage.setItem("responseAccountType", responseAccountType);
      showing.style.display = "none";
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
  return suspendInput
}