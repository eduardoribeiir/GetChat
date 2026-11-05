# GetChat 💬

Aplicativo simples de mensagens, inspirado no WhatsApp, desenvolvido com **React Native** e **Expo**. O foco do trabalho é a **navegação entre telas**, a **passagem de parâmetros**, os **componentes reutilizáveis** e a **organização em camadas** (Service e Repository).

## 📚 Sobre o trabalho

| | |
|---|---|
| **Atividade** | Desenvolvendo um APP de mensagens – Navegação e Organização em Camadas |
| **Professor** | Msc. Nator Junior Carvalho da Costa |
| **Aluno** | Luiz Eduardo Paiva Ribeiro |
| **Curso** | Engenharia de Software – Universidade Federal do Ceará (UFC) |
| **Disciplina** | Desenvolvimento de Software para Dispositivos Moveis |

## 🎯 Objetivo

Desenvolver um aplicativo de mensagens em que o usuário escolhe um contato fictício, abre a conversa, envia mensagens e volta à lista, praticando:

- navegação com **React Navigation** (Stack Navigator);
- passagem de parâmetros com `navigation.navigate()` e `route.params`;
- componente reutilizável (`Mensagem`);
- separação em camadas: **Interface → Service → Repository**.

## ✅ Requisitos atendidos

### HomeScreen
- Lista de **4 contatos fictícios**, cada um com `id` e `nome`.
- Ao tocar em um contato, navega para a `ChatScreen` enviando `contatoId` e `contatoNome` em `route.params`.

### ChatScreen
- Exibe o nome do contato recebido por parâmetro.
- Exibe **somente** as mensagens do contato selecionado.
- Mensagens enviadas à **direita** e recebidas à **esquerda**.
- Campo de texto e botão de envio; após enviar, a mensagem aparece e o campo é **limpo**.
- **Mensagens vazias não são enviadas** (o botão fica desabilitado e o Service também valida).
- As mensagens exibidas são atualizadas com `useState`.

### Componente `Mensagem`
Recebe as props `mensagem` (texto) e `recebida` (booleano), que definem alinhamento e estilo.

### Camadas
- **`MensagemRepository`**: armazena as mensagens em um array de objetos (`id`, `contatoId`, `texto`, `recebida`) em memória. Métodos obrigatórios: `getMensagens(contatoId)` e `adicionarMensagem(mensagem)`.
- **`MensagemService`**: regras de negócio e comunicação com o Repository. Métodos obrigatórios: `getMensagens(contatoId)` e `enviarMensagem(contatoId, texto)` (valida, cria e solicita o armazenamento).
- A interface **nunca acessa o Repository diretamente**; usa uma **única instância do Service** compartilhada entre as telas.

```
Screens / Components  ──►  MensagemService  ──►  MensagemRepository
```

### Observações
- Sem MQTT, API ou banco de dados: os dados ficam **em memória** e não persistem ao reiniciar o app.

## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (SDK 58)
- [React Navigation](https://reactnavigation.org/) (`@react-navigation/native` e `native-stack`)
- `expo-linear-gradient`, `@expo/vector-icons`, `react-native-safe-area-context`, `react-native-screens`
- JavaScript

## 📁 Estrutura do projeto

```
GetChat/
├── App.js                       # Stack Navigator (Home → Chat)
├── index.js
├── app.json
├── assets/                      # Ícones e logo
└── src/
    ├── screens/
    │   ├── HomeScreen.js
    │   └── ChatScreen.js
    ├── components/
    │   ├── Mensagem.js          # Componente reutilizável exigido
    │   ├── ActionSheet.js       # Menu de opções (extra)
    │   ├── Avatar.js
    │   └── Header.js
    ├── services/
    │   └── MensagemService.js   # Regras de negócio + instância única
    ├── repositories/
    │   └── MensagemRepository.js
    ├── data/
    │   └── contatos.js          # Contatos fictícios
    └── theme.js
```

## 🚀 Como executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS)
- Celular com o app **Expo Go** instalado ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Celular e computador na **mesma rede Wi‑Fi**

### Passo a passo

1. Clone o repositório e entre na pasta:
   ```bash
   git clone <url-do-repositorio>
   cd GetChat
   ```
2. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```
4. Um **QR code** aparecerá no terminal.

## 📱 Testando no Expo Go

1. Abra o **Expo Go** no celular.
   - **Android:** toque em *Scan QR code* e escaneie o QR code do terminal.
   - **iPhone:** abra a câmera do aparelho e escaneie o QR code.
2. Aguarde o carregamento do app.
3. **Teste a navegação:** toque em um contato na Home e use a seta para voltar.
4. **Teste o envio:** digite uma mensagem e envie; ela aparece à direita e o campo é limpo. Tente enviar vazio: nada acontece.
5. **Teste o isolamento:** abra outro contato e confira que só aparecem as mensagens dele.

**Problemas de conexão?**
- Use `npx expo start --tunnel` (funciona mesmo com firewall ou redes diferentes).
- Libere o Node.js no Firewall do Windows (rede privada).
- Se o Expo Go indicar versão incompatível, atualize o app Expo Go.

Também é possível testar no navegador com `npx expo start --web`.

## 👤 Autor

**Luiz Eduardo Paiva Ribeiro**
Estudante de Engenharia de Software – Universidade Federal do Ceará (UFC)
