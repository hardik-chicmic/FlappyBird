import { _decorator, Component, Node, Input,Vec3, UITransform, EventTouch, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('movement')
export class movement extends Component {
    @property({type:Node})
    flappyBird = null;

    @property
    steps = 30;

    @property({type: Node})
    hurdle1 = null;

    @property({type: Node})
    hurdle2 = null;

    onLoad(){    
        this.node.on(Input.EventType.MOUSE_DOWN, this.movementUp)
        
        this.node.on(Input.EventType.TOUCH_END, (event:EventTouch) => {
            this.schedule(this.movementDown, 0.1);
        })
    }


    movementUp = () => {
        let screenHeight = this.node.getComponent(UITransform).height
        let screenWidth = this.node.getComponent(UITransform).width

        let birdHeight = this.flappyBird.getComponent(UITransform).height;

        let currentPos:Vec3 = this.flappyBird.getPosition();
        currentPos.y+= this.steps*2;

        if(currentPos.y >= (screenHeight/2 - birdHeight/2)){
            console.log("Bird Died");  
        }
        
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
        let currentPosHurdle1:Vec3 = this.hurdle1.getPosition();
        currentPosHurdle1.x-= 100*(deltaTime);
        let currentPosHurdle2:Vec3 = this.hurdle2.getPosition();
        currentPosHurdle2.x-= 100*(deltaTime);

        this.hurdle1.setPosition(currentPosHurdle1.x, currentPosHurdle1.y)
        this.hurdle2.setPosition(currentPosHurdle2.x, currentPosHurdle2.y)
    }
}

