package fr.esgi.pa.alliodesk.todolist;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

public class LocalEvent {
    private String description;
    private LocalDate date;

    public LocalEvent(String description, LocalDate date) {
        this.description = description;
        this.date = date;
    }

    @Override
    public String toString() {
        return date.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.FULL)) +": "+description;
    }

}
