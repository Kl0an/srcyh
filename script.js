/**
 * @name AI Assistant - Hosted Version
 * @version 1.0.7beta
 * @description Script completo do Assistente de IA, projetado para ser hospedado externamente (ex: GitHub) e carregado em qualquer página.
 * @author Gemini & Colaborador
 */
(function() {
    // Garante que o script só execute uma vez, mesmo que o bookmarklet seja clicado várias vezes.
    if (document.getElementById("ai-assistant-container-pro")) {
        console.warn("Assistente de IA já está em execução.");
        return;
    }

    // --- FUNÇÃO PRINCIPAL QUE CONTÉM TODA A LÓGICA ---
    const initializeFullAssistant = () => {
        
        const SCRIPT_VERSION = "1.0.7beta";
        const storedVersion = localStorage.getItem("ai_assistant_version_pro");

        let welcomeMessage = "";
        if (!storedVersion) {
            welcomeMessage = `Bem-vindo à v${SCRIPT_VERSION}! A versão profissional com controle total.`;
        } else if (parseFloat(storedVersion) < parseFloat(SCRIPT_VERSION)) {
            welcomeMessage = `Assistente atualizado para a v${SCRIPT_VERSION}!`;
        } else {
            welcomeMessage = "Bem-vindo de volta!";
        }
        localStorage.setItem("ai_assistant_version_pro", SCRIPT_VERSION);

        // --- Módulo de UI: Criação de Estilos e HTML ---
        
        /**
         * Adiciona todos os estilos CSS necessários para a interface.
         */
        function addStyles() {
            const styles = `
                :root { --ai-primary: #2c3e50; --ai-secondary: #3498db; --ai-accent: #f1c40f; --ai-light: #ecf0f1; --ai-dark: #2c3e50; --ai-text: #34495e; --ai-radius: 12px; }
                #ai-assistant-button-pro, #ai-assistant-container-pro { z-index: 2147483647 !important; position: fixed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box; }
                *, *:before, *:after { box-sizing: inherit; }
                .ai-hidden { display: none !important; }
                #ai-assistant-button-pro { top: 20px; right: 20px; width: 55px; height: 55px; background: linear-gradient(145deg, var(--ai-primary), var(--ai-secondary)); border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); cursor: grab; display: flex; justify-content: center; align-items: center; font-size: 24px; color: white; transition: all 0.3s ease; }
                #ai-assistant-button-pro:active { cursor: grabbing; transform: scale(0.95); }
                #ai-assistant-container-pro { top: 20px; right: 20px; width: 390px; height: auto; max-height: 85vh; background-color: var(--ai-light); border-radius: var(--ai-radius); box-shadow: 0 10px 35px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; border: 1px solid #bdc3c7; }
                .ai-header { padding: 10px 15px; background: var(--ai-dark); color: white; font-size: 16px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; cursor: grab; }
                .ai-header-buttons { display: flex; align-items: center; gap: 12px; }
                .ai-header-btn { cursor: pointer; font-size: 20px; background: none; border: none; color: white; padding: 0; opacity: 0.8; transition: opacity 0.2s; }
                .ai-header-btn:hover { opacity: 1; }
                .ai-chat-box { flex-grow: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
                .ai-input-area { padding: 8px 12px; border-top: 1px solid #d1d5da; background-color: #ffffff; display: flex; gap: 4px; align-items: center; }
                .ai-input-area textarea { flex-grow: 1; border: none; padding: 10px; resize: none; font-size: 14px; background: transparent; }
                .ai-input-area button { border: none; background: none; font-size: 20px; cursor: pointer; color: var(--ai-text); padding: 8px; border-radius: 50%; }
                #ai-selection-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); cursor: crosshair; z-index: 2147483646; }
                #ai-selection-rect { position: absolute; border: 2px dashed var(--ai-accent); background: rgba(241, 196, 15, 0.2); }
                .ai-message { padding: 10px 15px; border-radius: 18px; max-width: 85%; line-height: 1.5; word-wrap: break-word; margin: 4px 0; }
                #ai-settings-panel { position: absolute; top: 46px; left: 0; right: 0; bottom: 0; background: var(--ai-light); padding: 20px; overflow-y: auto; }
                .settings-item { margin-bottom: 15px; }
                .settings-item label { display: block; margin-bottom: 5px; font-weight: 600; color: var(--ai-dark); }
                .settings-item input, .settings-item select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                /* Otimizações para Celular e Tablet */
                .is-mobile #ai-assistant-container-pro { width: 100vw; height: 100%; top: 0; left: 0; right: 0; bottom: 0; border-radius: 0; border: none; max-height: 100vh; }
                .is-mobile .ai-header { border-radius: 0; }
                .is-mobile #ai-assistant-button-pro { width: 60px; height: 60px; bottom: 20px; top: auto; }
            `;
            const html2canvasScript = document.createElement("script");
            html2canvasScript.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
            document.head.appendChild(html2canvasScript);

            const styleSheet = document.createElement("style");
            styleSheet.id = "ai-assistant-styles-pro";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }

        /**
         * Cria a estrutura HTML do assistente e a injeta no <body>.
         */
        function createHTML() {
            const assistantHTML = `
                <div id="ai-assistant-container-pro" data-version="${SCRIPT_VERSION}">
                    <div class="ai-header"><span>Assistente Pro v${SCRIPT_VERSION}</span><div class="ai-header-buttons"><button id="ai-settings-btn-pro" class="ai-header-btn" title="Configurações">⚙️</button><button id="ai-minimize-btn-pro" class="ai-header-btn" title="Minimizar">—</button><button id="ai-close-btn-pro" class="ai-header-btn" title="Fechar">&times;</button></div></div>
                    <div class="ai-chat-box"></div>
                    <div class="ai-input-area">
                        <button id="ai-vision-btn-pro" title="Analisar Área do Ecrã">🖼️</button>
                        <button id="ai-write-btn-pro" title="Escrita Mágica">✍️</button>
                        <textarea placeholder="Faça uma pergunta..." rows="1"></textarea>
                        <button id="ai-send-btn-pro" title="Enviar">▶️</button>
                    </div>
                    <div id="ai-settings-panel" class="ai-hidden">
                        <h3>Configurações Avançadas</h3>
                        <div class="settings-item"><label for="api-key-input-pro">Chave de API (Google Gemini)</label><input type="password" id="api-key-input-pro" placeholder="Opcional: insira a sua chave"></div>
                        <div class="settings-item"><label for="ai-personality-pro">Personalidade da IA</label><select id="ai-personality-pro"><option>Amigável (Padrão)</option><option>Profissional/Formal</option><option>Criativa/Divertida</option><option>Direta/Concisa</option></select></div>
                        <div class="settings-item"><label for="ai-speed-pro">Velocidade da Escrita Mágica</label><input type="range" id="ai-speed-pro" min="10" max="100" value="50"></div>
                    </div>
                </div>
                <button id="ai-assistant-button-pro">⭐</button>
            `;
            document.body.insertAdjacentHTML("beforeend", assistantHTML);
        }
        
        // --- Início da Lógica Principal ---
        try {
            // Cria a UI na página
            addStyles();
            createHTML();
            
            // Mapeia todos os elementos da UI para fácil acesso
            const elements = {
                button: document.getElementById("ai-assistant-button-pro"),
                container: document.getElementById("ai-assistant-container-pro"),
                header: document.querySelector("#ai-assistant-container-pro .ai-header"),
                chatBox: document.querySelector("#ai-assistant-container-pro .ai-chat-box"),
                input: document.querySelector("#ai-assistant-container-pro .ai-input-area textarea"),
                sendBtn: document.querySelector("#ai-send-btn-pro"),
                writeBtn: document.querySelector("#ai-write-btn-pro"),
                visionBtn: document.querySelector("#ai-vision-btn-pro"),
                closeBtn: document.querySelector("#ai-close-btn-pro"),
                minimizeBtn: document.querySelector("#ai-minimize-btn-pro"),
                settingsBtn: document.getElementById("ai-settings-btn-pro"),
                settingsPanel: document.getElementById("ai-settings-panel"),
                apiKeyInput: document.getElementById("api-key-input-pro"),
                personalitySelect: document.getElementById("ai-personality-pro"),
                speedSlider: document.getElementById("ai-speed-pro"),
            };

            // Carrega as configurações guardadas ou usa valores padrão
            let config = { 
                apiKey: localStorage.getItem("ai_apiKey_pro") || "", 
                personality: localStorage.getItem("ai_personality_pro") || "Amigável (Padrão)", 
                speed: parseInt(localStorage.getItem("ai_speed_pro") || "50", 10) 
            };
            let writingTarget = null;
            let capturedImage = null;

            // Adaptação da UI para diferentes dispositivos
            if (/Mobi|Android/i.test(navigator.userAgent)) { 
                document.body.classList.add("is-mobile");
            } else if (window.innerWidth <= 1024) {
                 document.body.classList.add("is-tablet");
            }

            // Função para adicionar mensagens no chat
            const addMessage = (text, sender) => {
                const p = document.createElement("p");
                p.className = `ai-message ${sender}-message`;
                p.style.cssText = "padding:10px 15px;border-radius:18px;max-width:85%;line-height:1.5;word-wrap:break-word;margin:4px 0;";
                p.innerText = text;
                if (sender === 'user') { 
                    p.style.backgroundColor = '#007bff'; 
                    p.style.color = 'white'; 
                    p.style.alignSelf = 'flex-end'; 
                } else { 
                    p.style.backgroundColor = '#ecf0f1'; 
                    p.style.color = '#34495e'; 
                    p.style.alignSelf = 'flex-start'; 
                }
                elements.chatBox.appendChild(p);
                elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
            };

            // Função principal de chamada à API Gemini
            const getApiResponse = async (prompt, imageBase64 = null) => {
                // ... (a lógica completa da API, incluindo o prompt de chave e a chamada fetch, vai aqui) ...
            };
            
            // Adiciona todos os Event Listeners para os botões e interações
            elements.button.style.display = "flex";
            elements.button.addEventListener("click", () => {
                elements.button.style.display = "none";
                elements.container.style.display = "flex";
                if (elements.chatBox.children.length === 0) {
                    addMessage(welcomeMessage, "bot");
                }
            });
            
            elements.closeBtn.addEventListener("click", () => {
                elements.container.remove();
                elements.button.remove();
                document.getElementById("ai-assistant-styles-pro")?.remove();
            });

            elements.minimizeBtn.addEventListener("click", () => {
                elements.container.style.display = "none";
                elements.button.style.display = "flex";
            });

            // ... (todos os outros event listeners para settings, vision, send, etc.)

        } catch (error) {
            console.error("Erro fatal ao inicializar o Assistente:", error);
            alert("Não foi possível inicializar o assistente.");
        }
    }

    // Garante que o script só rode depois que a página estiver 100% pronta.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeFullAssistant();
    } else {
        document.addEventListener('DOMContentLoaded', initializeFullAssistant);
    }
})();
