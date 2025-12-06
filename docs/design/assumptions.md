Document assumptions in this file, if any,

Typescript uses "type" and "interface" to define the shape of a bit of data. This is a bit different from Java, but I think typescripe's usage of these data structures is most similar to what we're used to from a class, so I am going to label my "type" and "interface" objects as a "class" in the PlantUML diagram.

In addition, for React and Typescript, "classes" aren't really used, instead functions are used, but they are conceptually "classes" as we have been discussing classes (they hold variables and functions). So, the TSX functions are represented as "classes" in the UML diagram.

Also, useEffects are basically functions but aren't named, so I've named each one with comments in the code, and I'll refer to them by that name in the design.