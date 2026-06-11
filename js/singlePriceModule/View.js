


class View {
  
    #bindings;
    #viewModel;
    #productAutoCompleteView;

    constructor(bindingView, viewModel) {
        
        this.#viewModel = viewModel;
        this.#bindings = bindingView.getBinding();

        
        this.#productAutoCompleteView = new AutoCompleteView({
            inputEl: this.#bindings.product,
            dropdownEl: this.#bindings.productDropdown,
            spinnerEl: this.#bindings.productSpinner,
            debounceDelay: 300
        });

        
        this.#productAutoCompleteView.subscribeOnTextChangeListener(this.#onTypeProductName);

        
        this.#productAutoCompleteView.subscribeOnSelectItemListener((product) => {
            this.#bindings.product.value = product.name;
            this.#bindings.product.setAttribute("data-product-id", product.id);
        });

        // Form submission
        const sendFunction = (event) => {
            event.preventDefault();
            this.onPressSendButtonListener();
        };

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
        const productId = this.#bindings.product.getAttribute("data-product-id");
        
        this.#viewModel.processSinglePrice({
            "currencyId": currencySelected.value,
            "productId": productId
        });
    };

    #onTypeProductName = (text) => {
        this.#viewModel.searchProduct(text);
    }

    #showLoadingSearchingProduct = (show) => {
        this.#productAutoCompleteView.showLoading(show);
    }
   
    #onSearchProductsSuccessful = (products) => {
        this.#productAutoCompleteView.setItemList(products);
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
