import { ScrollView, StyleSheet } from 'react-native';

import { BatterySection } from '@/components/battery-section';
import { DeviceSection } from '@/components/device-section';
import { LocaleSection } from '@/components/locale-section';
import { LocationSection } from '@/components/location-section';
import { NetworkSection } from '@/components/network-section';
import { SensorSection } from '@/components/sensor-section';
import { WindowSection } from '@/components/window-section';

export default function DeviceDemoScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <DeviceSection />
      <WindowSection />
      <LocaleSection />
      <NetworkSection />
      <BatterySection />
      <LocationSection />
      <SensorSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
});
