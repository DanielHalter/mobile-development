import { Directory, File, Paths } from 'expo-file-system';

const PHOTO_DIRECTORY = 'journal-photos';
const MAX_EDGE = 960;

function photoDirectory(): Directory {
  return new Directory(Paths.document, PHOTO_DIRECTORY);
}

async function readDurableWebPhoto(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not available');
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.7);
}

async function copyPhotoToDocuments(uri: string, date: number): Promise<string> {
  const photos = photoDirectory();
  if (!photos.exists) {
    photos.create({ intermediates: true, idempotent: true });
  }
  const target = new File(photos, `${date}.jpg`);
  await new File(uri).copy(target);
  return target.uri;
}

export async function persistPhoto(uri: string, date: number): Promise<string> {
  if (uri.startsWith('data:')) {
    return uri;
  }

  try {
    if (process.env.EXPO_OS === 'web') {
      return await readDurableWebPhoto(uri);
    }
    return await copyPhotoToDocuments(uri, date);
  } catch (error) {
    console.error('Error saving journal photo.', error);
    return uri;
  }
}

export function deleteStoredPhotos(): void {
  if (process.env.EXPO_OS === 'web') {
    return;
  }

  try {
    const photos = photoDirectory();
    if (photos.exists) {
      photos.delete();
    }
  } catch (error) {
    console.error('Error deleting journal photos.', error);
  }
}
