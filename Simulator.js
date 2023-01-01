const frameRate = 20;
//editor
let parameterCurveRamping = 2;
let mutationRate = 5;
let organicWander = "off";
let plantSpawnRate = 100;
let isPlantSpawnRate = "on";
let plantNumber = 100;
let isPlantNumber = undefined;
let showTargetLines = undefined;

let speedMetabolism = [1, 2];
let agilityMetabolism = [1, 2];
let sizeMetabolism = [1, 2];
let storageMetabolism = [1, 2];
let sightAngleMetabolism = [1, 2];
let sightLengthMetabolism = [1, 2];


let frameCounter = 0;

function Start() {

}
function Update() {
    frameCounter++;
    DisplayAverages();

    var things = AllThings();
    things.forEach(function (thing) {
        thing.Move();
        thing.Turn();
        thing.Eat();
        thing.Metabolize();
    })
    var eggs = AllEggs();
    eggs.forEach(function (egg) {
        egg.Incubate();
    })

    //plants
    if (frameCounter % plantSpawnRate == 0 & isPlantSpawnRate == "on") {
        var plant = new Plant(100, 10);
    }
    if (scene.GetAllObjectsOfName("plant").length < plantNumber & isPlantNumber == "on") {
        new Plant(100, 10);
    }
}
//EDITOR FUNCTIONS
function Restart() {
    scene.objects = [];
    var thing = new Thing(100, 100, 100, 100, 100, 100);
    frameCounter = 0;

}
function ApplyChanges(){
    parameterCurveRamping = parseFloat($("#curveRamping").val());
    organicWander = $("#organicWander").val();
    plantSpawnRate = $("#plantSpawnRate").val();
    isPlantSpawnRate = $("#usePlantSpawnRate:checked").val();
    plantNumber = $("#plantNumber").val();
    isPlantNumber = $("#usePlantNumber:checked").val();
    organicWander = $("#organicWander:checked").val();
    showTargetLines = $("#showTargetLines:checked").val();

    mutationRate = $("#mutationRate").val();

    speedMetabolism = $("#speedMetabolism").val().split("x^");
    agilityMetabolism = $("#agilityMetabolism").val().split("x^");
    sizeMetabolism = $("#sizeMetabolism").val().split("x^");
    storageMetabolism = $("#storageMetabolism").val().split("x^");
    sightAngleMetabolism = $("#sightAngleMetabolism").val().split("x^");
    sightLengthMetabolism = $("#sightLengthMetabolism").val().split("x^");
}
function CreateThing() {
    tSpeed = parseFloat($("#tSpeed").val());
    tAgility = parseFloat($("#tAgility").val());
    tSize = parseFloat($("#tSize").val());
    tStorage = parseFloat($("#tStorage").val());
    tSightAngle = parseFloat($("#tSightAngle").val());
    tSightLength = parseFloat($("#tSightLength").val());
    tLifeTime = parseFloat($("#tLifetime").val());
    new Thing(tSpeed, tAgility, tSize, tStorage, tSightAngle, tSightLength);
}





//Game Stuff
class Thing extends Object {
    constructor(speed, agility, size, storage, sightAngle, sightLength, lifeTime) {
        super();
        this.energy = storage * 0.75;

        this.speed = speed;
        this.agility = agility;
        this.size = size;
        this.storage = storage;
        this.sightAngle = sightAngle;
        this.sightLength = sightLength;
        this.lifeTime = lifeTime;

        var sm = speedMetabolism[0] * Math.pow(speed, speedMetabolism[1]);
        var am = agilityMetabolism[0] * Math.pow(agility, agilityMetabolism[1]);
        var zm = sizeMetabolism[0] * Math.pow(size, sizeMetabolism[1]);
        var tm = storageMetabolism[0] * Math.pow(storage, storageMetabolism[1]);
        var sam = sightAngleMetabolism[0] * Math.pow(sightAngle, sightAngleMetabolism[1]);
        var slm = sightLengthMetabolism[0] * Math.pow(sightLength, sightLengthMetabolism[1]);
        this.metabolism = (sm + am + zm + tm + sam + slm) / 3600000;
        console.log(this.metabolism);

        let pos = RandomScreenPosition();
        this.x = pos.x;
        this.y = pos.y;
        this.direction = Math.random() * 360;
        this.name = "thing";
        scene.AddObject(this);


    }
    Draw(context, x, y, scale) {
        var localDirectionVectorEyeLeft = MultiplyVector(DirectionVector(this.direction - Curve(this.sightAngle) / 2), this.size / 5 * scale)
        var localDirectionVectorEyeRight = MultiplyVector(DirectionVector(this.direction + Curve(this.sightAngle) / 2), this.size / 5 * scale)
        var localDirectionVectorSightLeft = MultiplyVector(DirectionVector(this.direction - Curve(this.sightAngle) / 2), Curve(this.sightLength) / 2 * scale);
        var localDirectionVectorSightRight = MultiplyVector(DirectionVector(this.direction + Curve(this.sightAngle) / 2), Curve(this.sightLength) / 2 * scale);
        var color = RGB(this.speed, this.agility, 0);
        //target
        if (this.NearestPlant() != null & showTargetLines == "on") {
            DrawLine(context, x, y, scene.CameraPosition(this.NearestPlant()).x, scene.CameraPosition(this.NearestPlant()).y);
        }
        //sight
        DrawRect(context, x + localDirectionVectorSightLeft.x, y + localDirectionVectorSightLeft.y, Curve(this.sightLength) * scale, 3 * scale, this.direction - Curve(this.sightAngle) / 2, color);
        DrawRect(context, x + localDirectionVectorSightRight.x, y + localDirectionVectorSightRight.y, Curve(this.sightLength) * scale, 3 * scale, this.direction + Curve(this.sightAngle) / 2, color);
        //body
        DrawCircle(context, x, y, Curve(this.size) / 3 * scale, color);
        //eyes
        DrawCircle(context, x + localDirectionVectorEyeLeft.x, y + localDirectionVectorEyeLeft.y, Curve(this.size) / 15 *scale, "white");
        DrawCircle(context, x + localDirectionVectorEyeRight.x, y + localDirectionVectorEyeRight.y, Curve(this.size) / 15 * scale, "white");
        //energy bar
        DrawRect(context, x, y - this.size / 2, this.storage, 10, 0, "black");
        DrawRect(context, x + this.energy / 2 - this.storage/2, y - this.size / 2, this.energy * scale, 10 * scale, 0, "red");
        
    }

