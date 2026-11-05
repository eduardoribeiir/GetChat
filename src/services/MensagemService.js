import { MensagemRepository } from '../repositories/MensagemRepository';

export class MensagemService {
  constructor(repository) {
    this.repository = repository;
  }

  getMensagens(contatoId) {
    return [...this.repository.getMensagens(contatoId)];
  }

  apagarMensagens(ids) {
    this.repository.removerMensagens(ids);
  }

  limparConversa(contatoId) {
    this.repository.removerPorContato(contatoId);
  }

  enviarMensagem(contatoId, texto) {
    const limpo = typeof texto === 'string' ? texto.trim() : '';
    if (!limpo) return null;

    const mensagem = {
      id: this.repository.proximoId(),
      contatoId,
      texto: limpo,
      recebida: false,
    };
    this.repository.adicionarMensagem(mensagem);
    return mensagem;
  }
}

// Instância única compartilhada entre as telas
export const mensagemService = new MensagemService(new MensagemRepository());
