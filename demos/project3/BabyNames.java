/*
        * Created by Ryan Stoffel on 10-1-24
 *
         * Add comments that describe the overall program
 *
         * Additional Instructions (that can be removed once your solution is entered):
        *    You shouldn't use any if-else statements
        *    Put comments in your code
 *    Follow freedom of information rule specified in the Syllabus (i.e., "Discussed with: XXX",
        *       "Used Generative AI: XXX", etc.)

        * Discussed with Joey Russel, Payton Henry, and Elijah Tabor.
 */
import java.awt.*;
import java.io.*;
import java.util.Scanner;

public class BabyNames {
    //class constants for open area in graphics (Do NOT change)
    private static final Integer OPEN_AREA_WIDTH = 780;
    private static final Integer OPEN_AREA_HEIGHT = 500;

    //prompt msg class constant (Do NOT change)
    private static final String MESSAGE_PREFIX = "This program allows you to search through the\n" +
            "data from the Social Security Administration\n" +
            "to see how popular a particular name has been\n" +
            "since ";

    // class constant for meaning file (Do NOT change)
    private static final String MEANING_FILENAME = "meanings.txt";

    // class variable for name file (Change the assigned value only. Do NOT change the type or the variable name)
    // Test with both "names.txt" and "names2.txt" (Before submission, change back to "names.txt")
    private static String nameFilename = "names.txt";

    // Other class variables (Change the assigned value only. Do NOT change any of the variable types or names.)
    private static Integer startingYear = 1890;
    private static Integer decadeWidth = 60;
    private static Integer legendHeight = 30;
    // YOU ARE NOT ALLOWED TO ADD ANY OTHER CLASS VARIABLES

    public static void main(String[] args) throws FileNotFoundException {
        checkNameFile();
        String userInput = getsUserInput();
        output(userInput, nameFilename, MEANING_FILENAME);
    }

    // Checks the name file and sets the starting year, legend height and decade width based on the name file.
    // If the name file is "names.txt", the starting year is 1890, the legend height is 30 and the decade width is 60.
    // If the name file is "names2.txt", the starting year is 1863, the legend height is 20 and the decade width is 50.
    public static void checkNameFile() {
        if ("names.txt".equals(nameFilename)) {
            startingYear = 1890;
            decadeWidth = 60;
            legendHeight = 30;
        }
        if (!"names.txt".equals(nameFilename)) {
            startingYear = 1863;
            decadeWidth = 50;
            legendHeight = 20;
        }
    }

    // Gets the user input from the console and combines the name and gender strings into one
    // string so the rest of the program can use that string.
    public static String getsUserInput() {
        // Prompt the user with the starting message and explain what the program does.
        System.out.println(MESSAGE_PREFIX + startingYear);
        // Read in the user input for name and gender from console.
        System.out.println();
        Scanner console = new Scanner(System.in);
        System.out.print("Name: ");
        String name = console.next();
        System.out.print("Gender (M or F): ");
        String gender = console.next();
        String expectedGender1 = "M";
        String expectedGender2 = "F";
        // If the users enter a gender other than M or F, tell the user that it is NOT a valid gender.
        // Keep asking them for a valid gender until they enter a valid gender.
        while (!gender.equalsIgnoreCase(expectedGender1) && !gender.equalsIgnoreCase(expectedGender2)) {
            System.out.println("\"" + gender + "\" is NOT a valid gender. Please enter M or F");
            System.out.print("Gender (M or F): ");
            gender = console.next();
        }

        // Returns a new string that combines the name and gender into one, e.g "Michelle, f".
        return name + ", " + gender;
    }

