import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import ActionSheet from '../components/ActionSheet';
import { contatos } from '../data/contatos';
import { mensagemService } from '../services/MensagemService';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const [, setAtualiza] = useState(0);

  // Recarrega a lista ao voltar do chat para refletir as novas mensagens
  useFocusEffect(useCallback(() => setAtualiza((n) => n + 1), []));

  const [menuContato, setMenuContato] = useState(null);

  const abrirChat = (contato) =>
    navigation.navigate('Chat', { contatoId: contato.id, contatoNome: contato.nome });

  const alternarBloqueio = (contato) => {
    contato.bloqueado = !contato.bloqueado;
    setAtualiza((n) => n + 1);
  };

  const excluirConversa = (contato) => {
    mensagemService.limparConversa(contato.id);
    contato.naoLidas = 0;
    setAtualiza((n) => n + 1);
  };

  const ultima = (id) => {
    const lista = mensagemService.getMensagens(id);
    return lista.length ? lista[lista.length - 1] : null;
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.search}>
        <Ionicons name="search" size={20} color={colors.primaryLight} />
        <TextInput placeholder="Pesquisar conversas..." placeholderTextColor={colors.muted} style={styles.input} />
      </View>
      <Text style={styles.title}>Mensagens</Text>
      <Text style={styles.subtitle}>Suas conversas em um só lugar</Text>
      <FlatList
        data={contatos}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => {
          const msg = ultima(item.id);
          return (
          <TouchableOpacity
            style={styles.item}
            onPress={() => abrirChat(item)}
            onLongPress={() => setMenuContato(item)}
            delayLongPress={300}
            activeOpacity={0.7}
          >
            <View>
              <Avatar nome={item.nome} cor={item.cor} />
              {item.online && !item.bloqueado && <View style={styles.online} />}
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <View style={styles.previewRow}>
                {item.bloqueado ? (
                  <>
                    <Ionicons name="ban-outline" size={14} color={colors.danger} />
                    <Text style={[styles.preview, { color: colors.danger }]}>Bloqueado</Text>
                  </>
                ) : (
                  <>
                    {msg && !msg.recebida && (
                      <Ionicons
                        name={item.online ? 'checkmark-done' : 'checkmark'}
                        size={16}
                        color={item.online ? colors.primaryLight : colors.muted}
                      />
                    )}
                    <Text style={styles.preview} numberOfLines={1}>
                      {msg ? (msg.recebida ? msg.texto : `Você: ${msg.texto}`) : 'Sem mensagens'}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <Text style={styles.hora}>{item.hora}</Text>
              {item.naoLidas > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.naoLidas}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          );
        }}
      />
      <ActionSheet
        visivel={!!menuContato}
        titulo={menuContato?.nome}
        onFechar={() => setMenuContato(null)}
        opcoes={
          menuContato
            ? [
                {
                  label: 'Excluir conversa',
                  icon: 'trash-outline',
                  destrutivo: true,
                  onPress: () => excluirConversa(menuContato),
                },
                {
                  label: menuContato.bloqueado ? 'Desbloquear contato' : 'Bloquear contato',
                  icon: 'ban-outline',
                  onPress: () => alternarBloqueio(menuContato),
                },
              ]
            : []
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.accent,
    marginHorizontal: 20, marginTop: 16, paddingHorizontal: 16, height: 46, borderRadius: 16,
  },
  input: { flex: 1, color: colors.text, outlineStyle: 'none' },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 22, marginHorizontal: 20 },
  subtitle: { color: colors.muted, marginHorizontal: 20, marginBottom: 12, marginTop: 2 },
  item: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#d8ebe9',
  },
  online: {
    position: 'absolute', right: 0, bottom: 0, width: 13, height: 13, borderRadius: 7,
    backgroundColor: colors.online, borderWidth: 2, borderColor: '#fff',
  },
  nome: { fontSize: 16, fontWeight: '700', color: colors.text },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  preview: { color: colors.muted, flexShrink: 1 },
  hora: { color: colors.muted, fontSize: 12 },
  badge: {
    minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
