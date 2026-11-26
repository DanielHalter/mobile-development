import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router/stack';

import { ResultRow } from '@/components/result-row';
import { Spacing, useTheme } from '@/constants/theme';

const HIGH_KEY = 'loesung-pacman-highscore';
let memoryHighscore = 0;

function readHighscore() {
  try {
    if (typeof localStorage !== 'undefined') {
      return Number(localStorage.getItem(HIGH_KEY) || 0);
    }
  } catch {
    // native: kein localStorage
  }
  return memoryHighscore;
}

function writeHighscore(value: number) {
  memoryHighscore = value;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(HIGH_KEY, String(value));
    }
  } catch {
    // native: nur im Speicher
  }
}

const WIDTH = 28;
const PACMAN_START = 490;
const WIN_SCORE = 274;

const LAYOUT = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
  1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const GHOST_STARTS = [
  { name: 'blinky', start: 348, speed: 250, color: '#ff0000' },
  { name: 'pinky', start: 376, speed: 400, color: '#ffc0cb' },
  { name: 'inky', start: 351, speed: 300, color: '#00ffff' },
  { name: 'clyde', start: 379, speed: 500, color: '#ffa500' },
] as const;

type Ghost = {
  name: string;
  start: number;
  index: number;
  color: string;
};

function isWall(index: number) {
  return LAYOUT[index] === 1;
}

function isLair(index: number) {
  return LAYOUT[index] === 2;
}

function canPacmanEnter(index: number) {
  return index >= 0 && index < LAYOUT.length && !isWall(index) && !isLair(index);
}

function canGhostEnter(index: number, ghosts: Ghost[]) {
  return index >= 0 && index < LAYOUT.length && !isWall(index) && !ghosts.some((ghost) => ghost.index === index);
}

function moveIndex(index: number, direction: 'left' | 'up' | 'right' | 'down') {
  if (direction === 'left' && index % WIDTH !== 0) {
    return index - 1;
  }
  if (direction === 'right' && index % WIDTH < WIDTH - 1) {
    return index + 1;
  }
  if (direction === 'up' && index - WIDTH >= 0) {
    return index - WIDTH;
  }
  if (direction === 'down' && index + WIDTH < WIDTH * WIDTH) {
    return index + WIDTH;
  }
  return index;
}

function createDots() {
  return new Set(LAYOUT.map((cell, index) => (cell === 0 ? index : -1)).filter((index) => index >= 0));
}

function createPellets() {
  return new Set(LAYOUT.map((cell, index) => (cell === 3 ? index : -1)).filter((index) => index >= 0));
}

function createGhosts(): Ghost[] {
  return GHOST_STARTS.map((ghost) => ({
    name: ghost.name,
    start: ghost.start,
    index: ghost.start,
    color: ghost.color,
  }));
}

