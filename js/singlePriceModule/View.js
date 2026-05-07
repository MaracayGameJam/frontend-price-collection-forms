

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

        const form = this.#bindings.submitButton.form;
        if (form) {
            form.addEventListener("submit", sendFunction);
        } 
        else {
            this.#bindings.submitButton.addEventListener("click", sendFunction);
        }
        
        this.#viewModel.subscribeOnLoadingListener(this.#showLoading);
        this.#viewModel.subscribeOnRequestCurrencyListener(this.#onRequestCurrencySuccessfulListener);
        this.#viewModel.subscribeOnPostSinglePriceListener(this.#onPostSinglePriceSuccessListener);
        this.#viewModel.subscribeOnErrorListener(this.#onErrorListener);
        this.#showLoading(false);

        this.#viewModel.requestInitialData();
    }

    onPressSendButtonListener = () => {
        this.#viewModel.processSinglePrice({});
    };

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

    #onRequestCurrencySuccessfulListener = (dataObject) => {
        console.log(dataObject);
    };
}
