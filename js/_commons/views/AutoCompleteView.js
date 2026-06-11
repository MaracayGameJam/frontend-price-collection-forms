

class AutoCompleteView {

    // DOM references
    #inputEl;
    #dropdownEl;
    #spinnerEl;

    // Configuration
    #renderFn;
    #hasCustomRenderFn;
    #debounceDelay;

    // Internal state
    #currentResults = [];
    #searchTimeout = null;
    #highlightedIndex = -1;
    #suppressNextInput = false;
    #destroyed = false;

    // EventBus instances
    #textChangeEventBus;
    #selectItemEventBus;

    //
    #keyDownFunctionMap = null;

    constructor(config) {
        
        if (!config || !config.inputEl) {
            throw new Error("AutoCompleteView: 'inputEl' is required in configuration.");
        }
        if (!config.dropdownEl) {
            throw new Error("AutoCompleteView: 'dropdownEl' is required in configuration.");
        }
        if (!config.spinnerEl) {
            throw new Error("AutoCompleteView: 'spinnerEl' is required in configuration.");
        }

        this.#inputEl = config.inputEl;
        this.#dropdownEl = config.dropdownEl;
        this.#spinnerEl = config.spinnerEl;

        this.#debounceDelay = config.debounceDelay != null ? config.debounceDelay: 300;

        this.#hasCustomRenderFn = !!config.renderFn;
        this.#renderFn = config.renderFn || ((item, index) => item.name);

        this.#initKeyDownFunctionMap();
        this.#textChangeEventBus = new EventBus(new Set());
        this.#selectItemEventBus = new EventBus(new Set());

        this.#inputEl.addEventListener("input", this.#onInputHandler);
        this.#inputEl.addEventListener("keydown", this.#onKeydownHandler);
        this.#inputEl.addEventListener("focus", this.#onFocusHandler);
        this.#inputEl.addEventListener("blur", this.#onBlurHandler);
        document.addEventListener("mousedown", this.#onClickOutsideHandler);
    }

    #initKeyDownFunctionMap = () => {
        
        if(this.#keyDownFunctionMap == null) {

            this.#keyDownFunctionMap = {
                "ArrowDown":this.#keyArrowDownHandler,
                "ArrowUp": this.#keyArrowUpHandler,
                "Enter": this.#keyEnterHandler,
                "Escape":this.#keyEscapeHandler
            };
        }
    }
    
    #hideDropdown = () => {
        this.#dropdownEl.setAttribute("hidden", "");
        this.#inputEl.setAttribute("aria-expanded", "false");
        this.#highlightedIndex = -1;
        this.#inputEl.removeAttribute("aria-activedescendant");
    }

    #showDropdown = () =>{
        this.#dropdownEl.removeAttribute("hidden");
        this.#inputEl.setAttribute("aria-expanded", "true");
    }

    #selectItem = (item) => {
        this.#suppressNextInput = true;
        this.#selectItemEventBus.dispatch(item);
        this.#hideDropdown();
    }

    #updateHighlight = (items, prevIndex, newIndex) => {
        
        if (prevIndex >= 0 && prevIndex < items.length) {
            items[prevIndex].classList.remove("autocomplete-dropdown__item--highlighted");
        }
        
        if (newIndex >= 0 && newIndex < items.length) {
            items[newIndex].classList.add("autocomplete-dropdown__item--highlighted");
            this.#inputEl.setAttribute("aria-activedescendant", `${this.#inputEl.id}-option-${newIndex}`);
        } 
        else {
            this.#inputEl.removeAttribute("aria-activedescendant");
        }
    }

    #onFocusHandler = () => {
        
        if (this.#inputEl.value.trim() !== "" && this.#currentResults.length > 0) {
            this.#showDropdown();
        }
    }

    #onClickOutsideHandler = (event) => {

        if (!this.#inputEl.contains(event.target) && !this.#dropdownEl.contains(event.target)) {
            this.#hideDropdown();
        }
    }

    #onBlurHandler = (event) => {
        
        setTimeout(() => {

            if (!this.#dropdownEl.contains(document.activeElement)) {
                this.#hideDropdown();
            }

        }, 100);
    }

    #onInputHandler = (event) => {

        clearTimeout(this.#searchTimeout);

        if (this.#suppressNextInput) {
            this.#suppressNextInput = false;
            return;
        }

        const value = event.target.value.trim();

        if (value === "") {
            this.#currentResults = [];
            this.#hideDropdown();
            return;
        }

        this.#searchTimeout = setTimeout(() => {
            this.#textChangeEventBus.dispatch(value);
        }, this.#debounceDelay);
    }

    #onKeydownHandler = (event) => {

        const isDropdownVisible = !this.#dropdownEl.hasAttribute("hidden");
        if (!isDropdownVisible) 
            return;

        const items = this.#dropdownEl.querySelectorAll(".autocomplete-dropdown__item");
        
        if (items.length > 0) {
            
            const func = this.#keyDownFunctionMap[event.key];
            if(func) {
                func(event)
            }
        }
        
    }

    #keyArrowUpHandler = (event) => {
        
        event.preventDefault();
        const items = this.#dropdownEl.querySelectorAll(".autocomplete-dropdown__item");
        const prevIndex = this.#highlightedIndex;
        if (this.#highlightedIndex > 0) {
            this.#highlightedIndex--;
        }
        this.#updateHighlight(items, prevIndex, this.#highlightedIndex);
    }

    #keyArrowDownHandler = (event) => {
        
        event.preventDefault();
        const items = this.#dropdownEl.querySelectorAll(".autocomplete-dropdown__item");
        const lastItem = items.length - 1;
        const prevIndex = this.#highlightedIndex;
        if (this.#highlightedIndex < lastItem) {
            this.#highlightedIndex++;
        }
        this.#updateHighlight(items, prevIndex, this.#highlightedIndex);
    }

    #keyEnterHandler = (event) => {
        
        const items = this.#dropdownEl.querySelectorAll(".autocomplete-dropdown__item");
        if (this.#highlightedIndex >= 0 && this.#highlightedIndex <  items.length ) {
            event.preventDefault();
            this.#selectItem(this.#currentResults[this.#highlightedIndex]);
        }
    }

    #keyEscapeHandler = (event) => {
        
        event.preventDefault();
        this.#hideDropdown();
    }

    setItemList = (items) => {

        if (this.#destroyed) return;

        this.#currentResults = items;
        this.#dropdownEl.innerHTML = "";
        this.#highlightedIndex = -1;
        this.#inputEl.removeAttribute("aria-activedescendant");

        if (items.length === 0) {
            this.#hideDropdown();
            return;
        }

        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.id = `${this.#inputEl.id}-option-${index}`;
            li.setAttribute("role", "option");
            li.classList.add("autocomplete-dropdown__item");

            if (this.#hasCustomRenderFn) {
                try {
                    li.innerHTML = this.#renderFn(item, index);
                } catch (error) {
                    li.textContent = item.name;
                    console.warn("AutoCompleteView: renderFn threw an error, falling back to item.name.", error);
                }
            } else {
                li.textContent = item.name;
            }

            li.addEventListener("mousedown", (event) => {
                event.preventDefault();
                this.#selectItem(item);
            });

            this.#dropdownEl.appendChild(li);
        });

        this.#showDropdown();
    }

    showLoading = (show) => {
        if (this.#destroyed) return;
        this.#spinnerEl.classList.toggle("is-active", show);
        this.#inputEl.setAttribute("aria-busy", `${show}`);
    }

    destroy = () => {

        if (this.#destroyed) 
            return;
        
        this.#destroyed = true;

        // Remove event listeners from Host_Input
        this.#inputEl.removeEventListener("input", this.#onInputHandler);
        this.#inputEl.removeEventListener("keydown", this.#onKeydownHandler);
        this.#inputEl.removeEventListener("focus", this.#onFocusHandler);
        this.#inputEl.removeEventListener("blur", this.#onBlurHandler);

        // Remove click-outside listener from document
        document.removeEventListener("mousedown", this.#onClickOutsideHandler);

        // Clear pending debounce timer
        clearTimeout(this.#searchTimeout);
        this.#searchTimeout = null;

        // Hide dropdown and clear its content
        this.#hideDropdown();
        this.#dropdownEl.innerHTML = "";

        // Clear cached results
        this.#currentResults = [];

        // Clear EventBus subscriptions
        this.#textChangeEventBus.unsubscribeAll();
        this.#selectItemEventBus.unsubscribeAll();
    }

    subscribeOnTextChangeListener = (func) => {
        if (this.#destroyed) return;
        this.#textChangeEventBus.subscribe(func);
    }

    unsubscribeOnTextChangeListener = (func) => {
        if (this.#destroyed) return;
        this.#textChangeEventBus.unsubscribe(func);
    }

    subscribeOnSelectItemListener = (func) => {
        if (this.#destroyed) return;
        this.#selectItemEventBus.subscribe(func);
    }

    unsubscribeOnSelectItemListener = (func) => {
        if (this.#destroyed) return;
        this.#selectItemEventBus.unsubscribe(func);
    }
}
