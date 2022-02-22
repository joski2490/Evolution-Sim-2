


let uniqueId = 0;
class Vector2 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;

    }
}
class Scene {
    constructor(canvas) {

        this.cameraPos = new Vector2(-540, -540);
        this.cameraCast = 1080;

        this.objects = [];
        this.ctx = canvas.getContext('2d');
        this.width = 1080;
        this.height = 800;
        
    }
    Update() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        var c = this.ctx;
        //drawing objects
        var camPos = this.cameraPos;
        var camCast = this.cameraCast;
        this.objects.forEach(function (obj) {
            obj.Draw(c, (obj.x - 540) * camCast / 1080 - camPos.x, (obj.y - 540) * camCast / 1080 - camPos.y, camCast / 1080);
        })
    }
    CameraPosition(pos) {
        var x = (pos.x - 540) * this.cameraCast / 1080 - this.cameraPos.x;
        var y = (pos.y - 540) * this.cameraCast / 1080 - this.cameraPos.y;
        return new Vector2(x, y);
    }
    GetObject(id) {
        this.objects.forEach(function (obj) {
            if (obj.id == id) {
                return obj;
            }
        });
    }
    GetAllObjectsOfName(name) {
        var objs = []
        this.objects.forEach(function (obj) {
            if (obj.name == name) {
                objs.push(obj);
            }
        });
        return objs;
    }
    AddObject(object) {
        this.objects.push(object);
    }
    CreateObject(name) {
        var newObject = new Object(name, uniqueId);
        this.AddObject(newObject);
        uniqueId++;
        return newObject;
    }
    DestroyObject(object) {
        
        this.objects = this.objects.filter(function (item) {
            return item !== object;
        });
    }

}

let scene = new Scene(document.getElementById('canvas'));

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
    Draw(context, x, y, scale) {
        DrawRect(context, x, y, this.width * scale, this.height * scale, this.rotation);
    }
    
}



//Drawing Functions//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Drawing Functions//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Drawing Functions//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DrawRect(context, x, y, width, height, degrees, color) {

    x -= width / 2;
    y -= height / 2;
    // first save the untranslated/unrotated context
    context.save();
    context.fillStyle = color;
    context.beginPath();
    // move the rotation point to the center of the rect
    context.translate(x + width / 2, y + height / 2);
    // rotate the rect
    context.rotate(degrees * Math.PI / 180);


    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    context.rect(-width / 2, -height / 2, width, height);

    context.fill();

    // restore the context to its untranslated/unrotated state
    context.restore();

}
function DrawCircle(context, x, y ,radius, color) {

    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();
    context.restore();
}
function DrawLine(context, startX, startY, endX, endY) {
    context.save();
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.restore();
}
//Math Functions//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Math Functions//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Math Functions//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Max(num1, num2) {
    if (num1 > num2) return num1;
    return num2;
}
function Min(num1, num2) {
    if (num1 < num2) return num1;
    return num2;
}
function RGB(r, b, g) {
    return "RGB(" + r+ "," + b + "," + g + ")";
}
//Vector Math
function DirectionVector(angle) {
    var x = Math.cos(angle * Math.PI / 180);
    var y = Math.sin(angle * Math.PI / 180);
    return new Vector2(x, y);
}
function MultiplyVector(vector, magnitude) {
    vector.x *= magnitude;
    vector.y *= magnitude;
    return vector;
}
function OrganicDistanceVector(vector1, vector2) {
   return Math.sqrt(Math.pow(vector1.x - vector2.x, 2), Math.pow(vector1.y - vector2.y, 2));
}
function DistanceVector(vector1, vector2) {
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2)+ Math.pow(vector1.y - vector2.y, 2));

}









