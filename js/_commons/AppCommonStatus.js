


class AppCommonStatus extends AppCommonStatusBase {

    
    constructor(status_name,status_message){
        super(status_name,status_message);
    }

    static OK = AppCommonStatus.buildStatus("OK","OK");

    
}