    Move() {
        var directionVectorMovement = MultiplyVector(DirectionVector(this.direction), Curve(this.speed) / 1000);
        this.x += directionVectorMovement.x;
        this.y += directionVectorMovement.y;
    }
    Eat() {
        var plant = this.NearestPlant();
        if (plant != null) {
            if (DistanceVector(new Vector2(this.x, this.y), new Vector2(plant.x, plant.y)) < Curve(this.size) / 3 + plant.size / 3) {
                this.energy += plant.energy;
                if (this.energy > this.storage/2) {
                    this.energy /= 2;
                    this.Reproduce();
                }
                plant.Eaten();
            }
        }
    }
    Reproduce() {
        
        new Egg(this.x, this.y,this.speed, this.agility, this.size, this.storage, this.sightAngle, this.sightLength);
    }
    NearestPlant() {
        
        var plants = scene.GetAllObjectsOfName("plant");

        var closestDistance = Infinity;
        var closestPlant = null;
        var pos = new Vector2(this.x, this.y);
        plants.forEach(function (plant) {
            if (organicWander == "on") {
                var distance = OrganicDistanceVector(new Vector2(plant.x, plant.y), new Vector2(pos.x, pos.y));
            } else {
                var a = plant.x - pos.x;
                var b = plant.y - pos.y;

                var distance = Math.sqrt(a * a + b * b);
            }
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPlant = plant;
            }
        });
        return closestPlant;
    }
    NearestPlantAngle() {
        var target = this.NearestPlant();
        
        var angle = Math.atan2(target.y - this.y, target.x - this.x) / Math.PI * 180 - (this.direction);
        return angle;
    }
    IsTurnDirectionRight() {
        //TRUE IS RIGHT
        //FALSE IS LEFT

        var npa = this.NearestPlantAngle();
        if (npa > 0 || (npa > -360 && npa < -180)) {
            return true;
        }
        return false

    }
    Turn() {
        if (this.NearestPlant() != null) {
            if (this.IsTurnDirectionRight()) {
                this.direction += Curve(this.agility) / 1000;
            } else {
                this.direction -= Curve(this.agility) / 1000;
            }
        }
    }
    Metabolize() {
        var sm = speedMetabolism[0] * Math.pow(this.speed, speedMetabolism[1]);
        var am = agilityMetabolism[0] * Math.pow(this.agility, agilityMetabolism[1]);
        var zm = sizeMetabolism[0] * Math.pow(this.size, sizeMetabolism[1]);
        var tm = storageMetabolism[0] * Math.pow(this.storage, storageMetabolism[1]);
        var sam = sightAngleMetabolism[0] * Math.pow(this.sightAngle, sightAngleMetabolism[1]);
        var slm = sightLengthMetabolism[0] * Math.pow(this.sightLength, sightLengthMetabolism[1]);
        this.metabolism = (sm + am + zm + tm + sam + slm) / 3600000;

        this.DepleteEnergy(this.metabolism);
        if (this.energy > 0) return;

        this.Die();
    }
    Die() {
        scene.DestroyObject(this);
    }
    DepleteEnergy(amount) {
        this.energy -= amount;
    }

    
}
function AllThings() {
    var things = scene.GetAllObjectsOfName("thing");
    return things;
}
class Egg extends Object {
    constructor(x, y, speed, agility, size, storage, sightAngle, sightLength, lifeTime) {
        super();
        this.x = x;
        this.y = y;
        this.speed = this.Mutate(speed);
        this.agility = this.Mutate(agility);
        this.size = this.Mutate(size);
        this.storage = this.Mutate(storage);
        this.sightAngle = this.Mutate(sightAngle);
        this.sightLength = this.Mutate(sightLength);
        this.lifeTime = this.Mutate(lifeTime)

        this.framesLeft = 1000;
        
        this.name = "egg"
        scene.AddObject(this);
    }
    Mutate(parameter) {
        return parameter += (Math.random() - 0.5) * 2 * mutationRate;
    }
    Incubate() {
        this.framesLeft--;
        if (this.framesLeft <= 0) {
            var thing = new Thing(this.speed, this.agility, this.size, this.storage, this.sightAngle, this.sightLength, this.lifeTime);
            thing.x = this.x;
            thing.y = this.y;
            scene.DestroyObject(this);
        }
    }
    Draw(context, x, y, scale) {
        DrawRect(context, x, y, this.width / 9 * scale, this.height / 9 * scale, 0, RGB(this.speed, this.agility));
    }
    
}
function AllEggs() {
    var things = scene.GetAllObjectsOfName("egg");
    return things;
}
class Plant extends Object {
    constructor(size, energy) {
        super();
        this.size = size;
        this.energy = energy;

        let pos = RandomScreenPosition();
        this.x = pos.x;
        this.y = pos.y;
        this.name = "plant";
        scene.AddObject(this);
    }
    Draw(context, x, y, scale) {
        DrawRect(context, x, y, this.size / 3 * scale, this.size / 3 * scale, 0);
    }
    Eaten() {
        scene.DestroyObject(this);
    }
}
function RandomScreenPosition() {
    return new Vector2(Math.random() * 1080, Math.random() * 800);
}
//EVOLUTION FUNCTIONS////////////////////////////////////////////////////////////////////////////////
//EVOLUTION FUNCTIONS////////////////////////////////////////////////////////////////////////////////
//EVOLUTION FUNCTIONS////////////////////////////////////////////////////////////////////////////////
function Curve(parameter) {
    return Math.pow(parameter * Math.pow(10, parameterCurveRamping - 2) / Math.pow(10, parameterCurveRamping), parameterCurveRamping) * 100;
}
//////////////////////////////////////////////////////EDITOR FUNCTIONS////////////////////////////////
function DisplayAverages() {
    var params = AverageParameters();
    $("#averages").html("<b>Averages</b><br/>Speed: " + params[0] + " <br/>Agility: " + params[1] + " <br/>Size: " + params[2] + " <br/>Storage: " + params[3] + " <br/>SightAngle: " + params[4] + " <br/>SightLength: " + params[5] + " <br/>");
}
function AverageParameters() {
    
    things = AllThings();
    if (things.length == 0) {
        return [0, 0, 0, 0, 0, 0];
    }
    speed = 0;
    agility = 0;
    size = 0;
    storage = 0;
    sightAngle = 0;
    sightLength = 0;
    things.forEach(function (thing) {
        speed += thing.speed;
        agility += thing.agility;
        size += thing.size;
        storage += thing.storage;
        sightAngle += thing.sightAngle;
        sightLength += thing.sightLength;
    })
    speed /= things.length;
    agility /= things.length;
    size /= things.length;
    storage /= things.length;
    sightAngle /= things.length;
    sightLength /= things.length;
    
    return [speed, agility, size, storage, sightAngle, sightLength];
}
/////////////////////////////////////////////////////////////INPUTS//////////////////////////////////////////
var addEvent = document.addEventListener ? function (target, type, action) {
    if (target) {
        target.addEventListener(type, action, false);
    }
} : function (target, type, action) {
    if (target) {
        target.attachEvent('on' + type, action, false);
    }
}

addEvent(document, 'keydown', function (e) {
    e = e || window.event;
    var key = e.which || e.keyCode;
    if (key === 87) {
        OnW();
    }
    if (key === 83) {
        OnS();
    }
    if (key === 81) {
        OnQ();
    }
    if (key === 65) {
        OnA();
    }
    if (key === 68) {
        OnD();
    }
    if (key === 69) {
        OnE();
    }
});
var cameraMoveSpeed = 5;
function OnW() {
    scene.cameraPos.y -= cameraMoveSpeed;
}
function OnA() {
    scene.cameraPos.x -= cameraMoveSpeed;
}
function OnS() {
    scene.cameraPos.y += cameraMoveSpeed;
}
function OnD() {
    scene.cameraPos.x += cameraMoveSpeed;
}
function OnQ() {
    scene.cameraCast -= cameraMoveSpeed;
}
function OnE() {
    scene.cameraCast += cameraMoveSpeed;
}

























//LOGIC
Start();
setInterval(function () {
    Update();
    scene.Update();
    
}, 1 / frameRate);
