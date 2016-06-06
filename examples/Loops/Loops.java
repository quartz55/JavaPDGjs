public class Loops {
    public int loopsTest() {
        int b = 0;
        for (int i = 0; i < 10; i = i + 1) {
            int a = i;
            while (a < 15) a++;

            while (a >= 15) a /= 2;

            b += a;
        }

        return b;
    }
}
