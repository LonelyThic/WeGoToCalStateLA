// utils/scoreStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveFinalScore = async (type, score) => {
    try {
        await AsyncStorage.setItem(`@finalScore_${type}`, JSON.stringify(score));
    } catch (e) {
        console.error("Failed to save score", e);
    }
};

export const getFinalScore = async (type) => {
    try {
        const value = await AsyncStorage.getItem(`@finalScore_${type}`);
        return value ? JSON.parse(value) : null;
    } catch (e) {
        console.error("Failed to get score", e);
        return null;
    }
};


const Placeholder = () => {
    return null;
};

export default Placeholder;