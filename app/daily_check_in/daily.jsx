import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constant/Colors';
import { useTheme } from '../context/ThemeContext';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

function CustomDropdown({ label, options, selectedValue, onValueChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={dropdownStyles.dropdownContainer}>
      <Text style={[dropdownStyles.dropdownLabel, themeStyles[theme].text]}>{label}</Text>
      <TouchableOpacity
        style={[dropdownStyles.dropdownButton, themeStyles[theme].textInput]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[dropdownStyles.dropdownButtonText, themeStyles[theme].text]}>
          {selectedValue ? selectedValue : '-- Select --'}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={dropdownStyles.modalOverlay} onPress={() => setModalVisible(false)}>
        <View style={[dropdownStyles.modalContent, { backgroundColor: themeStyles[theme]?.textInput?.backgroundColor }]}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={dropdownStyles.modalItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[dropdownStyles.modalItemText, themeStyles[theme].text]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const dropdownStyles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxHeight: 300,
    backgroundColor: Colors.WHITE, // default light background
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontSize: 25,
    textAlign: 'center',
  },
});

const emotionData = {
  Fear: {
    options: ["Scared", "Terror", "Insecure", "Nervous", "Horror"],
    subOptions: {
      Scared: ["Helpless", "Frightened"],
      Terror: ["Hysterical", "Panic"],
      Insecure: ["Inadequate", "Inferior"],
      Nervous: ["Anxious", "Worried"],
      Horror: ["Dread", "Mortified"]
    }
  },
  Anger: {
    options: ["Rage", "Frustrated", "Hostile"],
    subOptions: {
      Rage: ["Furious", "Enraged"],
      Frustrated: ["Irritated", "Annoyed"],
      Hostile: ["Aggressive", "Antagonistic"]
    }
  },
  Sadness: {
    options: ["Depressed", "Lonely", "Hurt"],
    subOptions: {
      Depressed: ["Down", "Melancholic"],
      Lonely: ["Isolated", "Abandoned"],
      Hurt: ["Wounded", "Sorrowful"]
    }
  },
  Surprise: {
    options: ["Stunned", "Shocked", "Amazed"],
    subOptions: {
      Stunned: ["Overwhelmed", "Dazed"],
      Shocked: ["Startled", "Taken aback"],
      Amazed: ["Awed", "Inspired"]
    }
  },
  Joy: {
    options: ["Happy", "Cheerful", "Delighted"],
    subOptions: {
      Happy: ["Joyful", "Ecstatic"],
      Cheerful: ["Sunny", "Upbeat"],
      Delighted: ["Overjoyed", "Thrilled"]
    }
  },
  Love: {
    options: ["Romantic", "Passionate", "Tender"],
    subOptions: {
      Romantic: ["Loving", "Devoted"],
      Passionate: ["Fervent", "Intense"],
      Tender: ["Gentle", "Warm"]
    }
  }
};

const broadEmotionsOrder = ["Fear", "Anger", "Sadness", "Surprise", "Joy", "Love"];

const colorsArray = [
  Colors.CREAM,      // 0: Default background
  "#FF9999",         // 1: Fear
  "#FF6666",         // 2: Anger
  "#6699FF",         // 3: Sadness
  "#FFCC66",         // 4: Surprise
  "#FFFF66",         // 5: Joy
  "#FF99CC"          // 6: Love
];

const negativeEmotions = ["Fear", "Anger", "Sadness"];

const themeStyles = {
  light: {
    container: { backgroundColor: Colors.CREAM },
    title: { color: Colors.BLACK },
    text: { color: Colors.BLACK },
    textInput: { backgroundColor: Colors.WHITE, color: Colors.BLACK },
    button: { backgroundColor: Colors.PRIMARY },
    buttonText: { color: Colors.WHITE },
  },
  dark: {
    container: { backgroundColor: Colors.M_CHAR },
    title: { color: Colors.WHITE },
    text: { color: Colors.WHITE },
    textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
    button: { backgroundColor: Colors.GRAY },
    buttonText: { color: Colors.WHITE },
  },
  "high-contrast": {
    container: { backgroundColor: "#000000" },
    title: { color: "#FFFF00" },
    text: { color: "#FFFF00" },
    textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
    button: { backgroundColor: "#FFFF00" },
    buttonText: { color: "#000000" },
  },
};

