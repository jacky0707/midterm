import React from 'react'
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

class OneRank extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render(){
        const style ={
            rank:{
                display: 'flex',
                flexDirection:'row',
                width:'400px',
                justifyContent:'space-between'
                
            }
        } 
        return(
            <div style= {style.rank}>
                <div>rank: {this.props.rank}</div>
                <div>name: {this.props.value.name}</div>
                <div>step: {this.props.value.step}</div>
            </div>
        )
    }
}

export class Ranking extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render(){
        let rankingList=[];
        let rank = 0;
        if(!localStorage.ranking){
            rankingList.push(<div>no record</div>)
        }else{
            for(rank;rank<JSON.parse(localStorage.ranking).length;rank++){
                rankingList.push(<div><OneRank rank={rank+1} value={JSON.parse(localStorage.ranking)[rank]}/></div>)
            }
        }
        /*map 似乎做不到？
        let rankingList = Object.values(JSON.parse(localStorage.ranking)).map((value, key)=>(
            <div>
                <OneRank key={key} value={value}/>
            </div>
        ))*/
        return(
            <div>
                <div>
                    {rankingList}
                </div>
            </div>
        )
    }
}
export class Game extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            nameInput:"",
            name:"",
            step:0,
            box:[[1,2,3],[4,5,6],[7,"",8]],
            done:""
            
        };
        this.moveBox = this.moveBox.bind(this);
        this.showBoxStatus = this.showBoxStatus.bind(this);
        this.setName = this.setName.bind(this);
        this.handleNameInput = this.handleNameInput.bind(this)
    }
    
    moveBox(e){
        //console.log(e)好像有東西，打開來卻又都是 null
        this.setState({done:""})
        if(!this.state.name){
            alert('請輸入姓名')
        }else{
            let step = this.state.step

            let boxStatus = this.showBoxStatus(e.target.id)
            let originBoxStatus = this.state.box//為什麼會直接更改 this.state??????????

            let clickedX = boxStatus.value.x
            let clickedY = boxStatus.value.y

            let theNeighbor = 0;
            for(theNeighbor;theNeighbor<boxStatus.neighbor.length;theNeighbor++){
                if(boxStatus.neighbor[theNeighbor].nei == ""){
                    let spaceX = boxStatus.neighbor[theNeighbor].x;
                    let spaceY = boxStatus.neighbor[theNeighbor].y;

                    originBoxStatus[spaceX][spaceY] = originBoxStatus[clickedX][clickedY]//line 43 這邊會直接被更改
                    originBoxStatus[clickedX][clickedY] = "";

                    this.setState({box:originBoxStatus})//直接更改了可以這邊要 set 後才能改 UI

                    step+=1;
                    this.setState({step:step})

                    if(this.state.box[0][0]==1 && this.state.box[0][1]==2 && this.state.box[0][2]==3 && this.state.box[1][0]==4 && this.state.box[1][1]==5 && this.state.box[1][2]==6 && this.state.box[2][0]==7 && this.state.box[2][1]==8){
                        this.setState({done:"Congratulations"})
                        
                        let record = {
                            name:this.state.name,
                            step:this.state.step+1 //令人痛苦的 +1
                        }
                        let array = []
                        if(localStorage.ranking == undefined){
                            array.push(record)
                        }else{
                            for(let rec=0;rec<JSON.parse(window.localStorage.ranking).length;rec++){
                                array.push(JSON.parse(window.localStorage.ranking)[rec])
                            }
                            let insertPosition = JSON.parse(window.localStorage.ranking).length;
                            for(let rec=0;rec<JSON.parse(window.localStorage.ranking).length;rec++){
                                if(record.step<JSON.parse(window.localStorage.ranking)[rec].step){
                                    console.log("rec"+rec)
                                    console.log("newrecord"+record.step)
                                    console.log(JSON.parse(window.localStorage.ranking)[rec].step)
                                    insertPosition=rec;
                                    break;
                                }
                            }
                            array.splice(insertPosition,0,record)
                            console.log(array)
                        }
                        localStorage.setItem("ranking",JSON.stringify(array))
                        this.setState({step:0})
                    }
                    break;

                }
            }
        }  
    }
    
    showBoxStatus(id){
        //本身值跟鄰居值
        let status={
            value:{},
            neighbor:[]
        }
        switch(id){
            case "box1":
                status.value.x = 0;
                status.value.y = 0;
                status.neighbor.push({nei:this.state.box[0][1],x:0,y:1},{nei:this.state.box[1][0],x:1,y:0});
                break;
            case "box2":
                status.value.x = 0;
                status.value.y = 1;
                status.neighbor.push({nei:this.state.box[0][0],x:0,y:0},{nei:this.state.box[0][2],x:0,y:2},{nei:this.state.box[1][1],x:1,y:1});
                break;
            case "box3":
                status.value.x = 0;
                status.value.y = 2;
                status.neighbor.push({nei:this.state.box[0][1],x:0,y:1},{nei:this.state.box[1][2],x:1,y:2});
                break;
            case "box4":
                status.value.x = 1;
                status.value.y = 0;
                status.neighbor.push({nei:this.state.box[0][0],x:0,y:0},{nei:this.state.box[1][1],x:1,y:1},{nei:this.state.box[2][0],x:2,y:0});
                break;
            case "box5":
                status.value.x = 1;
                status.value.y = 1;
                status.neighbor.push({nei:this.state.box[0][1],x:0,y:1},{nei:this.state.box[1][0],x:1,y:0},{nei:this.state.box[2][1],x:2,y:1},{nei:this.state.box[1][2],x:1,y:2});
                break;
            case "box6":
                status.value.x = 1;
                status.value.y = 2;
                status.neighbor.push({nei:this.state.box[0][2],x:0,y:2},{nei:this.state.box[1][1],x:1,y:1},{nei:this.state.box[2][2],x:2,y:2});
                break;
            case "box7":
                status.value.x = 2;
                status.value.y = 0;
                status.neighbor.push({nei:this.state.box[2][1],x:2,y:1},{nei:this.state.box[1][0],x:1,y:0});
                break;
            case "box8":
                status.value.x = 2;
                status.value.y = 1;
                status.neighbor.push({nei:this.state.box[1][1],x:1,y:1},{nei:this.state.box[2][0],x:2,y:0},{nei:this.state.box[2][2],x:2,y:2});
                break;
            case "box9":
                status.value.x = 2;
                status.value.y = 2;
                status.neighbor.push({nei:this.state.box[2][1],x:2,y:1},{nei:this.state.box[1][2],x:1,y:2});
                break;
        }
        return status;
    }
    handleNameInput(e){
        this.setState({nameInput:e.target.value})
    }
    setName(){
        this.setState({name:this.state.nameInput})
    }
    render(){
        const style={
            viewStyle:{
                display:'flex',
                flexDirection:'column',
                alignItems: 'center',
                height: '500px',
                justifyContent: 'space-between'
            },
            boxStyle:{
                display:'flex',
                width: '48px',
                height: '48px',
                border: '1px solid black',
                alignItems: 'center',
                justifyContent: 'center'
            },
            bigBoxStyle:{
                width: '150px',
                height: '150px',
                display: 'flex',
                flexDirection:'row',
                flexWrap: 'wrap'
            }
        }
        return (
            <div style={style.viewStyle}>
                <form>
                    <label>
                        Name:
                        <br></br>
                        <input type="text" name="name" onChange={this.handleNameInput}/>
                    </label>
                        
                        <input type="button" value="Start Game" onClick={this.setName}/>
                </form>
                <div>Step Count:{this.state.step}</div>
                <div style={style.bigBoxStyle}>
                    <div id="box1" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[0][0]}</div>
                    <div id="box2" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[0][1]}</div>
                    <div id="box3" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[0][2]}</div>
                    <div id="box4" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[1][0]}</div>
                    <div id="box5" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[1][1]}</div>
                    <div id="box6" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[1][2]}</div>
                    <div id="box7" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[2][0]}</div>
                    <div id="box8" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[2][1]}</div>
                    <div id="box9" style={style.boxStyle} onClick={this.moveBox}>{this.state.box[2][2]}</div>
                </div>
                <div>{this.state.done}</div>
            </div>
        )
    }
}
ReactDOM.render(
    //router 不算很懂
    <BrowserRouter>
        <div>
            <div>
                <div><Link to="/">Game</Link></div>
                <div><Link to="/ranking">Ranking</Link></div>
            </div>
            <Route exact path="/" component={Game} />
            <Route path="/ranking" component={Ranking} />
        </div> 
    </BrowserRouter>, document.getElementById("root"))