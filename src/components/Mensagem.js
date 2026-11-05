import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

export default function Mensagem({ mensagem, recebida }) {
  if (recebida) {
    return (
      <View style={[styles.row, styles.left]}>
        <View style={[styles.bubble, styles.recebida]}>
          <Text style={styles.textoRecebida}>{mensagem}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.row, styles.right]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bubble, styles.enviada]}
      >
        <Text style={styles.textoEnviada}>{mensagem}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 6, paddingHorizontal: 16 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  recebida: { backgroundColor: '#fff', borderBottomLeftRadius: 6 },
  enviada: { borderBottomRightRadius: 6 },
  textoRecebida: { color: colors.text, fontSize: 15 },
  textoEnviada: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
