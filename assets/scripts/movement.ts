import { _decorator, Component, Node, Input,Vec3, UITransform, EventTouch, SpriteFrame, Prefab, NodePool, instantiate, randomRange, randomRangeInt, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('movement')
export class movement extends Component {
    @property({type:Node})
    flappyBird = null;

    @property
    steps = 30;

    @property({type: Prefab})
    pipes = null;

    pool1 = new NodePool();

    flag = false;
    
    totScore = 0;

    gameOver = false;
    onLoad(){    
        this.node.on(Input.EventType.MOUSE_DOWN, this.movementUp);
        this.node.on(Input.EventType.TOUCH_END, (event:EventTouch) => {
            this.schedule(this.movementDown, 0.1);
        })

        // creating a pool of obstacles
        let hurdleCount = 4;
        for(let i=0;i<hurdleCount;i++){
            // Creating obstacle
            let obstacle = instantiate(this.pipes);

            // Putting in the pool
            this.pool1.put(obstacle)
        }
        
    }
    
    start() {
        if(!this.gameOver){
            this.schedule(this.createHurdle, 2);
        }
    }

    createHurdle(){
        // Fetching from the pool and assigning the position of obstacles
        
        if(this.pool1.size()){        
            let Obs = this.pool1.get();
            let pos = Obs.getPosition();

            let widthParent = this.node.getComponent(UITransform).width;
            let hurdleWidth = Obs.getComponent(UITransform).width
        
            pos.x = randomRangeInt(1, 4) * (widthParent*0.5 + hurdleWidth*0.5)
            pos.y = randomRangeInt(-10, 10) * 10

            Obs.setPosition(pos);

            // Active component ensures whether we can change the properties of node or not
            Obs.getChildByName("Score").active = true;
            this.node.addChild(Obs);
        }
        this.flag = true;
    }
    

    // Iterating the node in which all our hurdles are present and then changing the position
    setHurdles = (pool1,deltaTime) => {
        if(this.flag){
            let arr = this.node.children
            
            arr.forEach((element) => {
                let currentPos = element.getPosition();
                currentPos.x-= 100*(deltaTime);
                element.setPosition(currentPos);


                // Width of component in which all hurdles are added
                let widthParent = this.node.getComponent(UITransform).width;

                // Hurdle width or pipe width
                let hurdleWidth = element.getComponent(UITransform).width
                

                // Checking if the obstacle is crossing
                if(currentPos.x <= -1 * (widthParent*0.5 + hurdleWidth*0.5)){
                    this.pool1.put(element)
                }
            })
        }
    }


    // Checking if the collision occur
    isCollisionOccur = () => {
        let hurdles = this.node.children;

        hurdles.forEach((element) => {
            let pipe1 = element.children;
            
            let boundingBoxTop = pipe1[0].getComponent(UITransform).getBoundingBoxToWorld();
            let boundingBoxDown = pipe1[1].getComponent(UITransform).getBoundingBoxToWorld();
            let boundingBoxScore = pipe1[2].getComponent(UITransform).getBoundingBoxToWorld();
            let bird = this.node.parent.getChildByName("Character").getChildByName("birdU")
            
            let boundingBox3 = bird.getComponent(UITransform).getBoundingBoxToWorld();

            // Checking if bird intersects upper pipe
            if(boundingBox3.intersects(boundingBoxTop)){
                console.log("Collision Up detected");
            }

            // Checking if the bird intersects lower pipe
            if(boundingBox3.intersects(boundingBoxDown)){
                console.log("Collision Down detected");
            }

            // Checking if the bird intersects score node
            if(boundingBox3.intersects(boundingBoxScore) && pipe1[2].active){
                pipe1[2].active = false;
                this.addScore();
            }
        })
    }


    // Updating the score on crossing the obstacle
    addScore = () => {
        this.totScore+= 1;
        let scoreLabel = this.node.parent.getChildByName("ScoreLabel");
        scoreLabel.getComponent(Label).string = String(this.totScore)
    }
    

    // For upward movement of bird
    movementUp = () => {
        let screenHeight = this.node.getComponent(UITransform).height
        let screenWidth = this.node.getComponent(UITransform).width

        let birdHeight = this.flappyBird.getComponent(UITransform).height;

        let currentPos:Vec3 = this.flappyBird.getPosition();
        currentPos.y+= this.steps*2;

        this.flappyBird.setPosition(currentPos.x, currentPos.y); 
    }


    // For downward movement of bird
    movementDown = () => {
        let screenHeight = this.node.getComponent(UITransform).height
        let screenWidth = this.node.getComponent(UITransform).width

        let birdHeight = this.flappyBird.getComponent(UITransform).height;

        let currentPos:Vec3 = this.flappyBird.getPosition();
        currentPos.y-= this.steps/2;
        this.flappyBird.setPosition(currentPos.x, currentPos.y);
        
        if(currentPos.y <= (-1) * (screenHeight/2 - birdHeight/2)){
            this.unschedule(this.movementDown)
            console.log("Bird Died");  
        }        
    }

   
    // update method will first check if there is any change in the scheduler and then it is called
    update(deltaTime: number) {
        // Setting the hurdles
        if(!this.gameOver){
            this.setHurdles(this.pool1,deltaTime)
        }
        if(this.flag){
            // Checking for collisions
            this.isCollisionOccur();
        }
    }
}

