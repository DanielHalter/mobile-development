import { View } from 'react-native';

export default function QuadrateEckeScreen() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}>
      <View style={{ backgroundColor: 'orange', width: 75, height: 75 }} />
      <View style={{ backgroundColor: 'blue', width: 75, height: 75 }} />
      <View style={{ backgroundColor: 'red', width: 75, height: 75 }} />
    </View>
  );
}
