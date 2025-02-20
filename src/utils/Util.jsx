/**
 * Recebe uma string no formato "dd/MM/yyyy"
 * ou seja dia, mês e ano separado por barra (/)
 * e retorna uma data no formato Date
 * @param {string} dataFormatar
 * @returns {Date} dataDate
 */
export default function formataData(dataFormatar) {
  const data = new Date(`${dataFormatar} 00:00:0000`);
  let dia = data.getDate();
  let mes = data.getMonth() + 1;
  let ano = data.getFullYear();

  if (dia < 10) {
    dia = `0${dia}`;
  }

  if (mes < 10) {
    mes = `0${mes}`;
  }

  const dataFormatada = dia + "/" + mes + "/" + ano;
  return dataFormatada;
}

export function horaAtual() {
  const hoje = new Date();
  const horas = String(hoje.getHours()).padStart(2, "0");
  const minutos = String(hoje.getMinutes()).padStart(2, "0");
  const segundos = String(hoje.getSeconds()).padStart(2, "0");
  return `${horas}:${minutos}:${segundos}`;
}

export function dataAtual() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function dataHoraAtual() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  const horas = hoje.getHours();
  const minutos = hoje.getMinutes();
  const segundos = hoje.getSeconds();
  return `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
}

export function gerarNumeroAleatorio(qtdDigitos) {
  const min = 10 ** (qtdDigitos - 1);
  const max = 10 ** qtdDigitos - 1;
  const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(numeroAleatorio);
}

/**
 * Verifica se a lista está
 * null, undefined ou com tamanho zero
 * @param {Array} lista
 * @returns boolean
 */
export function verificaLista(lista) {
  return lista === null || lista === undefined || lista.length === 0;
}

export function separarLinkEUsuario(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  const partes = url.split("/");
  const pUsuario = partes.pop();
  const pLink = partes.join("/") + "/";

  return { pUsuario, pLink };
}

export function obterParteAntesDoArroba(email) {
  // Verifica se o email é válido
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "";
  }

  // Divide o email em duas partes usando o "@" como separador
  const partes = email.split("@");

  // Retorna a primeira parte (antes do "@")
  return partes.shift();
}

export function obterSomenteNumeros(celularFormatado) {
  return celularFormatado.replace(/\D/g, "");
}
