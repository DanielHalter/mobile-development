import { View } from 'react-native';

export default function QuadrateAbstandScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <View style={{ backgroundColor: 'orange', width: 75, height: 75 }} />
      <View style={{ backgroundColor: 'blue', width: 75, height: 75 }} />
      <View style={{ backgroundColor: 'red', width: 75, height: 75 }} />
    </View>
  );
}