export default function Pacman() {
  const theme = useTheme();
  const [boardSize, setBoardSize] = useState(0);
  const cellSize = boardSize > 0 ? boardSize / WIDTH : 8;
  const [pacman, setPacman] = useState(PACMAN_START);
  const [score, setScore] = useState(0);
  const [dots, setDots] = useState(createDots);
  const [pellets, setPellets] = useState(createPellets);
  const [ghosts, setGhosts] = useState(createGhosts);
  const [scared, setScared] = useState(false);
  const [bonus, setBonus] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [highscore, setHighscore] = useState(readHighscore);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [dialog, setDialog] = useState<string | null>(null);
  const playing = useRef(true);
  const pausedRef = useRef(false);
  const scaredRef = useRef(false);
  const pacmanRef = useRef(PACMAN_START);
  const ghostsRef = useRef(createGhosts());

  useEffect(() => {
    playing.current = status === 'playing';
  }, [status]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    scaredRef.current = scared;
  }, [scared]);

  useEffect(() => {
    pacmanRef.current = pacman;
  }, [pacman]);

  useEffect(() => {
    ghostsRef.current = ghosts;
  }, [ghosts]);

  useEffect(() => {
    const timers = GHOST_STARTS.map((ghostStart) =>
      setInterval(() => {
        if (!playing.current || pausedRef.current) {
          return;
        }
        setGhosts((current) => {
          const ghost = current.find((item) => item.name === ghostStart.name);
          if (!ghost) {
            return current;
          }
          const directions: Array<'left' | 'up' | 'right' | 'down'> = ['left', 'right', 'up', 'down'];
          const nextDirection = directions[Math.floor(Math.random() * directions.length)];
          const nextIndex = moveIndex(ghost.index, nextDirection);
          if (nextIndex === ghost.index || !canGhostEnter(nextIndex, current.filter((item) => item.name !== ghost.name))) {
            return current;
          }
          const nextGhosts = current.map((item) => (item.name === ghost.name ? { ...item, index: nextIndex } : item));
          const hit = nextGhosts.find((item) => item.index === pacmanRef.current);
          if (hit) {
            if (scaredRef.current) {
              setScore((value) => value + 100);
              return nextGhosts.map((item) => (item.name === hit.name ? { ...item, index: item.start } : item));
            }
            playing.current = false;
            setStatus('lost');
          }
          return nextGhosts;
        });
      }, ghostStart.speed),
    );
    return () => timers.forEach(clearInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!playing.current || pausedRef.current) {
        return;
      }
      const randomIndex = Math.floor(Math.random() * LAYOUT.length);
      if (LAYOUT[randomIndex] !== 1) {
        setBonus(randomIndex);
        setTimeout(() => {
          setBonus((current) => (current === randomIndex ? null : current));
        }, 10000);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function resetGame() {
    playing.current = true;
    scaredRef.current = false;
    pacmanRef.current = PACMAN_START;
    ghostsRef.current = createGhosts();
    setPacman(PACMAN_START);
    setScore(0);
    setDots(createDots());
    setPellets(createPellets());
    setGhosts(createGhosts());
    setScared(false);
    setBonus(null);
    setPaused(false);
    setDialog(null);
    setStatus('playing');
  }

  function updateHighscore(nextScore: number) {
    if (nextScore > highscore) {
      writeHighscore(nextScore);
      setHighscore(nextScore);
    }
  }

  function move(direction: 'left' | 'up' | 'right' | 'down') {
    if (status !== 'playing' || paused) {
      return;
    }
    const next = moveIndex(pacman, direction);
    if (next === pacman || !canPacmanEnter(next)) {
      return;
    }
    let nextScore = score;
    const nextDots = new Set(dots);
    const nextPellets = new Set(pellets);
    if (nextDots.has(next)) {
      nextDots.delete(next);
      nextScore += 1;
    }
    if (nextPellets.has(next)) {
      nextPellets.delete(next);
      nextScore += 10;
      setScared(true);
      setTimeout(() => setScared(false), 10000);
    }
    if (bonus === next) {
      nextScore += 50;
      setBonus(null);
    }
    const hit = ghosts.find((ghost) => ghost.index === next);
    if (hit) {
      if (scared) {
        nextScore += 100;
        setGhosts((current) => current.map((ghost) => (ghost.name === hit.name ? { ...ghost, index: ghost.start } : ghost)));
      } else {
        setStatus('lost');
        updateHighscore(nextScore);
        setDialog('Game Over');
        setPacman(next);
        setScore(nextScore);
        setDots(nextDots);
        setPellets(nextPellets);
        return;
      }
    }
    if (nextScore >= WIN_SCORE) {
      setStatus('won');
      updateHighscore(nextScore);
      setDialog('You have WON!');
    }
    setPacman(next);
    setScore(nextScore);
    updateHighscore(nextScore);
    setDots(nextDots);
    setPellets(nextPellets);
  }

  const cells = useMemo(() => LAYOUT.map((_, index) => index), []);

  return (
    <>
      <Stack.Screen options={{ title: 'Pacman' }} />
      <View style={{ flex: 1, backgroundColor: theme.systemBackground }}>
        <View style={styles.header}>
          <Text selectable style={{ color: theme.secondaryLabel, fontSize: 16, lineHeight: 22 }}>
            Lösung zu Javascript/Lösungen/Pacman: Highscore, Pause und Bonus.
          </Text>
          <ResultRow label="Score" value={String(score)} />
          <ResultRow label="Highscore" value={String(highscore)} />
        </View>
        <View
          style={styles.boardArea}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            const next = Math.floor(Math.min(width, height) / WIDTH) * WIDTH;
            if (next !== boardSize) {
              setBoardSize(next);
            }
          }}>
          <View style={[styles.grid, { width: cellSize * WIDTH, height: cellSize * WIDTH }]}>
            {cells.map((index) => {
              const ghost = ghosts.find((item) => item.index === index);
              const isPacman = pacman === index;
              const backgroundColor = isPacman
                ? '#ffe600'
                : ghost
                  ? scared
                    ? '#7fffd4'
                    : ghost.color
                  : isWall(index)
                    ? '#008000'
                    : bonus === index
                      ? '#ffd700'
                      : pellets.has(index)
                        ? '#0000ff'
                        : '#000000';
              return (
                <View
                  key={index}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!isPacman && !ghost && dots.has(index) ? (
                    <View
                      style={{
                        width: cellSize / 4,
                        height: cellSize / 4,
                        backgroundColor: '#00aa00',
                        borderRadius: cellSize,
                      }}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.controls}>
          <View style={styles.row}>
            <View style={styles.spacer} />
            <Pressable
              onPress={() => move('up')}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.secondarySystemBackground, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.keyLabel, { color: theme.label }]}>↑ Hoch</Text>
            </Pressable>
            <View style={styles.spacer} />
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={() => move('left')}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.secondarySystemBackground, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.keyLabel, { color: theme.label }]}>← Links</Text>
            </Pressable>
            <Pressable
              onPress={() => move('right')}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.secondarySystemBackground, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.keyLabel, { color: theme.label }]}>→ Rechts</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <View style={styles.spacer} />
            <Pressable
              onPress={() => move('down')}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.secondarySystemBackground, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.keyLabel, { color: theme.label }]}>↓ Runter</Text>
            </Pressable>
            <View style={styles.spacer} />
          </View>
          <Pressable
            onPress={() => setPaused((value) => !value)}
            style={({ pressed }) => [
              styles.key,
              { backgroundColor: theme.secondarySystemBackground, opacity: pressed ? 0.7 : 1 },
            ]}>
            <Text style={[styles.keyLabel, { color: theme.label }]}>{paused ? 'Weiter' : 'Pause'}</Text>
          </Pressable>
          {status !== 'playing' ? (
            <Pressable
              onPress={resetGame}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.secondarySystemBackground, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.keyLabel, { color: theme.label }]}>Neu starten</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={resetGame} style={({ pressed }) => pressed && styles.pressed}>
            <Text style={{ color: theme.secondaryLabel, textAlign: 'center' }}>Spiel zurücksetzen</Text>
          </Pressable>
        </View>
      </View>

      <Modal visible={dialog != null} transparent animationType="fade" onRequestClose={() => setDialog(null)}>
        <View style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: theme.secondarySystemBackground }]}>
            <Text style={[styles.keyLabel, { color: theme.label }]}>{dialog}</Text>
            <Pressable
              onPress={() => setDialog(null)}
              style={({ pressed }) => [
                styles.key,
                { backgroundColor: theme.systemBackground, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Text style={[styles.keyLabel, { color: theme.label }]}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#000000',
  },
  controls: {
    width: '100%',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  spacer: {
    flex: 1,
  },
  key: {
    flex: 1,
    minHeight: 56,
    borderRadius: Spacing.three,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    borderRadius: Spacing.three,
    borderCurve: 'continuous',
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
