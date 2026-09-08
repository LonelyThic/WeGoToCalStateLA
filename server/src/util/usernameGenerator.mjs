
import { uniqueUsernameGenerator } from "unique-username-generator";
import config from "../config/usernameConfig.mjs";

export default function usernameGenerator() {
    return uniqueUsernameGenerator(config);
}