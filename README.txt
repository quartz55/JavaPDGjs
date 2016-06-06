**PROJECT TITLE: JAST2DyPDG - Generating dynamic PDGs

**GROUP: 3MIEIC04 Group 4

NAME1: João Carlos Eusébio Almeida, NR1: up201306301, GRADE1: 18, CONTRIBUTION: 22,5%

NAME2: João Gabriel Marques Costa, NR2: up201304197, GRADE2: 18, CONTRIBUTION:  30%

NAME3: Nuno Gonçalo Neto Silva, NR3: ei12187, GRADE3: 18, CONTRIBUTION: 25%

NAME4: Nuno Martins Marques Pinto, NR4: up201307878, GRADE4: 18, CONTRIBUTION: 22,5%


** SUMMARY: Our program takes a Java file and creates a dynamic PDG (Program Dependence Graph) from it.


**DEALING WITH SYNTACTIC ERRORS: In case of a syntatic error, the program exits and tells you in which line the error occurs.


**SEMANTIC ANALYSIS: Our semantic analysis implements the following main rules:
- You can't create variables with the same name in the same scope;
- You can't define or use variables that haven't been declared;


**INTERMEDIATE REPRESENTATIONS (IRs): Our high-level IR consists of a tree where the control flow and data flow are made explicit coupled with a symbol table where the variables' different scopes are defined.


**CODE GENERATION: Our tool creates different nodes that correspond to the various statements in the program. From those nodes, the PDG is created in the .dot format


**OVERVIEW: Our project was written in Javascript, using the Node.js runtime with the following Node packages: pegjs (language parser generator for Javascript) and node-graphviz (interface to the GraphViz tool). Algoritm wise, depth first-search is used to build the symbol table and generate our PDG / transverse our AST.

NOTE: In order to be able to run the program it is necessary to have Node.js v6+ (along with NPM) installled and to follow these steps:
   1. Open a terminal in the base directory of the project (where 'package.json') is located
   2. Run 'npm install' in the terminal (to install all the needed dependencies)
   3. The script which is located in the "bin/" directory can now be run with: 'node ./bin/java-pdg'


**TESTSUITE AND TEST INFRASTRUCTURE: There are 5 different examples in our testsuite. Our approach towards testing consisted in running the application with various Java files and checking manually whether the PDG generated was valid (considering various examples of PDG's found online).


**TASK DISTRIBUTION:
         - Lexical analysis - Everyone
		     - Syntactic analysis - João Almeida, Nuno Pinto 
		     - Semantic analysis - João Almeida, Nuno Pinto
		     - Control flow - João Costa, Nuno Silva
		     - Data flow - João Costa, Nuno Silva


**PROS: (Identify the most positive aspects of your tool)
- Identifies basic semantical errors and deals with them accordingly;
- Generates correct and easy to follow graphs;
- Generates the PDG for multiple different Java programs; 

**CONS: (Identify the most negative aspects of your tool)
- Even though it wasn't required, our program does not generate a single, individual PDG for a Java program that's separated into different files;
- Shows every dataflow in a single statement/expression which can lead to graph busyness;
