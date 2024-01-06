module org.group17.pos {
    requires javafx.controls;
    requires javafx.fxml;
    requires de.jensd.fx.glyphs.fontawesome;
    requires java.sql;
    requires org.xerial.sqlitejdbc;
    requires com.google.gson;


    opens org.group17.pos to javafx.fxml;
    exports org.group17.pos;
    exports org.group17.pos.controllers;
    exports org.group17.pos.models;
    exports org.group17.pos.views;
    exports org.group17.pos.services;
    exports org.group17.pos.utils;

}