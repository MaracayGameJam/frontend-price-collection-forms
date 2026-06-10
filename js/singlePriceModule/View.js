

class View {
  
    #bindings;
    #viewModel;
    #currentProducts = [];
    #searchTimeout = null;
    #highlightedIndex = -1;

    constructor(bindingView, viewModel) {
        
        this.#viewModel = viewModel;
        this.#bindings = bindingView.getBinding();

        const sendFunction = (event) => {
            event.preventDefault();
            this.onPressSendButtonListener();
        };

        this.#bindings.product.addEventListener("input", this.#onTypeProductName);
        this.#bindings.product.addEventListener("keydown", this.#onKeydownHandler);
        this.#bindings.product.addEventListener("focus", this.#onFocusHandler);
        this.#bindings.product.addEventListener("blur", this.#onBlurHandler);
        this.#bindings.rootDocument.addEventListener("mousedown", this.#onClickOutsideHandler);

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

    #onTypeProductName = (event) => {
        clearTimeout(this.#searchTimeout);
        this.#searchTimeout = setTimeout(() => {
            this.#viewModel.searchProduct(event.target.value);
        }, 300);
    }

    #onFocusHandler = () => {
        if (this.#bindings.product.value.trim() !== "" && this.#currentProducts.length > 0) {
            this.#showDropdown();
        }
    }

    #onClickOutsideHandler = (event) => {
        const dropdown = this.#bindings.productDropdown;
        const input = this.#bindings.product;
        if (!input.contains(event.target) && !dropdown.contains(event.target)) {
            this.#hideDropdown();
        }
    }

    #onBlurHandler = (event) => {
        const dropdown = this.#bindings.productDropdown;
        const rootDoc = this.#bindings.rootDocument;
        setTimeout(() => {
            if (!dropdown.contains(rootDoc.activeElement)) {
                this.#hideDropdown();
            }
        }, 100);
    }

    #onKeydownHandler = (event) => {
        const dropdown = this.#bindings.productDropdown;
        const isDropdownVisible = !dropdown.hasAttribute("hidden");

        if (!isDropdownVisible) {
            return;
        }

        const items = dropdown.querySelectorAll(".autocomplete-dropdown__item");
        const itemCount = items.length;

        if (itemCount === 0) {
            return;
        }

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const prevIndex = this.#highlightedIndex;
                if (this.#highlightedIndex < itemCount - 1) {
                    this.#highlightedIndex++;
                }
                this.#updateHighlight(items, prevIndex, this.#highlightedIndex);
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prevIndex = this.#highlightedIndex;
                if (this.#highlightedIndex > 0) {
                    this.#highlightedIndex--;
                }
                this.#updateHighlight(items, prevIndex, this.#highlightedIndex);
                break;
            }
            case "Enter": {
                if (this.#highlightedIndex >= 0 && this.#highlightedIndex < itemCount) {
                    event.preventDefault();
                    const selectedProduct = this.#currentProducts[this.#highlightedIndex];
                    this.#onProductSelected(selectedProduct);
                }
                break;
            }
            case "Escape": {
                event.preventDefault();
                this.#hideDropdown();
                break;
            }
        }
    }

    #updateHighlight = (items, prevIndex, newIndex) => {
        if (prevIndex >= 0 && prevIndex < items.length) {
            items[prevIndex].classList.remove("autocomplete-dropdown__item--highlighted");
        }
        if (newIndex >= 0 && newIndex < items.length) {
            items[newIndex].classList.add("autocomplete-dropdown__item--highlighted");
            this.#bindings.product.setAttribute("aria-activedescendant", `product-option-${newIndex}`);
        } else {
            this.#bindings.product.removeAttribute("aria-activedescendant");
        }
    }

    #onProductSelected = (product) => {
        this.#bindings.product.value = product.name;
        this.#bindings.product.setAttribute("data-product-id", product.id);
        this.#hideDropdown();
    }

    #showLoadingSearchingProduct = (show) => {
        const spinner = this.#bindings.productSpinner;
        spinner.classList.toggle("is-active", show);
        this.#bindings.product.setAttribute("aria-busy", `${show}`);
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

    #showDropdown = () => {
        this.#bindings.productDropdown.removeAttribute("hidden");
        this.#bindings.product.setAttribute("aria-expanded", "true");
    }

    #hideDropdown = () => {
        this.#bindings.productDropdown.setAttribute("hidden", "");
        this.#bindings.product.setAttribute("aria-expanded", "false");
        this.#highlightedIndex = -1;
        this.#bindings.product.removeAttribute("aria-activedescendant");
    }

    #onSearchProductsSuccessful = (products) => {
        this.#currentProducts = products;
        this.#highlightedIndex = -1;
        this.#bindings.product.removeAttribute("aria-activedescendant");
        const dropdown = this.#bindings.productDropdown;
        dropdown.innerHTML = "";

        if (products.length < 1) {
            this.#hideDropdown();
        } 
        else {
            products.forEach((product, index) => {
                const li = document.createElement("li");
                li.setAttribute("id", `product-option-${index}`);
                li.setAttribute("role", "option");
                li.setAttribute("data-product-id", product.id);
                li.classList.add("autocomplete-dropdown__item");
                li.textContent = product.name;
                dropdown.appendChild(li);
            });
            this.#showDropdown();
        }
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
