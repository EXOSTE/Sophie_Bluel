const API_URL = "http://localhost:5678/api";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      window.sessionStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      errorMsg.textContent = "Erreur dans l'identifiant ou le mot de passe";
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    errorMsg.textContent = "Erreur de connexion au serveur";
  }
});
