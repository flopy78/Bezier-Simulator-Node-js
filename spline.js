import {Point, Vector} from "./mathtools.js";

export class Spline {

    constructor(controlPoints, step, color) {

        //setting attributes
        this.controlPoints = controlPoints;
        this.step = step;
        this.color = color;

        //binding draw method
        this.draw = this.draw.bind(this);

    }

    compute(t, points) {
        /*recursive function which returns the point of the bezier curve associated to the real t (0 >= t >= 1).
        It finds the points at t% of the segments defined by the points in argument, and is called until there is only one result, the point of the bezier curve.
        
        Arguments : t (number between 0 and 1) and points (list of "Points" or "ControlPoints", see "mathtools.js" and "controlpoint.js")
        Return : a "Point" object representing the point of the bezier curve
        */

        let new_points = [];
        let point;

        for (let i = 0 ; i < points.length - 1 ; i ++) {
            let A = points[i];
            let B = points[i + 1];

            let v = new Vector(A, B);
            new_points.push(v.resize(t).extremite);
        }

        if (new_points.length == 1) {
            return new_points[0];
        } else {
            return this.compute(t, new_points);
        }
    }

    draw(ctx) {
        /*function which plots the bezier curve by computing the points associated to several values of t (see "compute" method) and plot the segments between them on the canvas to get the bezier curve.
        It also plots segments between the controlpoints, to see how they are ordered.
        Arguments : ctx, an object generated from the canvas which is used to draw on it
        Return : no return
        */


        let t = 0;

        //plot the curve
        ctx.beginPath();
        while (t <= 1) {
            let A = this.compute(t, this.controlPoints);
            ctx.moveTo(A.x, A.y);

            t += this.step;

            let B = this.compute(t, this.controlPoints);
            
            ctx.lineTo(B.x, B.y);
            ctx.strokeStyle = this.color;
            ctx.stroke()
        }
        ctx.closePath();

        //plot the segments between the controlPoints
        ctx.beginPath();
        for (let i = 0 ; i < this.controlPoints.length - 1 ; i ++) {
            let A = this.controlPoints[i];
            let B = this.controlPoints[i + 1];

            ctx.strokeStyle = "grey";
            ctx.moveTo(A.x, A.y);
            ctx.lineTo(B.x, B.y);
            ctx.stroke();
        }
        ctx.closePath();

    

    }
}