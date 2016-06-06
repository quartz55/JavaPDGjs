public class MultipleFunctions {
    public void sum() {
        int i,sum;
        sum = 0;
        i = 1;
        while (i < 11) {
            sum = sum+i;
            i = i+1;
        }
    }

    public int sum2() {
        int i,sum;
        sum = 0;
        i = 10;

        if (i >= 15) {
            sum += 15;
        }
        else if (i >= 10) {
            sum += 10;
        }
        else {
            return sum;
        }
    }

    public int sum3() {
        int sum = 0;

        for (int i = 0; i < 10; ++i) {
            sum += 10;
        }

        return sum;
    }

    private void sum4() {
    }
}
