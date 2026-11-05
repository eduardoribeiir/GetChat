import { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Mensagem from '../components/Mensagem';
import Avatar from '../components/Avatar';
import ActionSheet from '../components/ActionSheet';
import { contatos } from '../data/contatos';
import { mensagemService } from '../services/MensagemService';
import { colors } from '../theme';

export default function ChatScreen({ route, navigation }) {
  const { contatoId, contatoNome } = route.params;
  const insets = useSafeAreaInsets();
  const contato = contatos.find((c) => c.id === contatoId);
  const [mensagens, setMensagens] = useState(() => mensagemService.getMensagens(contatoId));
  const [texto, setTexto] = useState('');
  const [bloqueado, setBloqueado] = useState(!!contato?.bloqueado);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState('');
  const [selecionadas, setSelecionadas] = useState([]);
  const [menu, setMenu] = useState(false);
  const [menuMsg, setMenuMsg] = useState(null);
  const [confirmaLimpar, setConfirmaLimpar] = useState(false);
  const [encaminhando, setEncaminhando] = useState(null); // lista de textos a encaminhar
  const listRef = useRef(null);

  const emSelecao = selecionadas.length > 0;
  const atualizar = () => setMensagens(mensagemService.getMensagens(contatoId));

  // Abrir a conversa marca as mensagens como lidas
  useEffect(() => {
    if (contato) contato.naoLidas = 0;
  }, [contato]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [mensagens]);

  const enviar = () => {
    if (bloqueado || !texto.trim()) return;
    mensagemService.enviarMensagem(contatoId, texto);
    atualizar();
    setTexto('');
  };

  const alternarSelecao = (id) =>
    setSelecionadas((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const apagar = (ids) => {
    mensagemService.apagarMensagens(ids);
    setSelecionadas([]);
    atualizar();
  };

  const alternarBloqueio = () => {
    contato.bloqueado = !contato.bloqueado;
    setBloqueado(contato.bloqueado);
  };

  const encaminharPara = (destino) => {
    const textos = mensagens.filter((m) => encaminhando.includes(m.id)).map((m) => m.texto);
    textos.forEach((t) => mensagemService.enviarMensagem(destino.id, t));
    setEncaminhando(null);
    setSelecionadas([]);
    atualizar();
  };

  const filtradas = busca.trim()
    ? mensagens.filter((m) => m.texto.toLowerCase().includes(busca.trim().toLowerCase()))
    : mensagens;

  const vazio = !texto.trim();

  const renderHeader = () => {
    if (emSelecao) {
      return (
        <>
          <TouchableOpacity onPress={() => setSelecionadas([])} hitSlop={10}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.nome, { flex: 1 }]}>{selecionadas.length} selecionada(s)</Text>
          <TouchableOpacity onPress={() => setEncaminhando(selecionadas)} hitSlop={10}>
            <Ionicons name="arrow-redo-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => apagar(selecionadas)} hitSlop={10}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </>
      );
    }
    if (buscando) {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              setBuscando(false);
              setBusca('');
            }}
            hitSlop={10}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TextInput
            autoFocus
            value={busca}
            onChangeText={setBusca}
            placeholder="Pesquisar na conversa..."
            placeholderTextColor="#cfeeee"
            style={styles.buscaInput}
          />
        </>
      );
    }
    return (
      <>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Avatar nome={contatoNome} size={46} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{contatoNome}</Text>
          <Text style={styles.status}>
            {bloqueado
              ? 'Bloqueado'
              : contato?.online
              ? '● Online'
              : contato?.ultimoVisto
              ? `Visto por último ${contato.ultimoVisto}`
              : 'Offline'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setMenu(true)} hitSlop={10}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        {renderHeader()}
      </LinearGradient>

      <FlatList
        ref={listRef}
        data={filtradas}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListHeaderComponent={
          <View style={styles.hojeWrap}>
            <Text style={styles.hoje}>Hoje</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.vazioTexto}>{busca.trim() ? 'Nenhuma mensagem encontrada' : 'Sem mensagens'}</Text>
        }
        renderItem={({ item }) => {
          const marcada = selecionadas.includes(item.id);
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              delayLongPress={300}
              onLongPress={() => (emSelecao ? alternarSelecao(item.id) : setMenuMsg(item))}
              onPress={() => emSelecao && alternarSelecao(item.id)}
              style={marcada && styles.marcada}
            >
              <Mensagem mensagem={item.texto} recebida={item.recebida} />
            </TouchableOpacity>
          );
        }}
      />

      {bloqueado ? (
        <View style={[styles.bloqueadoBar, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={styles.bloqueadoTexto}>Você bloqueou este contato.</Text>
          <TouchableOpacity onPress={alternarBloqueio}>
            <Text style={styles.desbloquear}>Desbloquear</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.inputWrap}>
            <TextInput
              value={texto}
              onChangeText={setTexto}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={colors.muted}
              style={styles.input}
              onSubmitEditing={enviar}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity
            onPress={enviar}
            disabled={vazio}
            style={[styles.send, { backgroundColor: vazio ? '#c5d6d6' : colors.primaryLight }]}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <ActionSheet
        visivel={menu}
        onFechar={() => setMenu(false)}
        opcoes={[
          { label: 'Pesquisar', icon: 'search-outline', onPress: () => setBuscando(true) },
          { label: 'Limpar conversa', icon: 'trash-outline', destrutivo: true, onPress: () => setConfirmaLimpar(true) },
          {
            label: bloqueado ? 'Desbloquear contato' : 'Bloquear contato',
            icon: 'ban-outline',
            onPress: alternarBloqueio,
          },
        ]}
      />

      <ActionSheet
        visivel={!!menuMsg}
        onFechar={() => setMenuMsg(null)}
        opcoes={
          menuMsg
            ? [
                { label: 'Selecionar mensagens', icon: 'checkbox-outline', onPress: () => setSelecionadas([menuMsg.id]) },
                { label: 'Encaminhar', icon: 'arrow-redo-outline', onPress: () => setEncaminhando([menuMsg.id]) },
                { label: 'Apagar mensagem', icon: 'trash-outline', destrutivo: true, onPress: () => apagar([menuMsg.id]) },
              ]
            : []
        }
      />

      <ActionSheet
        visivel={confirmaLimpar}
        titulo="Limpar todas as mensagens desta conversa?"
        onFechar={() => setConfirmaLimpar(false)}
        opcoes={[
          {
            label: 'Limpar conversa',
            icon: 'trash-outline',
            destrutivo: true,
            onPress: () => {
              mensagemService.limparConversa(contatoId);
              atualizar();
            },
          },
          { label: 'Cancelar', icon: 'close-outline' },
        ]}
      />

      <Modal visible={!!encaminhando} transparent animationType="fade" onRequestClose={() => setEncaminhando(null)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitulo}>Encaminhar para</Text>
            {contatos
              .filter((c) => c.id !== contatoId && !c.bloqueado)
              .map((c) => (
                <TouchableOpacity key={c.id} style={styles.destino} onPress={() => encaminharPara(c)}>
                  <Avatar nome={c.nome} cor={c.cor} size={40} />
                  <Text style={styles.destinoNome}>{c.nome}</Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity style={styles.cancelar} onPress={() => setEncaminhando(null)}>
              <Text style={styles.cancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 18,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, minHeight: 90,
  },
  nome: { color: '#fff', fontSize: 18, fontWeight: '800' },
  status: { color: '#d6fff0', fontSize: 12, marginTop: 2 },
  buscaInput: { flex: 1, color: '#fff', fontSize: 16, outlineStyle: 'none' },
  hojeWrap: { alignItems: 'center', marginBottom: 8 },
  hoje: {
    backgroundColor: colors.accent, color: colors.primary, paddingHorizontal: 14, paddingVertical: 4,
    borderRadius: 12, fontSize: 12, overflow: 'hidden',
  },
  vazioTexto: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  marcada: { backgroundColor: 'rgba(42,157,159,0.25)' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: '#fff',
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg,
    borderRadius: 24, borderWidth: 1, borderColor: '#d8ebe9', paddingHorizontal: 16, height: 48,
  },
  input: { flex: 1, color: colors.text, outlineStyle: 'none' },
  send: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  bloqueadoBar: {
    alignItems: 'center', gap: 6, paddingTop: 14, backgroundColor: '#fff',
  },
  bloqueadoTexto: { color: colors.muted },
  desbloquear: { color: colors.primaryLight, fontWeight: '700', fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 28 },
  sheetTitulo: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8, marginHorizontal: 8 },
  destino: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, paddingHorizontal: 8 },
  destinoNome: { fontSize: 16, color: colors.text },
  cancelar: { alignItems: 'center', paddingVertical: 14 },
  cancelarTexto: { color: colors.muted, fontSize: 16 },
});
