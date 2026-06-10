

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
                    id:4,
                    name:"EURO"
                }
            ]
        }
    }

    searchProductsByTextMatch = async (payload) => {
        
        /*
        const SUBMIT_PATH = "/api/products/byTextMatch";
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
            "page": {
                "maxPages": 2,
                "currentPage": 1,
                "totalItems": 100,
                "size": 3,
                "skip": 0
            },
            data: [
                {
                    id:1,
                    name:"papas",
                    "category": {
                        id:10,
                        "name":"verduras"
                    }
                },
                {
                    id:2,
                    name:"harina",
                    "category": {
                        id:20,
                        "name":"reposteria"
                    }
                },
                {
                    id:4,
                    name:"caramelos",
                    "category": {
                        id:30,
                        "name":"chucherias"
                    }
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