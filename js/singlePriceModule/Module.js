class Module {
    
    constructor() {}

    init = (rootView, apiManager) => {
        
        const loadingEventBus = new EventBus(new Set());
        const postSinglePriceSuccessEventBus = new EventBus(new Set());
        const errorEventBus = new EventBus(new Set());
        const requestCurrencySuccessfulEventBus = new EventBus(new Set());

        const bindView = new BindView(rootView);
        const viewModel = new ViewModel(apiManager);
        viewModel.setLoadingEventBus(loadingEventBus);
        viewModel.setPostSinglePriceSuccessEventBus(postSinglePriceSuccessEventBus);
        viewModel.setErrorEventBus(errorEventBus);
        viewModel.setRequestCurrencySuccessEventBus(requestCurrencySuccessfulEventBus);
        
        new View(bindView, viewModel);
    };
}