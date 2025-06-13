import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  // Estados
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState<number>(0);
  const [measurements, setMeasurements] = useState<number[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Dados do gráfico - agora explicitamente declarado
  const chartData = {
    labels: measurements.map((_, i) => i.toString()),
    datasets: [{ data: measurements }]
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setIsRecording(true);

      const interval = setInterval(() => {
        const randomDb = Math.floor(Math.random() * 60) + 30;
        setDecibels(randomDb);
        setMeasurements(prev => [...prev.slice(-9), randomDb]);
      }, 1000);

      return () => clearInterval(interval);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        setRecording(null);
      }
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="graphic-eq" size={32} color="#5E60CE" />
          <Text style={styles.title}>NoiseTrack</Text>
        </View>

        <View style={styles.dbContainer}>
          <Text style={styles.dbValue}>{decibels}</Text>
          <Text style={styles.dbUnit}>dB</Text>
          {decibels > 80 && (
            <View style={styles.warning}>
              <MaterialIcons name="warning" size={20} color="#FF6B6B" />
              <Text style={styles.warningText}>Ruído Alto!</Text>
            </View>
          )}
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData} 
            width={Dimensions.get('window').width * 0.9}
            height={220}
            yAxisSuffix=" dB"
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(94, 96, 206, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#5E60CE'
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, isRecording && styles.buttonRecording]}
          onPress={toggleRecording}
        >
          <MaterialIcons 
            name={isRecording ? "stop" : "fiber-manual-record"} 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.buttonText}>
            {isRecording ? "PARAR MEDIÇÃO" : "INICIAR MEDIÇÃO"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ... (seus estilos permanecem os mesmos)

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 12,
    color: '#5E60CE'
  },
  dbContainer: {
    alignItems: 'center',
    marginVertical: 24
  },
  dbValue: {
    fontSize: 72,
    fontWeight: '700',
    color: '#4A4E69'
  },
  dbUnit: {
    fontSize: 24,
    color: '#6C757D',
    marginTop: -12
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEEEE',
    padding: 8,
    borderRadius: 20,
    marginTop: 12
  },
  warningText: {
    color: '#FF6B6B',
    marginLeft: 4,
    fontWeight: '600'
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center'
  },
  chart: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5E60CE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    marginTop: 24
  },
  buttonRecording: {
    backgroundColor: '#FF6B6B'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12
  }
});