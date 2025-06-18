# srcyh

javascript:(async function(){try{const t="https://raw.githubusercontent.com/Kl0an/srcyh/refs/heads/main/script.js?t="+new Date().getTime();const e=await fetch(t);if(!e.ok)throw new Error("Falha de Rede: "+e.status);const n=await e.text();eval(n)}catch(t){alert("Falha CRÍTICA ao carregar o Assistente."),console.error(t)}})();
