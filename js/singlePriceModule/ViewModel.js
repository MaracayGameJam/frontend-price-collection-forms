

class ViewModel {
    
    #postSinglePriceLoadingEventBus;
    #postSinglePriceSuccessEventBus;
    
    #searchingProductLoadingEventBus;
    #searchProductSuccessfulEventBus;
    
    #requestCurrencySuccessfulEventBus;
    
    #errorEventBus;
    
    #apiManager;

    constructor(apiManager) {
        this.#apiManager = apiManager;
    }

    /* 
    ================================================
    post single price methods related
    ================================================
    */
    setPostSinglePriceLoadingEventBus(loadingEventBus) {
        this.#postSinglePriceLoadingEventBus = loadingEventBus;
    }

    setPostSinglePriceSuccessEventBus(postSinglePriceSuccessEventBus) {
        this.#postSinglePriceSuccessEventBus = postSinglePriceSuccessEventBus;
    }

    setErrorEventBus(errorEventBus) {
        this.#errorEventBus = errorEventBus;
    }

    subscribeOnLoadingListener = (func) => {
        if (this.#postSinglePriceLoadingEventBus != null) {
            this.#postSinglePriceLoadingEventBus.subscribe(func);
        }
    };

    unsubscribeOnLoadingListener = (func) => {
        if (this.#postSinglePriceLoadingEventBus != null) {
            this.#postSinglePriceLoadingEventBus.unsubscribe(func);
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

    subscribeOnPostSinglePriceListener = (func) => {
        if (this.#postSinglePriceSuccessEventBus != null) {
            this.#postSinglePriceSuccessEventBus.subscribe(func);
        }
    };

    unsubscribeOnPostSinglePriceListener = (func) => {
        if (this.#postSinglePriceSuccessEventBus != null) {
            this.#postSinglePriceSuccessEventBus.unsubscribe(func);
        }
    };

    /* 
    ================================================
    get currencies methods related
    ================================================
    */
    setRequestCurrencySuccessEventBus(requestCurrencySuccessfulEventBus) {
        this.#requestCurrencySuccessfulEventBus = requestCurrencySuccessfulEventBus;
    }

    subscribeOnRequestCurrencyListener = (func) => {
        if (this.#requestCurrencySuccessfulEventBus != null) {
            this.#requestCurrencySuccessfulEventBus.subscribe(func);
        }
    };

    unsubscribeOnRequestCurrencyListener = (func) => {
        if (this.#requestCurrencySuccessfulEventBus != null) {
            this.#requestCurrencySuccessfulEventBus.unsubscribe(func);
        }
    };

    /* 
    ================================================
    search products methods related
    ================================================
    */
    
    
    setSearchingProductLoadingEventBus(eventBus) {
        this.#searchingProductLoadingEventBus = eventBus;
    }
    
    subscribeOnSearchProductLoadingListener = (func) => {
        if (this.#searchingProductLoadingEventBus != null) {
            this.#searchingProductLoadingEventBus.subscribe(func);
        }
    };

    unsubscribeOnSearchProductLoadingListener = (func) => {
        if (this.#searchingProductLoadingEventBus != null) {
            this.#searchingProductLoadingEventBus.unsubscribe(func);
        }
    };

    setSearchProductSuccessfulEventBus(eventBus) {
        this.#searchProductSuccessfulEventBus = eventBus;
    }

    subscribeOnSearchProductListener = (func) => {
        if (this.#searchProductSuccessfulEventBus != null) {
            this.#searchProductSuccessfulEventBus.subscribe(func);
        }
    };

    unsubscribeOnSearchProductListener = (func) => {
        if (this.#searchProductSuccessfulEventBus != null) {
            this.#searchProductSuccessfulEventBus.unsubscribe(func);
        }
    };

    searchProduct = (text) => {
        
        if(text != null) {
            text = String(text).trim();
            if(text.length > 0) {
                this.#searchingProductLoadingNotify(true);
                this.#apiManager.searchProductsByTextMatch({"search":text})
                    .then((res) => {
                
                        this.#onSearchProductSuccessfulNotify(res.data);
                        //nextResquest
                    })
                    .catch((err) => {
                        console.error(err);
                        
                    })
                    .finally(() => {
                        this.#searchingProductLoadingNotify(false);
                    }); 
                
            }
        }
    }

    requestInitialData = () => {
        
        this.#postSinglePriceLoadingNotify(true);
        this.#resquestCurrencies()
            .then((res) => {
                
                this.#onRequestCurrencyNotify(res.data);
                //nextResquest
            })
            .catch((err) => {
                console.error(err);
                
            })
            .finally(() => {
                this.#postSinglePriceLoadingNotify(false);
            }); 
    }

    
    requestCategories = () => {

    }

    requestProducts = () => {

    }

    requestCurrencies = () => {
        
    }

    processSinglePrice = (dataView) => {

        this.#postSinglePriceLoadingNotify(true);
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
                this.#postSinglePriceLoadingNotify(false);
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
    
    #searchingProductLoadingNotify = (loading) => {
        if (this.#postSinglePriceLoadingEventBus != null) {
            this.#searchingProductLoadingEventBus.dispatch(loading);
        }
    }
    
    #onSearchProductSuccessfulNotify = (dataObject) => {
        if (this.#searchProductSuccessfulEventBus != null) {
            this.#searchProductSuccessfulEventBus.dispatch(dataObject);
        }
    };

    #postSinglePriceLoadingNotify = (loading) => {
        if (this.#postSinglePriceLoadingEventBus != null) {
            this.#postSinglePriceLoadingEventBus.dispatch(loading);
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

    #onRequestCurrencyNotify = (dataObject) => {
        if (this.#requestCurrencySuccessfulEventBus != null) {
            this.#requestCurrencySuccessfulEventBus.dispatch(dataObject);
        }
    };

    #resquestCurrencies = async (payload) => {
        return this.#apiManager.getCurrencies();
    }

    #postPrice = async (payload) => {
        return this.#apiManager.postPrice(payload);
    };
}
