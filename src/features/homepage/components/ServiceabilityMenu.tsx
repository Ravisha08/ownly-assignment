import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/theme/typography';

const BORDER_COLOR = '#E9E9E9';
const TEXT_COLOR = '#333333';
const ACTIVE_BORDER = '#E8175D';

const ROWS: { notServiceable: boolean; label: string }[] = [
  { notServiceable: false, label: 'Serviceable' },
  { notServiceable: true, label: 'Not serviceable' },
];

export function ServiceabilityMenu({
  notServiceable,
  onSelect,
  onClose,
}: {
  notServiceable: boolean;
  onSelect: (value: boolean) => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.menu}>
      {ROWS.map((row) => {
        const selected = notServiceable === row.notServiceable;
        return (
          <Pressable
            key={row.label}
            style={styles.row}
            onPress={() => {
              onSelect(row.notServiceable);
              onClose();
            }}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected ? <View style={styles.radioDot} /> : null}
            </View>
            <Text style={[styles.label, selected && styles.labelSelected]}>{row.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    alignSelf: 'flex-start',
    minWidth: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: ACTIVE_BORDER,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACTIVE_BORDER,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: TEXT_COLOR,
  },
  labelSelected: {
    color: ACTIVE_BORDER,
  },
});
