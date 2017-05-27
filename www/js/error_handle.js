function get_error_info(error_info) {
    switch (error_info) {
        //normal
    case "ERROR_NOT_LOGIN":
        return "Please log in frist";
        //normal

        //login
    case "ERROR_EMAIL_ALREADY_HAVE":
        return "Email already exist!";
    case "ERROR_NO_ENOUGH_INFO":
        return "Please complet all the information necessary.";
    case "ERROR_CANT_FIND_USER":
        return "Email adresse or password wrong";
    case "ERROR_WRONG_PASSWORD":
        return "Email adresse or password wrong";
    case "ERROR_CREAT_USER_FAILED":
        return "Creat new user fail, please check your informtion";
    case "ERROR_CHECK_BOOT":
        return "Robot is not allowed";
        //login

        //import
    case "ERROR_UPLOAD_FILE":
        return "Failed to unload file, please try again.";
    case "ERROR_FILE_TYPE_ERROR":
        return "Only accept .csv or .xlsx file!";
    case "ERROR_FILE_UPLOAD_ATTACK":
        return "Suspicious file detected.";
    case "ERROR_CANT_WRITEM":
        return "File written access bloqued, please open its right";
    case "ERROR_CSV_FORMAT_ERROR":
        return "csv or xlsx format wrong, please try again.";
        //import

        //get one cursus and detail
    case "ERROR_ONLY_ACCEPT_JSON_FORMAT":
        return "Only compatibale with JSON format.";
    case "ERROR_NO_AUTH":
        return "Request denied.";
    case "ERROR_CANT_FIND_CID":
        return "CID not found.";
        //get one cursus and detail

        //cursus tables
    case "ERROR_NO_ENOUGH_INFO":
        return "Please entre all search key."
        //cursus tables

    default:
        return "Unknown error info.";
    }
}
