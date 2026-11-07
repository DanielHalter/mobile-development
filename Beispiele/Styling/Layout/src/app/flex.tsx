import { View } from 'react-native';

export default function FlexScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, backgroundColor: 'orange' }} />
      <View style={{ flex: 1, backgroundColor: 'blue' }} />
      <View style={{ flex: 3, backgroundColor: 'red' }} />
    </View>
  );
}
