package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.UserDeleteRequest;

public class UserDeleteController {

    public void deleteUser() {
        UserDeleteRequest udr = new UserDeleteRequest();
        int status_code = udr.requestToServe();
        switch (status_code){
            case 200:
                System.out.println("Ok");
                break;
            case 404:
                System.out.println("Can't find user");
                break;
            case 400:
                System.out.println("Invalid id");
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
