import { View } from 'react-native';

export default function ProzentScreen() {
  return (
    <View style={{ backgroundColor: 'gray', width: 250, height: 350 }}>
      <View
        style={{
          backgroundColor: 'orange',
          width: '50%',
          height: '50%',
        }}
      />
    </View>
  );
}
