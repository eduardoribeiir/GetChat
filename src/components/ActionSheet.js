import { Modal, View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// opcoes: [{ label, icon, onPress, destrutivo }]
export default function ActionSheet({ visivel, titulo, opcoes = [], onFechar }) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <Pressable style={styles.overlay} onPress={onFechar}>
        <Pressable style={styles.sheet}>
          {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
          {opcoes.map((op) => (
            <TouchableOpacity
              key={op.label}
              style={styles.opcao}
              activeOpacity={0.7}
              onPress={() => {
                onFechar();
                op.onPress?.();
              }}
            >
              {op.icon && (
                <Ionicons name={op.icon} size={22} color={op.destrutivo ? colors.danger : colors.primary} />
              )}
              <Text style={[styles.label, op.destrutivo && { color: colors.danger }]}>{op.label}</Text>
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 28 },
  titulo: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8, marginHorizontal: 8 },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 8 },
  label: { fontSize: 16, color: colors.text },
});
