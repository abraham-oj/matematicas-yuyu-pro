# ✨ Matemágicas con Yuyu (Mathemagics with Yuyu)

[![Estado](https://img.shields.io/badge/Estado-Vivo-success)](https://ayudante-matematicas-yuliana.netlify.app/)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-JAMstack-8A2BE2)](https://netlify.com)

> **Demo en vivo / Live Demo:** [ayudante-matematicas-yuliana.netlify.app](https://ayudante-matematicas-yuliana.netlify.app/)

---

## 🇪🇸 Español

### ❤️ La Motivación

Este proyecto nació del corazón. No es solo una calculadora; es una herramienta creada por un padre (Abraham) para su hija (Yuyu), con el objetivo de transformar las matemáticas de "algo difícil" a "algo mágico".

La idea es simple: usar el poder de la Inteligencia Artificial para explicar problemas matemáticos con paciencia, emojis y un lenguaje que un niño pueda entender y disfrutar.

### 🚀 ¿Cómo funciona?

Es una **Web App Progresiva (PWA)** que utiliza una arquitectura **Serverless** para mantener la seguridad y la gratuidad.

1.  **Frontend:** HTML/CSS/JS puro (sin frameworks pesados) para una interfaz rápida y animada.
2.  **Backend:** Netlify Functions (Node.js) que actúa como intermediario seguro.
3.  **IA:** Se conecta a la API de **Hugging Face** (modelo `Mistral-7B-Instruct`) para generar las explicaciones pedagógicas.

### 🛠️ Replicar el Proyecto (Localmente)

Si quieres crear tu propia versión para tu hijo/a o estudiante:

1.  **Clona el repositorio:**

    ```bash
    git clone [https://github.com/tu-usuario/matematicas-yuyu.git](https://github.com/tu-usuario/matematicas-yuyu.git)
    cd matematicas-yuyu
    ```

2.  **Consigue tu Token de IA:**

    - Crea una cuenta gratuita en [Hugging Face](https://huggingface.co/).
    - Ve a Settings > Access Tokens y crea uno nuevo (tipo 'Read').

3.  **Configura el entorno local:**

    - Instala Netlify CLI: `npm install -g netlify-cli`
    - Crea un archivo `.env` en la raíz:
      ```env
      HF_TOKEN=hf_tu_token_aqui
      ```

4.  **¡Lanza la magia!**
    ```bash
    netlify dev
    ```
    La app correrá en `http://localhost:8888`.

---

## 🇺🇸 English

### ❤️ The Motivation

This project was born from the heart. It is not just a calculator; it is a tool created by a father (Abraham) for his daughter (Yuyu), aiming to transform mathematics from "something hard" into "something magical".

The concept is simple: use the power of Artificial Intelligence to explain math problems with patience, emojis, and language that a child can understand and enjoy.

### 🚀 How it works

It's a **Progressive Web App (PWA)** using a **Serverless** architecture to ensure security and keep it free forever.

1.  **Frontend:** Pure HTML/CSS/JS (no heavy frameworks) for a snappy, animated interface.
2.  **Backend:** Netlify Functions (Node.js) acting as a secure middleman.
3.  **AI:** Connects to the **Hugging Face API** (`Mistral-7B-Instruct` model) to generate pedagogical explanations.

### 🛠️ How to Replicate (Locally)

If you want to create your own version for your kid or student:

1.  **Clone the repo:**

    ```bash
    git clone [https://github.com/your-username/matematicas-yuyu.git](https://github.com/your-username/matematicas-yuyu.git)
    cd matematicas-yuyu
    ```

2.  **Get your AI Token:**

    - Create a free account at [Hugging Face](https://huggingface.co/).
    - Go to Settings > Access Tokens and create a new one (type 'Read').

3.  **Setup local environment:**

    - Install Netlify CLI: `npm install -g netlify-cli`
    - Create a `.env` file in the root folder:
      ```env
      HF_TOKEN=hf_your_token_here
      ```

4.  **Cast the spell!**
    ```bash
    netlify dev
    ```
    The app will run at `http://localhost:8888`.

---

### ☁️ Despliegue / Deployment

1.  Push your code to **GitHub**.
2.  Log in to **Netlify** and choose "Import from GitHub".
3.  **Crucial Step:** In Netlify Site Settings > Environment Variables, add a new variable:
    - Key: `HF_TOKEN`
    - Value: `Your Hugging Face Token`
4.  Deploy! 🚀

---

### 👤 Autor / Author

**Abraham Ojeda** _Hecho con ❤️ desde Fedora Linux._

License: **MIT**
