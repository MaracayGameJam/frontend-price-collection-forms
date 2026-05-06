
class BindView {
  
    #binding = {};

    getBinding = () => {
      return this.#binding;
    };

    constructor(rootView) {

        this.#binding.category = rootView.getElementById("category");
        this.#binding.product = rootView.getElementById("product");
        this.#binding.presentation = rootView.getElementById("presentation");
        this.#binding.price = rootView.getElementById("price");
        this.#binding.currency = rootView.getElementById("currency");
        this.#binding.store = rootView.getElementById("store");
        this.#binding.submitButton = rootView.getElementById("submit-price-form");
        this.#binding.loadingWrapper = rootView.getElementById("loading-wrapper");
    }

}
