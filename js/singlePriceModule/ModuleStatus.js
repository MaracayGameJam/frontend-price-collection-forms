

class ModuleStatus extends AppCommonStatus {

    constructor(status_name,status_message){
        super(status_name,status_message);
    }

    
    // ======================================
    static MODULE_EXAMPLE_STATUS = ModuleStatus.buildStatus("module_example","module_example");
    static MODULE_OTHER_EXAMPLE_STATUS = ModuleStatus.buildStatus("module_o_example","module_example");
    // ======================================

}