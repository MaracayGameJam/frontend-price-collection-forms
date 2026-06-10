

class View {
  
    #bindings;
    #viewModel;

    constructor(bindingView, viewModel) {
        
        this.#viewModel = viewModel;
        this.#bindings = bindingView.getBinding();

        const sendFunction = (event) => {
            event.preventDefault();
            this.onPressSendButtonListener();
        };

        this.#bindings.product.addEventListener("input",this.#onTypeProductName);

        const form = this.#bindings.submitButton.form;
        if (form) {
            form.addEventListener("submit", sendFunction);
        } 
        else {
            this.#bindings.submitButton.addEventListener("click", sendFunction);
        }
        
        this.#viewModel.subscribeOnSearchProductLoadingListener(this.#showLoadingSearchingProduct);
        this.#viewModel.subscribeOnSearchProductListener(this.#onSearchProductsSuccessful);
        this.#viewModel.subscribeOnLoadingListener(this.#showLoading);
        this.#viewModel.subscribeOnRequestCurrencyListener(this.#onRequestCurrencySuccessfulListener);
        this.#viewModel.subscribeOnPostSinglePriceListener(this.#onPostSinglePriceSuccessListener);
        this.#viewModel.subscribeOnErrorListener(this.#onErrorListener);
        this.#showLoadingSearchingProduct(false);
        this.#showLoading(false);

        this.#viewModel.requestInitialData();
    }

    onPressSendButtonListener = () => {
        
        const currenciesView = this.#bindings.currency;
        const currencySelected = currenciesView.options[currenciesView.selectedIndex];
        
        this.#viewModel.processSinglePrice({
            "currencyId":currencySelected.value
        });
    };

    #onTypeProductName = (event) => {
        this.#viewModel.searchProduct(event.target.value);
    }

    #showLoadingSearchingProduct = (show) => {
        console.log(`seaching products: ${show}`)
    }

    #showLoading = (show) => {
        const el = this.#bindings.loadingWrapper;
        el.classList.toggle("is-visible", show);
        el.setAttribute("aria-hidden", `${(!show)}`);
    };

    #onErrorListener = (errorObject) => {
        console.error(errorObject);
    };

    #onPostSinglePriceSuccessListener = (dataObject) => {
        console.log(dataObject);
    };

    #onSearchProductsSuccessful = (products) => {
        console.log(products)
    }

    #onRequestCurrencySuccessfulListener = (currencies) => {
        const currencySelect = this.#bindings.currency;
        currencySelect.innerHTML = "";
        currencies.forEach((currency) => {
            const option = document.createElement("option");
            option.value = currency.id;
            option.textContent = currency.name;
            currencySelect.appendChild(option);
        });
    };

}
