

class ApiManager {
    
    #apiSettings;
    
    static METHODS = Object.freeze({
        "GET":"GET",
        "POST":"POST",
    });

    constructor(apiSettings ) {

        this.#apiSettings = apiSettings;
    }

    getCurrencies = async (payload) => {
        /*
        const SUBMIT_PATH = "/api/currencies";
        const url = `${this.#apiSettings.baseUrl}${SUBMIT_PATH}`;
        const response = await fetch(url, {
            method: ApiManager.METHODS.GET,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json().catch(() => undefined);
        */

        return {
            app_status_name:"OK",
            app_status_message:"OK",
            data: [
                {
                    id:1,
                    name:"DÓLAR"
                },
                {
                    id:2,
                    name:"BOLÍVAR"
                },
                {
                    id:2,
                    name:"EURO"
                }
            ]
        }
    }

    postPrice = async (payload) => {
        
        /*
        const SUBMIT_PATH = "/api/prices";
        const url = `${this.#apiSettings.baseUrl}${SUBMIT_PATH}`;
        const response = await fetch(url, {
            method: ApiManager.METHODS.POST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json().catch(() => undefined);
        */

        return {
            app_status_name:"OK",
            app_status_message:"OK",
            data:null
        }
    };
}