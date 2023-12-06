'use strict';

const message_elm = document.getElementById("message");
const enemyname_elm = document.getElementById("enemyname");
const enemyhp_elm = document.getElementById("enemyhp");
const coins_elm = document.getElementById("coins");
const xp_elm = document.getElementById("xp");
const lv_elm = document.getElementById("lv");
const img_elm = document.getElementById("enderman");
const deathsound = new Audio('/snd/death.mp3');
const levelupsound = new Audio('/snd/levelup.mp3');
const need_xp = [40, 90, 170, 300, 500, 790, 1190, 1720, 2400, 3250, 4290, 5540, 7020, 8750, 10750, 13040, 15640, 18570, 21850, 25500, 29540, 33990, 38870, 44200, 50000, 56290, 63090, 70420, 78300, 86750, 95790, 105440, 115720, 126650, 138250, 150540, 163540, 177270, 191750, 207000, 223040, 239890, 257570, 276100, 295500, 315790, 336990, 359120, 382200, 406250];

let coins = 0;
let enemy_hp = 13000;
let enemy_id = 0; //0:Normal 1:Chest 2:Special
let xp = 0;
let lv = 0;

function clicked(){
    enemy_hp -= getAtk();
    if(enemy_id == 2){
        enemyhp_elm.innerText = `${enemy_hp}/2000`;
    }
    else{
        enemyhp_elm.innerText = `${enemy_hp}/13000`;
    }
    if(enemy_hp <= 0){
        deathsound.pause();
        deathsound.currentTime = 0;
        deathsound.play();
        switch(enemy_id){
            case 0:
                coins += (15 + Math.floor(Math.random() * 10));
                gainXP(40);
                break;
            case 1:
                coins += (1000 + Math.floor(Math.random() * 1000));
                gainXP(40);
                break;
            case 2:
                coins += (700000 + Math.floor(Math.random() * 200000));
                gainXP(40);
                break;
        }
        if(Math.floor(Math.random() * 420) == 0){
            enemy_id = 2;
            enemy_hp = 2000;
            enemyname_elm.innerText = "Special Zealot";
            enemyhp_elm.innerText = "2000/2000";
            img_elm.setAttribute('src', '/img/special.png');
        }
        else if(Math.floor(Math.random() * 20) == 0){
            enemy_id = 1;
            enemy_hp = 13000;
            enemyname_elm.innerText = "Zealot";
            enemyhp_elm.innerText = "13000/13000";
            img_elm.setAttribute('src', '/img/chest.png');
        }
        else{
            enemy_id = 0;
            enemy_hp = 13000;
            enemyname_elm.innerText = "Zealot";
            enemyhp_elm.innerText = "13000/13000";
            img_elm.setAttribute('src', '/img/normal.png');
        }
    }
}

function gainXP(got_xp){
    xp += got_xp;
    while(xp >= need_xp[lv]){
        lv++;
        levelupsound.play();
    }
}

function getAtk(){
    let atk = 1000;
    atk += lv * 100;
    return atk;
}

window.addEventListener('DOMContentLoaded', function(){
    this.setInterval(() => {
        coins_elm.innerText = `${coins} Coins`;
        xp_elm.innerText = `${xp} XP (Next: ${need_xp[lv]-xp}XP)`;
        lv_elm.innerText = `Lv.${lv}`;
        if(enemy_id == 2){
            message_elm.innerText = "SPECIAL ZEALOT!";
        }
        else{
            message_elm.innerText = "Welcome to Zealot Clicker";
        }
    }, 100);
});