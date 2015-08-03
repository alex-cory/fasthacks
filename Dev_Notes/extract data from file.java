import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

/**
 * EXTRACT DATA FROM FILE:
 * Pulls the data out of a file.txt and makes it accessible
 * as a string.
 */
public String extractData(String fileName) {

    // Grabbing the contents of OldMacDonald.txt and storing them in an object.
    BufferedReader reader = null;

        try {
            File file = new File(fileName);
        reader = new BufferedReader(new FileReader(file));

        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
            data = line;
        }

    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        try {
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    return data;
}