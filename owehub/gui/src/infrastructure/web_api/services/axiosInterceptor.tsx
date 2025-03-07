import axios, { isAxiosError } from 'axios';
import { openDB } from 'idb';
import { format } from 'date-fns';
import { subDays, isBefore, parse } from 'date-fns';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

let logsCleanedThisSession = false;

const initDB = async () => {
    return openDB("APILogsDB", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("logs")) {
                db.createObjectStore("logs", { keyPath: "timestamp" });
            }
        },
    });
};

const cleanOldLogs = async () => {
    const db = await initDB();

    // Use a transaction to ensure atomicity
    const tx = db.transaction("logs", "readwrite");
    const store = tx.objectStore("logs");

    const logs = await store.getAll();
    const threeDaysAgo = subDays(new Date(), 3);

    const recentLogs = logs.filter(log => {
        const logDate = parse(log.timestamp, "dd-MM-yyyy HH:mm", new Date());
        return !isBefore(logDate, threeDaysAgo);
    });

    await store.clear();

    // Put all logs back in a single transaction
    for (const log of recentLogs) {
        await store.put(log);
    }

    await tx.done;
    logsCleanedThisSession = true;
};

const saveLogToIndexedDB = async (log: object) => {
    // Only clean logs once per session, not on every log save
    if (!logsCleanedThisSession) {
        await cleanOldLogs();
    }

    const db = await initDB();
    await db.put("logs", log);
};

const api = axios.create({
    baseURL: BASE_URL,
});

const getFormattedTimestamp = () => {
    return format(new Date(), "dd-MM-yyyy HH:mm:ss.SSS"); // Added milliseconds for uniqueness
};

api.interceptors.request.use((config) => {
    if (config.method === 'post') {
        console.log(`📤 POST Request to: ${config.baseURL}${config.url}`, config.data);
    }
    return config;
}, (error) => {
    console.error("🚨 Request Error:", error);
    return Promise.reject(error);
});

api.interceptors.response.use(
    async (response) => {
        if (response.config.method === 'post') {
            const log = {
                timestamp: getFormattedTimestamp(),
                url: response.config.url,
                status: "Success",
                data: response.data,
            };
             await saveLogToIndexedDB(log);
            console.log(`✅ [${log.timestamp}] POST Success: ${log.url}`);
        }
        return response;
    },
    async (error) => {
        if (isAxiosError(error) && error.config?.method === 'post') {
            const log = {
                timestamp: getFormattedTimestamp(),
                url: error.config.url,
                status: "Failed",
                error: error.message,
            };
            await saveLogToIndexedDB(log);
            console.error(`❌ [${log.timestamp}] POST Failed: ${log.url}`, error.message);
        }
        return Promise.reject(error);
    }
);

export default api;