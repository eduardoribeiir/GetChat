export class MensagemRepository {
  constructor() {
    this.mensagens = [
      { id: 1, contatoId: 1, texto: 'Oi! Tudo bem?', recebida: true },
      { id: 2, contatoId: 1, texto: 'Tudo sim! E você?', recebida: false },
      { id: 3, contatoId: 1, texto: 'Estou bem também. Como está seu dia?', recebida: true },
      { id: 4, contatoId: 1, texto: 'Bem produtivo! Vamos conversar mais tarde?', recebida: false },
      { id: 5, contatoId: 1, texto: 'Combinado!', recebida: true },
      { id: 6, contatoId: 2, texto: 'Até amanhã!', recebida: true },
      { id: 7, contatoId: 3, texto: 'Obrigado pela ajuda!', recebida: true },
      { id: 8, contatoId: 4, texto: 'Vamos conversar?', recebida: true },
    ];
  }

  getMensagens(contatoId) {
    return this.mensagens.filter((m) => m.contatoId === contatoId);
  }

  adicionarMensagem(mensagem) {
    this.mensagens.push(mensagem);
  }

  removerMensagens(ids) {
    this.mensagens = this.mensagens.filter((m) => !ids.includes(m.id));
  }

  removerPorContato(contatoId) {
    this.mensagens = this.mensagens.filter((m) => m.contatoId !== contatoId);
  }

  proximoId() {
    return this.mensagens.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  }
}
