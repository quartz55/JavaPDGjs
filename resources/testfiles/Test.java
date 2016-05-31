public class Test {
    public void testFunc1() {
        int sum = 0;
        int i = 1;
        int a = sum;
        while (i < 11) {
            sum = sum + i;
            i = i + 1;
        }
        System.out.println(sum);
        System.out.println(i);
    }
}
