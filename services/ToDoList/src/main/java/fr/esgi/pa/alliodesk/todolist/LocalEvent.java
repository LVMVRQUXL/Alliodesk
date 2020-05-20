package fr.esgi.pa.alliodesk.todolist;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import javafx.collections.ObservableList;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

public class LocalEvent {
    private String description;
    private LocalDate date;
    private static String toDoList_file_location = "./todolist.json";
    private static Gson gson = new Gson();

    public LocalEvent(String description, LocalDate date) {
        this.description = description;
        this.date = date;
    }

    public static void todolistWriteToFile(ObservableList<LocalEvent> myData) {
        File toDoFile = new File(toDoList_file_location);
        if (!toDoFile.exists()) {
            try {
                File directory = new File(toDoFile.getParent());
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                toDoFile.createNewFile();
            } catch (IOException e) {
                System.out.println(e.toString());
            }
        }

        try {
            FileWriter todoWriter = new FileWriter(toDoFile.getAbsoluteFile());
            // Writes text to a character-output stream
            gson.toJson(myData, todoWriter);
            todoWriter.flush();
            todoWriter.close();

            System.out.println("Todo data saved at file location: " + toDoList_file_location + " Data: " + "\n");
        } catch (IOException e) {
            System.out.println("Hmm.. Got an error while saving Todo data to file " + e.toString());
        }
    }

    public static LocalEvent[] todolistReadFromFile() {
        File toDoFile = new File(toDoList_file_location);
        if (!toDoFile.exists()) {
            System.out.println(" Save file doesn't exist");
            return null;
        }
        LocalEvent[] todos = null;
        InputStreamReader isReader;
        try {
            isReader = new InputStreamReader(new FileInputStream(toDoFile), StandardCharsets.UTF_8);

            JsonReader myReader = new JsonReader(isReader);
            todos = gson.fromJson(myReader, LocalEvent[].class);

        } catch (Exception e) {
            System.out.println("error load cache from file " + e.toString());
        }
        return todos;
    }

    public static void clearFile(){
        File toDoFile = new File(toDoList_file_location);
        if(!toDoFile.exists()){
            System.out.println(" Save file doesn't exist");
        }else {
            toDoFile.delete();
        }
    }

    @Override
    public String toString() {
        return date.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL)) + ": " + description;
    }

}
