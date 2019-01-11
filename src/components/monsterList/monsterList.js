import React, { Component } from "react";
import monsters from "../monsters";
import "./monsterList.css";

class MonsterList extends Component{
    constructor(props){
        super(props);
        this.state = {
            monsters: [],
            monsterNum: "",
            players: "",
            diff: "",
            xpTotal: "",
            xpPer: ""
        };
    }

    clear = () => {
        this.setState({
            monsters: [],
            monsterNum: "",
            players: "",
            diff: "",
            xpTotal: "",
            xpPer: ""
        })
    }

    getXpForFight = () => {
        let players = this.props.players
        let difficulty = this.props.difficulty
        if (difficulty === ""){
            return false
        }
        let num
        let xp_total = 0
        if (difficulty === 'easy'){
            num = 0
        } else if (difficulty === 'medium'){
            num = 1
        } else if (difficulty === 'hard'){
            num = 2
        } else if (difficulty === 'deadly'){
            num = 3
        }

        for (let i in players) {
            xp_total += players[i].xp_range[num]
        }
        return xp_total
    }

    generateEncounter = () => {
        let xp_allowed = this.getXpForFight()
     
        if (xp_allowed === false){
            return
        }
        let monXp = 0;
        let env = this.props.environment
        let max = this.props.maxChallenge.value
        let min = this.props.minCr.value
        let max_string = this.props.maxChallenge.label
        let min_string = this.props.minCr.label
        let size = this.props.size
        let type = this.props.type
        let ar = []

        let condition1, condition2, condition3, condition4, condition5, condition6

        for (let i in monsters){

            if (env === 'any' || env === ''){
                condition1 = true
            } else {
                condition1 = monsters[i].environment.has(env)
            }

            if (size === 'any' || size === '') {
                condition2 = true
            } else {
                condition2 = monsters[i].size === size
            }

            if (type === 'any' || type === '') {
                condition3 = true
            } else {
                condition3 = monsters[i].type === type
            }

            if (max_string === 'any' || max_string === undefined) {
                condition4 = true
            } else {
                condition4 = monsters[i].xp <= max
            }

            if (min_string === 'any' || min_string === undefined) {
                condition5 = true
            } else {
                condition5 = monsters[i].xp >= min
            }

            if (monsters[i].xp > xp_allowed) {
                condition6 = false
            } else {
                condition6 = true
            }

            if (condition1 && condition2 && condition3 && condition4 && condition5 && condition6) {
                ar.push(monsters[i])
            }
        }

        let ar2 = []
        let monster, bol

        if (ar.length > 0) {
            while (true){
                if (xp_allowed <= 0) {
                    break;
                }
                monster = ar[Math.floor(Math.random() * ar.length)];

                if (xp_allowed - monster.xp < 0) {
                    bol = false
                    for (let i in ar){
                        if (xp_allowed - ar[i].xp >= 0){
                            monster = ar[i]
                            bol = true
                            break;
                        }
                    }
                }
                if (bol === false){
                    break
                }

                ar2.push(monster)
                xp_allowed -= monster.xp
                monXp += monster.xp
            }
        }
           let xpPer = Math.round(monXp / this.props.players.length);
        const countMonster = function(monster, ar){
            let counter = 0
            for (let i in ar){
                if (monster === ar[i]){
                    counter += 1
                }
            }
            monster.count = counter
        }
        for (let i in ar2){
            countMonster(ar2[i], ar2)
        }
        let returnVal = [...new Set(ar2)]
        this.setState({
            monsters: returnVal,
            monsterNum: ar2.length,
            players: this.props.players.length,
            diff: this.props.difficulty,
            xpPer: xpPer,
            xpTotal: monXp
        })
    }

    render(){
        return(
            <div>
                        <div className="breakdown">
                        <h5>Difficulty: <span className="monster-title5">{this.state.diff}</span></h5>
                        <div className="break-div">
                        <div className="break-stats">
                        <h3>Total Players:</h3>
                        <h3>Exp Per Player:</h3>
                        <h3>Encounter Exp:</h3>
                        <h3>Total Monsters: </h3>
                            </div>
                        <div className="break-stats">
                        <h4>{this.state.players}</h4>
                        <h4>{this.state.xpPer}</h4>
                        <h4>{this.state.xpTotal}</h4>
                        <h4>{this.state.monsterNum}</h4>
                            </div>
                        </div>
                        </div>
                <div className="buttons">
                <button className="sort-button" onClick={this.generateEncounter}>Generate</button>
                <button className="sort-button" onClick={this.clear}>Clear</button>
                </div>
                <div className="monster-div">
                    {this.state.monsters.map(monster =>(
                        <div data-aos="flip-right" className="monster-card">
                        <img src={monster.img_url} className="monster-pic" alt="monsterPic"></img>
                        <div className="monster-title">
                        <h1>{monster.name}</h1>
                        <h5>{monster.type} ({monster.size})</h5>
                         <span className="count">x{monster.count}</span> 
                        </div>
                        <div className="monster-info">
                        <div className="monster-stats">
                            <p className="stat-title">ARMOR CLASS</p>
                            <p className="stat">{monster.armorClass}</p>
                        </div>
                        <div className="monster-stats">
                            <p className="stat-title">HIT POINTS</p>
                            <p className="stat">{monster.hitPoints}</p>
                        </div>
                        <div className="monster-stats">
                            <p className="stat-title">SPEED</p>
                            <p className="stat">{monster.Speed}</p>
                        </div>
                        </div>
                        <div className="monster-info">
                        <div className="monster-stats">
                            <p className="stat-title">STR</p>
                            <p className="stat">{monster.STR} ({monster.STR_mod})</p>
                        </div>
                        <div className="monster-stats">
                            <p className="stat-title">DEX</p>
                            <p className="stat">{monster.DEX} ({monster.DEX_mod})</p>
                        </div>
                        <div className="monster-stats">
                            <p className="stat-title">CON</p>
                            <p className="stat">{monster.CON} ({monster.CON_mod})</p>
                        </div>
                        </div>
                        <div className="monster-info">
                        <div className="monster-stats">
                            <p className="stat-title">INT</p>
                            <p className="stat">{monster.INT} ({monster.INT_mod})</p>
                        </div>
                        <div className="monster-stats">
                            <p className="stat-title">WIS</p>
                            <p className="stat">{monster.WIS} ({monster.WIS_mod})</p>
                        </div>
                        <div className="monster-stats">
                            <p className="stat-title">CHA</p>
                            <p className="stat">{monster.CHA} ({monster.CHA_mod})</p>
                        </div>
                        </div>
                        <div className="exp-div1">
                        <div className="exp-div">
                            <h5>Experience Points  </h5><span className="monster-title2">{monster.xp} XP</span>
                        </div>
                        <div className="exp-div">
                            <h5>Challenge Raiting </h5><span className="monster-title2"> {monster.challenge_rating}</span>
                        </div>
                        <div className="exp-div">
                            <h5>Page Number </h5><span className="monster-title2"> {monster.page}</span>
                        </div>
                       
                       
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}


export default MonsterList;