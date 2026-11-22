import { requireOptionalNativeModule } from 'expo';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';

import { InfoRow } from '@/components/info-row';
import { Hint, Section } from '@/components/section';

type ApplicationModule = {
  nativeApplicationVersion: string | null;
  nativeBuildVersion: string | null;
};

const application = readApplication();

const supportInfo = {
  model: Device.modelName ?? 'Unbekannt',
  os: Device.osName ?? 'Unbekannt',
  osVersion: Device.osVersion ?? 'Unbekannt',
  appVersion: application?.nativeApplicationVersion ?? 'Unbekannt',
  build: application?.nativeBuildVersion ?? 'Unbekannt',
};

const runsInExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const applicationMissing = process.env.EXPO_OS !== 'web' && application == null;

export function DeviceSection() {
  return (
    <Section title="Gerät und App-Version" purpose="Einen Fehler einem Gerät und einer App-Version zuordnen.">
      <InfoRow label="Modell" value={supportInfo.model} />
      <InfoRow label="Betriebssystem" value={supportInfo.os} />
      <InfoRow label="Betriebssystemversion" value={supportInfo.osVersion} />
      <InfoRow label="App-Version" value={supportInfo.appVersion} />
      <InfoRow label="Buildnummer" value={supportInfo.build} />
      {applicationMissing ? (
        <Hint>
          {`Dieses Expo Go enthält das native Modul ExpoApplication nicht. App-Version und Buildnummer bleiben deshalb leer. In app.json steht ${configuredVersion()}, Build ${configuredBuild()}. Im eigenen Build liest expo-application die installierte Version.`}
        </Hint>
      ) : null}
      {runsInExpoGo && !applicationMissing ? (
        <Hint>
          Expo Go: Native Versionswerte beziehen sich auf den installierten Host. Die Version der eigenen App prüft man im eigenen Build.
        </Hint>
      ) : null}
    </Section>
  );
}

function readApplication(): ApplicationModule | null {
  if (process.env.EXPO_OS !== 'web' && requireOptionalNativeModule('ExpoApplication') == null) {
    return null;
  }
  const Application = require('expo-application') as typeof import('expo-application');
  return {
    nativeApplicationVersion: Application.nativeApplicationVersion,
    nativeBuildVersion: Application.nativeBuildVersion,
  };
}

function configuredVersion() {
  return Constants.expoConfig?.version ?? '1.2.0';
}

function configuredBuild() {
  if (process.env.EXPO_OS === 'ios') {
    return Constants.expoConfig?.ios?.buildNumber ?? '7';
  }
  const versionCode = Constants.expoConfig?.android?.versionCode;
  return versionCode == null ? '7' : String(versionCode);
}
