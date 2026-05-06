

class ViewModel {
    
    #loadingEventBus;
    #postSinglePriceSuccessEventBus;
    #errorEventBus;

    #apiManager;

    constructor(apiManager) {
        this.#apiManager = apiManager;
    }

    setLoadingEventBus(loadingEventBus) {
        this.#loadingEventBus = loadingEventBus;
    }

    setPostSinglePriceSuccessEventBus(postSinglePriceSuccessEventBus) {
        this.#postSinglePriceSuccessEventBus = postSinglePriceSuccessEventBus;
    }

    setErrorEventBus(errorEventBus) {
        this.#errorEventBus = errorEventBus;
    }

    subscribeOnLoadingListener = (func) => {
        if (this.#loadingEventBus != null) {
            this.#loadingEventBus.subscribe(func);
        }
    };

    unsubscribeOnLoadingListener = (func) => {
        if (this.#loadingEventBus != null) {
            this.#loadingEventBus.unsubscribe(func);
        }
    };

    subscribeOnErrorListener = (func) => {
        if (this.#errorEventBus != null) {
            this.#errorEventBus.subscribe(func);
        }
    };

    unsubscribeOnErrorListener = (func) => {
        if (this.#errorEventBus != null) {
            this.#errorEventBus.unsubscribe(func);
        }
    };

    subscribeOnPostSinglePriceSuccessListener = (func) => {
        if (this.#postSinglePriceSuccessEventBus != null) {
            this.#postSinglePriceSuccessEventBus.subscribe(func);
        }
    };

    unsubscribeOnPostSinglePriceSuccessListener = (func) => {
        if (this.#postSinglePriceSuccessEventBus != null) {
            this.#postSinglePriceSuccessEventBus.unsubscribe(func);
        }
    };

    requestInitialData = () => {

    }

    requestCategories = () => {

    }

    requestProducts = () => {

    }

    requestCurrencies = () => {
        
    }

    processSinglePrice = (dataView) => {
        this.#loadingNotify(true);
        let error = null;
        let response = null;
        this.#postPrice(dataView)
            .then((res) => {
                response = res;
            })
            .catch((err) => {
                console.error(err);
                error = err;
            })
            .finally(() => {
                this.#loadingNotify(false);
                this.#postSinglePriceManagerResponse(response, error);
            });
    };

    #postSinglePriceManagerResponse = (response, error) => {
        if (error != null) {
            this.#onErrorNotify(error);
        } else {
            this.#onPostSinglePriceSuccessNotify(response);
        }
    };

    #loadingNotify = (loading) => {
        if (this.#loadingEventBus != null) {
            this.#loadingEventBus.dispatch(loading);
        }
    };

    #onPostSinglePriceSuccessNotify = (dataObject) => {
        if (this.#postSinglePriceSuccessEventBus != null) {
            this.#postSinglePriceSuccessEventBus.dispatch(dataObject);
        }
    };

    #onErrorNotify = (errorObject) => {
        if (this.#errorEventBus != null) {
            this.#errorEventBus.dispatch(errorObject);
        }
    };

    #postPrice = async (payload) => {
        return this.#apiManager.postPrice(payload);
    };
}
