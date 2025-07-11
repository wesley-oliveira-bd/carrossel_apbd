// script.js

const arquivosOriginais = [
  "slides/buzina_ar.png",
  "slides/cinta_carga.png",
  "slides/cinta_carga_2.png",
  "slides/farol_led.png",
  "slides/oleo_68.png",
  "slides/top_turbo.png",
  "slides/vd_lanterna.mp4",
  "slides/vd_lanterna_cabeca.mp4",
  "slides/vd_faixa_led.mp4",
  "slides/vd_agua_desm.mp4",
  "slides/vd_silicone.mp4"
];

let arquivos = [...arquivosOriginais];
embaralhar(arquivos);

const tempoImagem = 5000;
const container = document.getElementById("container");
const btnIniciar = document.getElementById("btnIniciar");
const telaInicial = document.getElementById("inicio");
const musicaFundo = document.getElementById("musicaFundo");

let index = 0;
let permitirSom = false;

btnIniciar.addEventListener("click", () => {
  permitirSom = true;
  telaInicial.style.display = "none";

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((e) => {
      console.log("Erro ao entrar em tela cheia:", e);
    });
  }

  mostrarProximo();
  tocarProximaMusica();
});

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function mostrarProximo() {
  const arquivo = arquivos[index];
  const ext = arquivo.split('.').pop().toLowerCase();

  let elemento;

  if (['mp4', 'webm', 'ogg'].includes(ext)) {
    elemento = document.createElement('video');
    elemento.src = arquivo;
    elemento.autoplay = true;
    elemento.muted = !permitirSom;
    elemento.controls = false;
    elemento.playsInline = true;

    elemento.onloadedmetadata = () => {
      if (!musicaFundo.paused) {
        musicaFundo.pause();
      }
      ajustarProporcao(elemento.videoWidth, elemento.videoHeight, elemento);
      fadeIn(elemento);
    };

    elemento.onended = () => {
      tocarProximaMusica();
      fadeOut(elemento, proximo);
    };

  } else {
    elemento = document.createElement('img');
    elemento.src = arquivo;

    elemento.onload = () => {
      ajustarProporcao(elemento.naturalWidth, elemento.naturalHeight, elemento);
      fadeIn(elemento);
      setTimeout(() => fadeOut(elemento, proximo), tempoImagem + 1000);
    };
  }

  container.innerHTML = "";
  container.appendChild(elemento);
}

function proximo() {
  index++;
  if (index >= arquivos.length) {
    const ultimoSlide = arquivos[arquivos.length - 1];
    do {
      arquivos = [...arquivosOriginais];
      embaralhar(arquivos);
    } while (arquivos[0] === ultimoSlide);

    index = 0;
  }

  mostrarProximo();
}

function fadeIn(el) {
  setTimeout(() => el.classList.add("mostrar"), 50);
}

function fadeOut(el, callback) {
  el.classList.remove("mostrar");
  setTimeout(callback, 1000);
}

function ajustarProporcao(largura, altura, el) {
  el.style.objectFit = "contain"; // Garantido via CSS também
}

window.addEventListener("resize", () => {
  const el = container.firstChild;
  if (!el) return;
  if (el.tagName === "IMG") {
    ajustarProporcao(el.naturalWidth, el.naturalHeight, el);
  } else if (el.tagName === "VIDEO") {
    ajustarProporcao(el.videoWidth, el.videoHeight, el);
  }
});

// 🎵 Playlist musical
const playlistOriginal = [
  "musicas/mus01.mp3",
  "musicas/mus02.mp3",
  "musicas/mus04.mp3",
  "musicas/mus05.mp3",
  "musicas/mus06.mp3",
  "musicas/mus07.mp3",
  "musicas/mus08.mp3",
  "musicas/mus03.mp3"
];
let playlist = [...playlistOriginal];
embaralhar(playlist);

let musicaAtualIndex = 0;

function tocarProximaMusica() {
  if (playlist.length === 0) {
    playlist = [...playlistOriginal];
    embaralhar(playlist);
    musicaAtualIndex = 0;
  }

  const musicaAtual = playlist[musicaAtualIndex];
  musicaFundo.src = musicaAtual;
  musicaFundo.play().catch(e => console.log("Erro ao tocar música:", e));
  musicaAtualIndex++;
}

musicaFundo.addEventListener("ended", () => {
  tocarProximaMusica();
});
