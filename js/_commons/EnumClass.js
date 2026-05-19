

class EnumClass {

    
    #enumKeyName;
    
    static #enumValuesByClazz = new WeakMap();
    
    constructor() {
    }

    name = () => {
        if (this.#enumKeyName == null) {
            EnumClass.initializeEnumKeys(this.constructor);
        }
        return this.#enumKeyName;
    }
    
    static values ()  {
        
        let values = EnumClass.#enumValuesByClazz.get(this);
        if(values != null) {
            return values;
        }
        EnumClass.initializeEnumKeys(this);
        values = EnumClass.#enumValuesByClazz.get(this);
        return values;
    }

    static initializeEnumKeys(clazz) {

        const typeFunction = "function";
        if(typeof clazz === typeFunction && (
            clazz === EnumClass ||
            clazz.prototype instanceof EnumClass
        ))
        
        {

            const values = EnumClass.#enumValuesByClazz.get(clazz);
            if(values == null) {
                
                const ownlist = [];
                for (const key of Object.getOwnPropertyNames(clazz)) {
                    const candidate = clazz[key];
                    if (candidate instanceof clazz) {
                        candidate.#enumKeyName = key;
                        ownlist.push(candidate);
                    }
                }

                const parentClazz = Object.getPrototypeOf(clazz);
                let parentPropertiesList = [];
                //init parent enum
                if( typeof parentClazz === typeFunction
                    && (
                        parentClazz === EnumClass ||
                        parentClazz.prototype instanceof EnumClass
                    )
                ) {
                    EnumClass.initializeEnumKeys(parentClazz);
                    parentPropertiesList = EnumClass.#enumValuesByClazz.get(parentClazz) || [];
                }

                const fullPropertySet = new Set([...parentPropertiesList]);
                for(const item of ownlist) {
                    fullPropertySet.add(item);
                }
                
                const frozenList = Object.freeze(Array.from(fullPropertySet));
                EnumClass.#enumValuesByClazz.set(clazz, frozenList);
            }
        }

    }
}