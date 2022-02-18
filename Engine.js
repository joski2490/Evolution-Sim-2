


let uniqueId = 0;

class Scene {
    constructor(canvas) {
        this.objects = [];
        this.ctx = canvas.getContext('2d');
        
    }
    Update() {
        this.objects.forEach(function (obj) {
            obj.draw();
        })
    }
    GetObject(id) {
        this.objects.forEach(function (obj) {
            if (obj.id == id) {
                return obj;
            }
        });
    }
    AddObject(object) {
        this.objects.push(object);
    }

}
let scene = new Scene(const canvas = document.getElementById('canvas'));

class Object {
    constructor(name, uniqueId) {
        this.id = uniqueId;
        this.name = name
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.width = 100;
        this.height = 100;
        this.rotation = 0;
        this.components = [];
    }
    draw() {
        this.drawRotatedRect(this.x, this.y, this.width, this.height, this.rotation)
    }
    drawRotatedRect(x, y, width, height, degrees) {

        // first save the untranslated/unrotated context
        ctx.save();

        ctx.beginPath();
        // move the rotation point to the center of the rect
        ctx.translate(x + width / 2, y + height / 2);
        // rotate the rect
        ctx.rotate(degrees * Math.PI / 180);

        // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn
        ctx.rect(-width / 2, -height / 2, width, height);

        ctx.fill();

        // restore the context to its untranslated/unrotated state
        ctx.restore();

    }
}

class Vector2 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
    }
}
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


function CreateObject(name) {
    var newObject = new Object(name, uniqueId);
    scene.AddObject(newObject);
    uniqueId++;
    return newObject;
}








