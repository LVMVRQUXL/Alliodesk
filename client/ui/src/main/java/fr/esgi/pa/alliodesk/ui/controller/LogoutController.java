package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.LogoutRequest;

public class LogoutController {

    public void logoutUser() {
        LogoutRequest lr = new LogoutRequest();
        int status_code = lr.requestToServe();
        switch (status_code){
            case 200:
                System.out.println("Ok");
                break;
            case 404:
                System.out.println("Can't find user");
                break;
            case 400:
                System.out.println("Invalid id and/or token session");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                break;
            default:
                System.out.println("status_code = "+status_code);
                break;
        }
    }
}
