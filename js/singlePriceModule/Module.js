class Module {
    
    constructor() {}

    init = (rootView, apiManager) => {
        
        const postSinglePriceLoadingEventBus = new EventBus(new Set());
        const postSinglePriceSuccessEventBus = new EventBus(new Set());
        const errorEventBus = new EventBus(new Set());
        const requestCurrencySuccessfulEventBus = new EventBus(new Set());

        const searchProductSuccessfulEventBust = new EventBus(new Set());
        const searchProductLoadingEventBust = new EventBus(new Set());

        const bindView = new BindView(rootView);
        const viewModel = new ViewModel(apiManager);
        viewModel.setSearchingProductLoadingEventBus(searchProductLoadingEventBust);
        viewModel.setSearchProductSuccessfulEventBus(searchProductSuccessfulEventBust);
        viewModel.setPostSinglePriceLoadingEventBus(postSinglePriceLoadingEventBus);
        viewModel.setPostSinglePriceSuccessEventBus(postSinglePriceSuccessEventBus);
        viewModel.setErrorEventBus(errorEventBus);
        viewModel.setRequestCurrencySuccessEventBus(requestCurrencySuccessfulEventBus);
        
        new View(bindView, viewModel);
    };
}