    // Outputs the name and gender as well as the name popularity data and the meaning of the name to the console.
    // Also outputs the graphics if and ONLY if the name is found.
    public static void output(String userInput, String namesFile, String meaningsFile) throws FileNotFoundException {
        // Create two scanner objects to read both the names file and the meanings file.
        Scanner namesFileScanner = new Scanner(new File(namesFile));
        Scanner meaningsFileScanner = new Scanner(new File(meaningsFile));

        // inputName and inputGender are the name and gender that the user entered.
        String inputName = userInput.substring(0, userInput.indexOf(','));
        String inputGender = userInput.substring(userInput.indexOf(' ') + 1);

        String namesLine = getLine(namesFileScanner, inputName, inputGender);
        String meaningsLine = getLine(meaningsFileScanner, inputName, inputGender);
        Scanner namesLineScanner = new Scanner(namesLine);
        String nameFromNamesLine = namesLineScanner.next();
        String genderFromNamesLine = namesLineScanner.next();

        // If the name does not match, print "Name not found".
        if (!nameFromNamesLine.equalsIgnoreCase(inputName)) {
            System.out.println("\"" + inputName + "\" not found.");
        }

        if (nameFromNamesLine.equalsIgnoreCase(inputName) && genderFromNamesLine.equalsIgnoreCase(inputGender)) {
            int screenHeight = 0;
            if ("names.txt".equals(nameFilename)) {
                screenHeight = OPEN_AREA_HEIGHT + 60;
            }
            if (!"names.txt".equals(nameFilename)) {
                screenHeight = OPEN_AREA_HEIGHT + 40;
            }
            DrawingPanel panel = new DrawingPanel(780, screenHeight);
            Graphics g = panel.getGraphics();

            outPutStaticGraphics(g, screenHeight);
            outPutChangingGraphics(g, screenHeight, meaningsLine, namesLineScanner);
        }

        namesFileScanner.close();
        meaningsFileScanner.close();
    }

    // This method takes a scanner object that is reading the two different files and a name and gender
    // and returns the line that contains the name and gender, as well as the rank data.
    public static String getLine(Scanner fileScanner, String inputName, String inputGender) {
        String line = null;
        while (fileScanner.hasNextLine()) {
            line = fileScanner.nextLine();
            // This string takes exactly one line from the txt file.
            // This new scanner object takes the one line as input.
            Scanner lineScanner = new Scanner(line);

            String name = lineScanner.next();
            String gender = lineScanner.next();

            // If the userInput matches the name and gender from the line, print the whole line.
            if (name.equalsIgnoreCase(inputName) && gender.equalsIgnoreCase(inputGender)) {
                System.out.println(line);
                // Once the name is found break out of the while loop, so the method can return
                // the correct line.
                break;
            }
        }
        return line;
    }

    // Draw the graphics that don't change
    public static void outPutStaticGraphics(Graphics g, int screenSize) {
        g.setColor(Color.LIGHT_GRAY);
        g.fillRect(0, 0, OPEN_AREA_WIDTH, legendHeight);
        g.fillRect(0, screenSize - legendHeight, OPEN_AREA_WIDTH, legendHeight);

        g.setColor(Color.BLACK);
        g.drawLine(0, legendHeight, OPEN_AREA_WIDTH, legendHeight);
        g.drawLine(0, screenSize - legendHeight, OPEN_AREA_WIDTH, screenSize - legendHeight);
    }

    // Draw the graphics that change, this includes the rank data, name meaning, and the years on the legend.
    public static void outPutChangingGraphics(Graphics g, int screenSize, String meaningsLine, Scanner rank) {
        int rankFromLine;
        int xPos1 = 0;
        int yPos1 = 0;
        int barWidth = decadeWidth / 2;
        int barHeight = 0;
        int decade = 0;

        while (rank.hasNextInt()) {
            rankFromLine = rank.nextInt();
            if (rankFromLine == 0) {
                yPos1 = screenSize - legendHeight;
                barHeight = 0;
            }
            if (!(rankFromLine == 0)) {
                yPos1 = (rankFromLine / 2) + legendHeight;
                barHeight = OPEN_AREA_HEIGHT - (rankFromLine / 2);
            }
            g.setColor(Color.GREEN);
            g.fillRect(xPos1, yPos1, barWidth, barHeight);
            g.setColor(Color.BLACK);
            g.drawString(Integer.toString(rankFromLine), xPos1, yPos1);
            xPos1 += decadeWidth;
        }

        g.setColor(Color.BLACK);
        g.drawString(meaningsLine, 0, 16);
        if ("names.txt".equals(nameFilename)) {
            decade = 14;
        }
        if (!"names.txt".equals(nameFilename)) {
            decade = 8;
        }
        for (int i = 0; i < decade; i++) {
            int xPos2 = decadeWidth * i;
            int yPos2 = screenSize - 8;
            int year = startingYear + i * 10;
            g.setColor(Color.BLACK);
            g.drawString(Integer.toString(year), xPos2, yPos2);
        }
    }
}