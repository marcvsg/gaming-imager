import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUser = async () => {
    if (!username.trim()) {
      setError("Por favor, digite um nome de usuário");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Buscando usuário:", username);
      const response = await fetch(
        `https://origins.habbo.com.br/api/public/users?name=${encodeURIComponent(
          username
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Origin: "https://habbo.com.br",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (!data || !data.name) {
        setError("Usuário não encontrado");
        setUserData(null);
      } else {
        setUserData(data);
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setError(`Erro ao buscar usuário: ${err.message}`);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchUser();
    }
  };

  return (
    <div className="app">
      <div className="LogoHabbo"></div>
      <header className="header">
<img className="balao" src="/public/img/origins.png" />      </header>
      <main className="main-content">
        <section className="hero">
          <div className="search-container">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Seu usuário"
              className="search-input"
            />
            <button
              className="cta-button"
              onClick={searchUser}
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          {userData && (
            <div className="user-card">
              <img
                src={`https://habbo.com.br/habbo-imaging/avatarimage?figure=${userData.figureString}&size=l&direction=4&head_direction=3&gesture=sml&action=wav`}
                alt={`Avatar de ${userData.name}`}
                className="user-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://habbo.com.br/habbo-imaging/avatarimage?figure=${userData.figureString}&size=g`;
                }}
              />
              <h2>{userData.name} 🇧🇷</h2>
              <b>Missão: {userData.motto || "Sem motto"}</b>
              <br></br>
              <b>
                Último acesso:{" "}
                {new Date(userData.lastAccessTime).toLocaleDateString()}
              </b>
            </div>
          )}
        </section>
      </main>
      <footer className="footer">
        <p>Esta é uma ferramenta desenvolvida por Jaguar.</p>
      </footer>
    </div>
  );
}

export default App;
