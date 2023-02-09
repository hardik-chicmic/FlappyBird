import { _decorator, Component, Node, Input,Vec3, UITransform, EventTouch, SpriteFrame, Prefab, NodePool, instantiate, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('movement')
export class movement extends Component {
    @property({type:Node})
    flappyBird = null;

    @property
    steps = 30;

    @property
    hurdle1 = null;

    @property
    hurdle2 = null;

    @property({type: Prefab})
    pipes = null;

    pool1 = new NodePool();
        
    // As the scene is loaded the obstacles are set up at a particular distance
    onLoad(){    
        this.node.on(Input.EventType.MOUSE_DOWN, this.movementUp);
        this.node.on(Input.EventType.TOUCH_END, (event:EventTouch) => {
            this.schedule(this.movementDown, 0.1);
        })

        // creating a pool of obstacles
        
        for(let i=0;i<4;i++){
            let obstacle = instantiate(this.pipes);
        
            // Putting in the pool
            this.pool1.put(obstacle)
            
            // Getting from the pool
            // let obs = this.pool1.get();
            // let pos = obs.getPosition();

            // pos.x-= 200*(i+1);

            // obs.setPosition(pos);

            // this.onSceneLoad(this.pool1, i+1)

            // Adding to spriteframe
            // this.node.addChild(obstacle);
        }
    }

    onSceneLoad = (pool1, cnt) => {
        let obs = this.pool1.get();
        let pos = obs.getPosition();

        pos.x-= 200*(cnt+1);

        obs.setPosition(pos);
        pool1.put(obs);
    }
    
    
    
    // setHurdles = (pool1,deltaTime) => {
    //     let currentObs = pool1.get();
        
    //     let currentPos = currentObs.getPosition();
    //     // console.log(currentPos);
    //     console.log(currentPos.x);
        
    //     currentPos.x-= 100*(deltaTime);
    //     // console.log(currentPos.x);
        
    //     // currentObs.setPosition(currentPos);
        
    //     let widthParent = this.node.getComponent(UITransform).width;
    //     let hurdle = this.node.getChildByName("pipes")

    //     let hWidth = hurdle.getComponent(UITransform).width
        
       
    //     if(currentPos.x <= -1 * (widthParent*0.5 - hWidth*0.5)){
    //         pool1.put(currentObs)
    //     }
    //     console.log(pool1.size());
        
    // }
    
    movementUp = () => {
        let screenHeight = this.node.getComponent(UITransform).height
        let screenWidth = this.node.getComponent(UITransform).width

        let birdHeight = this.flappyBird.getComponent(UITransform).height;

        let currentPos:Vec3 = this.flappyBird.getPosition();
        currentPos.y+= this.steps*2;

        this.flappyBird.setPosition(currentPos.x, currentPos.y); 
    }

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

    start() {
        
    }

    
    update(deltaTime: number) {
        // let currentPosHurdle1:Vec3 = this.hurdle1.getPosition();
        // currentPosHurdle1.x-= 100*(deltaTime);
        // let currentPosHurdle2:Vec3 = this.hurdle2.getPosition();
        // currentPosHurdle2.x-= 100*(deltaTime);

        // this.hurdle1.setPosition(currentPosHurdle1.x, currentPosHurdle1.y)
        // this.hurdle2.setPosition(currentPosHurdle2.x, currentPosHurdle2.y)

        // let n = this.node.children.length;
        // for(let i=0;i<n;i++){
        //     let currentObs = this.node.children[i];
        //     let currentPos = currentObs.getPosition();
        //     currentPos.x-= 100*(deltaTime);
        //     currentObs.setPosition(currentPos);
        // }
        this.setHurdles(this.pool1,deltaTime)
    }
}

