import React, { useState } from 'react';
import { Platform, Modal, View, Button, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import themes, { spacing } from '../themes';

interface TimePickerModalProps {
  visible: boolean;
  initialTime?: Date;
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initialTime = new Date(),
  onConfirm,
  onCancel,
}) => {
  const [time, setTime] = useState(initialTime);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setTime(selectedDate);
      // Android: confirm immediately when user presses OK
      if (Platform.OS === 'android' && event.type === 'set') {
        onConfirm(format(time, 'HH:mm'));
      }
    } else {
      // Android: cancel pressed
      if (Platform.OS === 'android') onCancel();
    }
  };

  if (Platform.OS === 'ios') {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              onChange={handleChange}
              minuteInterval={15}
            />
            <View style={styles.buttons}>
              <Button title="Cancel" onPress={onCancel} />
              <Button
                title="Confirm"
                onPress={() => onConfirm(format(time, 'HH:mm'))}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return visible ? (
    <DateTimePicker
      value={time}
      mode="time"
      display="default"
      onChange={handleChange}
      minuteInterval={15}
    />
  ) : null;
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: themes.colors.white,
    padding: spacing(16),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: spacing(12),
  },
});
