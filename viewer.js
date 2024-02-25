import {ControlPoint} from "./controlpoint.js";
import {Spline} from "./spline.js";


export class Viewer {
    constructor (document, w, h) {
        //sets html elements
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = w;
        this.canvas.height = h;
        this.plot_button = document.querySelector("#plot_button");

        //sets lists of objects displayed
        this.controlPoints = [];
        this.splines = [];
        this.newControlPoints = []; 

        //sets other attributes
        this.plotting = false;
        this.colors = ["red", "blue", "green", "purple", "pink", "orange", "brown", "black"] 

        //bind draw method
        this.draw = this.draw.bind(this)

        //set the event handlers
        this.plot_button.addEventListener("click", this.managePlotting());
        this.canvas.addEventListener('mousedown', this.onDown());
        this.canvas.addEventListener('mousemove', this.onMove());
        this.canvas.addEventListener('mouseup', this.onUp());

        //starts drawing
        setInterval(() => {this.draw(this.splines.concat(this.controlPoints).concat(this.newControlPoints));}, 0.1);
    }

    managePlotting() {
        /*function returning a handler managing the clicks of the button.
        When activated, the button allows to add new controlpoints by creating a new spline.
        When disabled, the button only allow to manipulate the created splines.

        Arguments : no arguments
        Return : function handling the actions on the button
        */

        return (e) => {

            //switches the mode of the button
            this.plotting = !this.plotting;

            if (this.plotting) {
                //sets the layout of the button
                this.plot_button.innerText = "Validate";
                this.plot_button.style.backgroundColor = "red";
            } else {
                //sets the layout of the button
                this.plot_button.innerText = "New Curve";
                this.plot_button.style.backgroundColor = "grey";

                //creates the spline and saves the controlpoints
                this.splines.push(new Spline(this.newControlPoints, 0.01, this.colors.shift()));
                for (let point of this.newControlPoints){
                    if (!this.controlPoints.includes(point)) this.controlPoints.push(point);
                }
                this.newControlPoints = [];
            }
        }
    }

    onDown() {
        /*function returning a handler managing the clicks of the mouse (down).
        If the mouse is on a control point, a drag and drop of this control point is activated.
        Else, a new control point is created if the plotting mode is activated (nothing happends if it is not).

        Arguments : no arguments
        Return : function handling the clicks of the mouse (down)
        */

        return (e) => {

            let done = false;
            
            //checks if a control point is pressed
            for (let controlPoint of this.controlPoints.concat(this.newControlPoints)) {
                if (controlPoint.isDraggable(e)) {
                    controlPoint.down = true;
                    done = true;
                    if (this.plotting) {
                        this.newControlPoints.push(controlPoint);
                    }
                } 
            }

            //creates a new control point if necessary
            if (!done && this.plotting) {
                let rect = e.target.getBoundingClientRect();
                let mousex = e.clientX - rect.left;
                let mousey = e.clientY - rect.top;
                this.newControlPoints.push(new ControlPoint(mousex, mousey, 8, this.colors[0]));
            }
        }
    }

    onMove() {
        /*function returning a handler managing the moves of the mouse.
        If a control point is being dragged, then it follows the mouse.
        Else, nothing happends.

        Arguments : no arguments
        Return : function handling the moves of the mouse
        */

        return (e) => {

            //moves the control point dragged (if there is one) to the position of the mouse
            for (let controlPoint of this.controlPoints.concat(this.newControlPoints)) {
                if (controlPoint.down) {
                    let rect = e.target.getBoundingClientRect();
                    let mousex = e.clientX - rect.left;
                    let mousey = e.clientY - rect.top;
                    let r = controlPoint.r;
                    if (mousex - r >= 0 && mousex + r <= this.canvas.width) {
                        controlPoint.x = mousex;
                    }

                    if (mousey - r >= 0 && mousey + r <= this.canvas.height) {
                        controlPoint.y = mousey;
                    }
                }
            }
        }
    }

    onUp() {
        /*function returning a handler managing the release of the mouse.
        It ends all the possible current drag and drops.

        Arguments : no arguments
        Return : function handling the release of the mouse.
        */

        return (e) => {

            //disables all the drag and drops
            for (let controlPoint of this.controlPoints.concat(this.newControlPoints)) {
                controlPoint.down = false;
            }
        }
    }

    draw(objs) {
        /*function drawing the requested objects.
        There is no direct implementation of the plottings : this method only call the draw function of the objects.


        Arguments : list of objects to plot
        Return : return nothing
        */
        //clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw the outline of the canvas
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        //draw the given objects
        for (let obj of objs) {
            obj.draw(this.ctx);
        }
    }
}