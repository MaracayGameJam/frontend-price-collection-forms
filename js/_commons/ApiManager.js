

class ApiManager {
    
    #apiSettings;

    constructor(apiSettings ) {

        this.#apiSettings = apiSettings;
    }

    postPrice = async (payload) => {

        const SUBMIT_PATH = "/api/prices";
        const url = `${this.#apiSettings.baseUrl}${SUBMIT_PATH}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json().catch(() => undefined);
    };
}