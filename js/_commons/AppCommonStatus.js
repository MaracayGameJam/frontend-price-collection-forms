


class AppCommonStatus extends EnumClass{

    
    static #keyNames = {};
    #app_status_name;
    #app_status_message;
    
    constructor(status_name, status_message) {
        super();
        this.#app_status_name = status_name;
        this.#app_status_message = status_message;

        const element = AppCommonStatus.#keyNames[status_name];
        if(element == null) {
            AppCommonStatus.#keyNames[status_name] = this;   
        }
        else {
            throw new Error(`AppCommonStatus ${status_name} already exists`);
        }
    }

    getAppStatusName = () => {
        return this.#app_status_name;
    }

    getAppStatusMessage = () => {
        return this.#app_status_message;
    }
    
    static buildStatus(status_name, status_message)  {
        return Object.freeze(new this(status_name,status_message))
    }

    // ======================================
    static OK = AppCommonStatus.buildStatus("OK","OK");

    // ======================================
}

