import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { questions as staticQuestions } from '../data/mockData';
import { theme } from '../theme';
import { Question, UserProgress } from '../data/types';
import { loadProgress, saveProgress, updateProgress, generateQuestions, getTodayWords } from '../data/learningLogic';

export const PracticeScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const loadedProgress = loadProgress();
    setProgress(loadedProgress);
    
    const todayWords = getTodayWords(loadedProgress);
    const generatedQuestions = todayWords.length > 0 
      ? generateQuestions(todayWords, 6) 
      : staticQuestions;
    
    setQuestions(generatedQuestions.length > 0 ? generatedQuestions : staticQuestions);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const isCorrect = currentQuestion.options[selectedAnswer].isCorrect;
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnswers([...answers, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      if (progress) {
        const todayWords = getTodayWords(progress);
        const newProgress = updateProgress(progress, todayWords, score, 0);
        saveProgress(newProgress);
        setProgress(newProgress);
      }
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setIsFinished(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return '完美！你是词根大师！';
    if (percentage >= 80) return '优秀！继续保持！';
    if (percentage >= 60) return '不错！继续努力！';
    if (percentage >= 40) return '加油！多复习词根！';
    return '需要多练习，不要放弃！';
  };

  if (questions.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>暂无练习题目</Text>
          <Text style={styles.emptyText}>请先学习今日单词</Text>
        </View>
      </ScrollView>
    );
  }

  if (isFinished) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.finishContainer}>
          <Text style={styles.finishTitle}>练习完成！</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreTotal}>/{questions.length}</Text>
          </View>
          <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
          <View style={styles.answerSummary}>
            {answers.map((answer, index) => (
              <View
                key={index}
                style={[styles.answerDot, answer ? styles.correctDot : styles.wrongDot]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>再练一次</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>词根练习</Text>
        <View style={styles.headerRight}>
          <Text style={styles.progressText}>{currentIndex + 1}/{questions.length}</Text>
          <Text style={styles.scoreText}>得分 {score}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          let optionStyle = styles.option;
          let textStyle = styles.optionText;

          if (showResult) {
            if (option.isCorrect) {
              optionStyle = styles.correctOption;
              textStyle = styles.correctOptionText;
            } else if (selectedAnswer === index) {
              optionStyle = styles.wrongOption;
              textStyle = styles.wrongOptionText;
            }
          } else if (selectedAnswer === index) {
            optionStyle = styles.selectedOption;
            textStyle = styles.selectedOptionText;
          }

          return (
            <TouchableOpacity
              key={index}
              style={optionStyle}
              onPress={() => handleSelectAnswer(index)}
              disabled={showResult}
            >
              <Text style={textStyle}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {showResult && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>解析</Text>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!showResult ? (
          <TouchableOpacity
            style={[styles.submitButton, selectedAnswer === null && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>确认答案</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scoreText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.textTertiary + '30',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  questionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    lineHeight: 26,
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  option: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  correctOption: {
    padding: 16,
    backgroundColor: theme.colors.success + '20',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  wrongOption: {
    padding: 16,
    backgroundColor: theme.colors.error + '20',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  selectedOptionText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  correctOptionText: {
    fontSize: 16,
    color: theme.colors.success,
  },
  wrongOptionText: {
    fontSize: 16,
    color: theme.colors.error,
  },
  explanationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.textTertiary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.background,
  },
  nextButton: {
    backgroundColor: theme.colors.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.background,
  },
  finishContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 100,
  },
  finishTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 32,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  scoreTotal: {
    fontSize: 24,
    color: theme.colors.textTertiary,
  },
  scoreMessage: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  answerSummary: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  answerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  correctDot: {
    backgroundColor: theme.colors.success,
  },
  wrongDot: {
    backgroundColor: theme.colors.error,
  },
  restartButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.background,
  },
});
