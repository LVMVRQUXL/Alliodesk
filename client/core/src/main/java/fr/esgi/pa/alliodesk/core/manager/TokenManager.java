package fr.esgi.pa.alliodesk.core.manager;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class TokenManager {
    public static String getTokenFromFile() throws IOException {
        final File file = new File("Token.txt");

        if (!file.exists()) return "";

        final Scanner scanner = new Scanner(file);
        final String content = scanner.nextLine();
        scanner.close();

        return content;
    }

    public static void saveTokenInFile(final String token) throws IOException {
        final File file = new File("Token.txt");
        if (!file.exists()) {
            final BufferedWriter writer = new BufferedWriter(new FileWriter(file.getPath()));
            writer.write(token);
            writer.close();
        }
    }

    public static void deleteTokenFile(){
        File file = new File("Token.txt");
        if(file.exists())
            file.delete();
    }
}
