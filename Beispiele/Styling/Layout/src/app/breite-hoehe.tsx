import { View } from 'react-native';

export default function BreiteHoeheScreen() {
  return (
    <View>
      <View style={{ backgroundColor: 'orange', width: 80, height: 80 }} />
      <View style={{ backgroundColor: 'blue', width: 200, height: 80 }} />
      <View style={{ backgroundColor: 'red', width: 80, height: 200 }} />
    </View>
  );
}
