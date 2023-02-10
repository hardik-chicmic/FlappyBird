import { _decorator, Component, Node, Input, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hurdle')
export class hurdle extends Component {

    onLoad(){
        director.preloadScene('Main')
        this.node.on(Input.EventType.MOUSE_DOWN, ()=>{
            director.loadScene('Main')
        })
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }
}