export default function RefineEmotion() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [broadEmotion, setBroadEmotion] = useState('');
  const [midEmotion, setMidEmotion] = useState('');
  const [subEmotion, setSubEmotion] = useState('');
  const [logEntries, setLogEntries] = useState([]);

  // Shared value for animated background color index
  const bgIndex = useSharedValue(0);

  // Animated style for background color
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        bgIndex.value,
        [0, 1, 2, 3, 4, 5, 6],
        colorsArray
      )
    };
  });

  const handleSubmit = () => {
    if (!broadEmotion || !midEmotion || !subEmotion) {
      Alert.alert("Error", "Please complete all selections.");
      return;
    }

    const newEntry = {
      broad: broadEmotion,
      mid: midEmotion,
      sub: subEmotion,
      timestamp: new Date().toLocaleString()
    };

    setLogEntries(prev => [...prev, newEntry]);

    Alert.alert(
      "Emotion Selected",
      `You selected: ${broadEmotion} > ${midEmotion} > ${subEmotion}`,
      negativeEmotions.includes(broadEmotion)
        ? [
            { text: "OK" },
            { text: "Check In Again", onPress: resetForm }
          ]
        : [{ text: "OK" }]
    );

    if (!negativeEmotions.includes(broadEmotion)) {
      resetForm();
    }
  };

  const resetForm = () => {
    setBroadEmotion('');
    setMidEmotion('');
    setSubEmotion('');
    bgIndex.value = withTiming(0, { duration: 500 });
  };


  return (
    <AnimatedSafeAreaView style={[refineStyles.container, animatedStyle, themeStyles[theme].container, { marginTop: -insets.top }]}>
      <View style={{ marginTop: 20 }}>
        <Text style={[refineStyles.header, themeStyles[theme].title]}>Daily Check In</Text>
      </View>
      
      <CustomDropdown
        label="Select Broad Emotion:"
        options={Object.keys(emotionData)}
        selectedValue={broadEmotion}
        onValueChange={(value) => {
          setBroadEmotion(value);
          setMidEmotion('');
          setSubEmotion('');
          const index = broadEmotionsOrder.indexOf(value) + 1; // +1 since index 0 is default
          bgIndex.value = withTiming(index, { duration: 500 });
        }}
      />

      {broadEmotion ? (
        <CustomDropdown
          label="Select Specific Emotion:"
          options={emotionData[broadEmotion].options}
          selectedValue={midEmotion}
          onValueChange={(value) => {
            setMidEmotion(value);
            setSubEmotion('');
          }}
        />
      ) : null}

      {midEmotion ? (
        <CustomDropdown
          label="Select Associated Emotion:"
          options={emotionData[broadEmotion].subOptions[midEmotion]}
          selectedValue={subEmotion}
          onValueChange={(value) => setSubEmotion(value)}
        />
      ) : null}

      <TouchableOpacity style={[refineStyles.button, themeStyles[theme].button]} onPress={handleSubmit}>
        <Text style={[refineStyles.buttonText, themeStyles[theme].buttonText]}>Submit Emotion</Text>
      </TouchableOpacity>

      {logEntries.length > 0 && (
        <View style={[refineStyles.logContainer, themeStyles[theme].container]}>
          <Text style={[refineStyles.logHeader, themeStyles[theme].title]}>Emotion Log:</Text>
          <FlatList
            data={logEntries}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={[refineStyles.logEntry, themeStyles[theme].text]}>
                {item.timestamp}: {item.broad} {'>'} {item.mid} {'>'} {item.sub}
              </Text>
            )}
          />
        </View>
      )}

    </AnimatedSafeAreaView>
  );
}

const refineStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingBottom: 10,
    backgroundColor: Colors.transparent,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.BLACK,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  logContainer: {
    marginTop: 30,
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
  },
  logHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.BLACK,
  },
  logEntry: {
    fontSize: 14,
    color: Colors.BLACK,
    marginBottom: 5,
  },
});