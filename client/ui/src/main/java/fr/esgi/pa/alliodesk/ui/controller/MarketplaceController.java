
package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.configuration.MarketplaceConfiguration;
import fr.esgi.pa.alliodesk.core.models.Service;
import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import fr.esgi.pa.alliodesk.core.request.WorkspaceRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import javafx.scene.control.MenuItem;

import static java.lang.String.format;

public class MarketplaceController {

    public static ArrayList<Service> findAllService() {
        ServiceRequest serviceRequest = new ServiceRequest("findAllService", null,null,null,null);
        int status_code = serviceRequest.requestToServe();
        switch(status_code) {
            case 200:
                System.out.println("Ok");
                return serviceRequest.getExistedService();
            case 204:
                System.out.println("No services to return");
                return new ArrayList();
            case 400:
                System.out.println("Invalid workspace id");
                return null;
            case 404:
                System.out.println("Can't find workspace from id");
                return null;
            case 500:
                System.out.println("An internal error has occurred");
                return null;
            default:
                System.out.println("status code = " + status_code);
                return null;
        }
    }

    public static void addServiceToUser(String serviceId) {
        ServiceRequest serviceRequest = new ServiceRequest("addServiceToUser", serviceId,null,null,null);
        int status_code = serviceRequest.requestToServe();
        switch(status_code) {
            case 200:
                System.out.println("Ok");
                break;
            case 400:
                System.out.println("Invalid user id or service id\n");
                break;
            case 401:
                System.out.println("Invalid user's token session\n");
                break;
            case 404:
                System.out.println("Can't find user or service from id\n");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                break;
            default:
                System.out.println("status code = " + status_code);
        }

    }

    public static void deleteServiceToUser(String serviceId) {
        ServiceRequest serviceRequest = new ServiceRequest("deleteServiceToUser", serviceId,null,null,null);
        int status_code = serviceRequest.requestToServe();
        switch(status_code) {
            case 200:
                System.out.println("Ok");
                break;
            case 400:
                System.out.println("Invalid user id or service id\n");
                break;
            case 401:
                System.out.println("Invalid user's token session\n");
                break;
            case 404:
                System.out.println("Can't find user or service from id\n");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                break;
            default:
                System.out.println("status code = " + status_code);
        }

    }

    public static void setAddItem(MenuItem mi, Service service) {
        mi.setOnAction((event) -> {
            addServiceToUser(service.getId());
            mi.setText("Delete Service");
            setDeleteItem(mi, service);
            MarketplaceConfiguration mk = new MarketplaceConfiguration(   service.getSource_url()   );
            try {
                mk.download();
            } catch (IOException e) {
                e.printStackTrace();
            }

        });
    }

    public static void setDeleteItem(MenuItem mi, Service service) {
        mi.setOnAction((event) -> {
            deleteServiceToUser(service.getId());
            try {
                Files.deleteIfExists(Path.of(format(System.getProperty("user.home")+"/Alliodesk/services/%s/%s.jar", service.getName(), service.getName())));

            } catch (IOException e) {
                e.printStackTrace();
            }
            WorkspaceRequest request = new WorkspaceRequest("findAllUserWS", null, null, null, null);
            for(String[] workspace : request.getExistedWS()) {
                WorkspaceRequest workspaceRequest =  new WorkspaceRequest("deleteServiceFromWorkspace", null, null, workspace[0], service.getId());
                final int statusCode = workspaceRequest.requestToServe();
                System.out.println(statusCode);
            }
            mi.setText("Add Service");
            setAddItem(mi, service);
        });
    }
}
