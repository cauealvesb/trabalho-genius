import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const GRID_SIZE = 3;
const LEVELS = [
  { steps: 3, speed: 1000 }, // Fácil
  { steps: 5, speed: 700 }, // Médio
  { steps: 7, speed: 400 }  // Difícil
];

export default function GeniusGame() {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(0);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (userInput.length === sequence.length && sequence.length > 0) {
      setTimeout(() => {
        const newScore = score + 1;
        setScore(newScore);
        setUserInput([]);

        if (newScore % 5 === 0 && difficultyLevel < LEVELS.length - 1) {
          setDifficultyLevel(difficultyLevel + 1);
        }
        generateSequence(sequence.length + 1);
      }, 500);
    }
  }, [userInput]);

  const startGame = () => {
    setGameOver(false);
    setScore(0);
    setDifficultyLevel(0);
    setSequence([]);
    setUserInput([]);
    generateSequence(LEVELS[difficultyLevel].steps);
  };

  const generateSequence = (length) => {
    let newSequence = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
    }
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playSequence = async (seq) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, LEVELS[difficultyLevel].speed));
      setHighlighted(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setHighlighted(null);
    }
    setIsPlaying(false);
  };

  const handlePress = (index) => {
    if (isPlaying) return;
    
    const newInput = [...userInput, index];
    setUserInput(newInput);
    
    if (sequence[newInput.length - 1] !== index) {
      setGameOver(true);
      return;
    }
  };

  if (gameOver) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro! Você errou a sequência.</Text>
        <TouchableOpacity onPress={startGame} style={styles.button}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo Gênios</Text>
      <Text style={styles.score}>Pontuação: {score}</Text>
      <Text style={styles.level}>Dificuldade: {difficultyLevel + 1}</Text>
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: GRID_SIZE }).map((_, col) => {
              const index = row * GRID_SIZE + col;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.square, highlighted === index ? styles.highlighted : null]}
                  onPress={() => handlePress(index)}
                  disabled={isPlaying}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  score: { fontSize: 18, marginBottom: 10 },
  level: { fontSize: 18, marginBottom: 20 },
  grid: { },
  row: { flexDirection: 'row' },
  square: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlighted: { backgroundColor: 'yellow' },
  button: {
    margin: 5,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' },
  errorText: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20 },
});

