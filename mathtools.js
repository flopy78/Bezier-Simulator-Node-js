export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Vector {
    constructor(A, B) {
        this.origine = A;
        this.extremite = B;
        this.x = B.x - A.x;
        this.y = B.y - A.y;
    }

    resize(t) {
        /*function returning a new vector given by multiplying the actual one by t

        Argument : t (number)
        Return : resized vector
        */

        //Generate the new vector
        return new Vector(this.origine, new Point(this.origine.x + this.x*t, this.origine.y + this.y*t));
    }
}