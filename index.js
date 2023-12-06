'use strict';

const message_elm = document.getElementById("message");
const enemyname_elm = document.getElementById("enemyname");
const enemyhp_elm = document.getElementById("enemyhp");
const coins_elm = document.getElementById("coins");
const xp_elm = document.getElementById("xp");
const lv_elm = document.getElementById("lv");
const img_elm = document.getElementById("enderman");
const gotcoins_elm = document.getElementById("got-coins");
const gotxp_elm = document.getElementById("got-xp");
const levelup_elm = document.getElementById("levelup");
const title_elm = document.getElementById("title");
const critmessage_elm = document.getElementById("crit-message");
const dialog_elm = document.getElementById("statistics-dialog");
const playedtime_elm = document.getElementById("playedtime");
const totalcoins_elm = document.getElementById("totalcoins");
const totalkills_elm = document.getElementById("totalkills");
const totaldamages_elm = document.getElementById("totaldamages");
const youratk_elm = document.getElementById("youratk");
const yourctc_elm = document.getElementById("yourctc");
const yourctd_elm = document.getElementById("yourctd");
const yourxp_elm = document.getElementById("yourxp");
const yourlv_elm = document.getElementById("yourlv");
const shop_elm = [document.getElementById("item0"), document.getElementById("item1"), document.getElementById("item2"), document.getElementById("item3")];
const description_elm = [document.getElementById("description0"), document.getElementById("description1"), document.getElementById("description2"), document.getElementById("description3")];
const deathsound = new Audio('./snd/death.ogg');
const attacksound = [new Audio('./snd/attack1.ogg'), new Audio('./snd/attack2.ogg'), new Audio('./snd/attack3.ogg'), new Audio('./snd/attack4.ogg')];
const critsound = new Audio('./snd/crit.ogg');
const levelupsound = new Audio('./snd/levelup.ogg');
const buysound = new Audio('./snd/buy.ogg');
const need_xp = [40, 90, 170, 300, 500, 790, 1190, 1720, 2400, 3250, 4290, 5540, 7020, 8750, 10750, 13040, 15640, 18570, 21850, 25500, 29540, 33990, 38870, 44200, 50000, 56290, 63090, 70420, 78300, 86750, 95790, 105440, 115720, 126650, 138250, 150540, 163540, 177270, 191750, 207000, 223040, 239890, 257570, 276100, 295500, 315790, 336990, 359120, 382200, 406250];
const item_list = [
    {name: "Rogue Sword", description: "ATK+100\nReduce attacking cool time by 100ms", cost: 100, need_lv: 2},
    {name: "Tactician's Sword", description: "ATK+(Your Zealot Kills(Capped 10000))\nIncrease CritChance 20%", cost: 500, need_lv: 5},
    {name: "Aspect of the End", description: "ATK+300\nNo cool time on your first attack", cost: 2000, need_lv: 5},
    {name: "Raider Axe", description: "ATK+300\nEarn +20 coins from monster kills", cost: 2000, need_lv: 8},
    {name: "Emerald Blade", description: "ATK+500\nATK+(Square root of Your Coins (Capped 100M))", cost: 5000, need_lv: 11},
    {name: "Soul Whip", description: "ATK+500\nExcess damage will overflow", cost: 100000, need_lv: 15},
];

let coins = 0;
let enemy_hp = 13000;
let enemy_id = 0; //0:Normal 1:Chest 2:Special
let xp = 0;
let lv = 0;
let can_attack = true;
let boughtitem_flag = [false, false, false, false, false, false];
let shoplist = [0, 1, 2, 3];
let killflag = false;
let excess_damage = 0;

let statistics = {
    playedtime: 0,
    totalcoins: 0,
    totalkills: 0,
    totaldamages: 0,
}

function clicked(overflow = -1) {
    if (can_attack || overflow != -1) {
        if(overflow == -1){
            enemy_hp -= getAtk();
            statistics.totaldamages += getAtk();
            document.cookie = `dmg=${statistics.totaldamages}`;
        }
        else{
            enemy_hp -= overflow;
        }
        if (enemy_id == 2) {
            enemyhp_elm.innerText = `${enemy_hp}/2000`;
        }
        else {
            enemyhp_elm.innerText = `${enemy_hp}/13000`;
        }
        if (enemy_hp <= 0) {
            deathsound.pause();
            deathsound.currentTime = 0;
            deathsound.play();
            statistics.totalkills++;
            document.cookie = `kills=${statistics.totalkills}`;
            killflag = true;
            excess_damage = -enemy_hp;
            switch (enemy_id) {
                case 0:
                    gotCoins(15 + Math.floor(Math.random() * 10));
                    gainXP(40 + Math.floor(Math.random() * 10));
                    break;
                case 1:
                    gotCoins(1000 + Math.floor(Math.random() * 1000));
                    gainXP(40 + Math.floor(Math.random() * 100));
                    break;
                case 2:
                    gotCoins(700000 + Math.floor(Math.random() * 200000));
                    gainXP(40 + Math.floor(Math.random() * 200));
                    break;
            }
            if (Math.floor(Math.random() * 240) == 0) {
                enemy_id = 2;
                enemy_hp = 2000;
                enemyname_elm.innerText = "Special Zealot";
                enemyhp_elm.innerText = "2000/2000";
                img_elm.setAttribute('src', './img/special.png');
                title_elm.style.opacity = "1";
                title_elm.innerText = "Special Zealot!";
                setTimeout(() => {
                    title_elm.style.opacity = "0";
                }, 3000);
            }
            else if (Math.floor(Math.random() * 20) == 0) {
                enemy_id = 1;
                enemy_hp = 13000;
                enemyname_elm.innerText = "Zealot";
                enemyhp_elm.innerText = "13000/13000";
                img_elm.setAttribute('src', './img/chest.png');
            }
            else {
                enemy_id = 0;
                enemy_hp = 13000;
                enemyname_elm.innerText = "Zealot";
                enemyhp_elm.innerText = "13000/13000";
                img_elm.setAttribute('src', './img/normal.png');
            }
            if(boughtitem_flag[5]){
                clicked(excess_damage);
            }
        }
        else{
            attacksound[Math.floor(Math.random() * 4)].play();
            img_elm.style = "filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(358deg) brightness(55%);";
            can_attack = false;
            setTimeout(() => {
                img_elm.style = "";
                can_attack = true;
            }, (overflow==-1)?(getCooltime()):(0));
            killflag = false;
            excess_damage = 0;
        }
    }

}

function gotCoins(got_coins){
    if(boughtitem_flag[3]){
        got_coins += 20;
    }
    coins += got_coins;
    statistics.totalcoins += got_coins;
    document.cookie = `totalcoins=${statistics.totalcoins}`;
    document.cookie = `coins=${coins}`;
    popup(0, got_coins);
}

function gainXP(got_xp) {
    xp += got_xp;
    document.cookie = `xp=${xp}`;
    popup(1, got_xp);
    while (xp >= need_xp[lv]) {
        lv++;
        popup(2);
        levelupsound.play();
    }
}

function getAtk(nocrit = false) {
    let atk = 1000;
    atk += lv * 100;
    if(boughtitem_flag[0]){
        atk += 100;
    }
    if(boughtitem_flag[1]){
        atk += Math.min(statistics.totalkills, 10000);
    }
    if(boughtitem_flag[2]){
        atk += 300;
    }
    if(boughtitem_flag[3]){
        atk += 300;
    }
    if(boughtitem_flag[4]){
        atk += 500;
        atk += Math.min(Math.floor(Math.sqrt(coins)), 10000);
    }
    if(boughtitem_flag[5]){
        atk += 300;
    }

    if(!nocrit && Math.floor(Math.random() * 100) < getCritChance()){
        atk *= getCritDamage();
        critsound.play();
        critmessage_elm.style.opacity = "1";
        setTimeout(() => {
            critmessage_elm.style.opacity = "0";
        }, 500);
    }
    return atk;
}

function getCritChance(){
    let critchance = 5;
    if(boughtitem_flag[1]){
        critchance += 20;
    }
    return critchance;
}

function getCritDamage(){
    return 2.0;
}

function getCooltime() {
    let cooltime = 500;
    if(boughtitem_flag[0]){
        cooltime -= 100;
    }
    if(boughtitem_flag[2] && killflag){
        cooltime = 0;
    }
    return cooltime;
}

function popup (type, value = 0){
    switch(type){
        case 0:
            gotcoins_elm.innerText = `+${value} Coins`;
            gotcoins_elm.style.opacity = "1";
            setTimeout(() => {
                gotcoins_elm.style.opacity = "0";
            }, 1000);
            break;
        case 1:
            gotxp_elm.innerText = `+${value} XP`;
            gotxp_elm.style.opacity = "1";
            setTimeout(() => {
                gotxp_elm.style.opacity = "0";
            }, 1000);
            break;
        case 2:
            levelup_elm.style.opacity = "1";
            setTimeout(() => {
                levelup_elm.style.opacity = "0";
            }, 1000);
            break;
    }
}

function openDialog(){
    totalcoins_elm.innerText = `Coins Gained: ${statistics.totalcoins} Coins`;
    totalkills_elm.innerText = `Zealot Kills: ${statistics.totalkills} Kills`;
    totaldamages_elm.innerText = `Total Damages: ${statistics.totaldamages} Damages`;
    youratk_elm.innerText = `ATK: ${getAtk(true)}`;
    yourctc_elm.innerText = `Crit Chance: ${getCritChance()}%`;
    yourctd_elm.innerText = `Crit Damage: +${getCritDamage()*100-100}%`;
    yourxp_elm.innerText = `Total XP: ${xp}`;
    yourlv_elm.innerText = `Level: ${(Math.floor(((lv==0)?(xp/40):(lv+(xp-need_xp[lv-1])/(need_xp[lv]-need_xp[lv-1])))*100)/100).toFixed(2)}`;
    dialog_elm.showModal();
}

function closeDialog(){
    dialog_elm.close();
}

function buyItem(index = -1){
    if(index == -1){
        let loaded_item = 0;
        for(let i = 0;i < item_list.length && loaded_item <= 3;i++){
            if(!boughtitem_flag[i]){
                shoplist[loaded_item] = i;
                shop_elm[loaded_item].setAttribute('src', `./img/items/${i}.png`);
                description_elm[loaded_item].innerText = `${item_list[i].name}\n${item_list[i].cost} Coins / Lv${item_list[i].need_lv} needed\n${item_list[i].description}`;
                loaded_item++;
            }
        }
        while(loaded_item <= 3){
            shoplist[loaded_item] = -1;
            shop_elm[loaded_item].setAttribute('src', `./img/items/soldout.png`);
            description_elm[loaded_item].innerText = "";
            loaded_item++;
        }
        return;
    }
    else if(shoplist[index] != -1 && item_list[shoplist[index]].need_lv <= lv && item_list[shoplist[index]].cost <= coins){
        buysound.play();
        coins -= item_list[shoplist[index]].cost;
        boughtitem_flag[shoplist[index]] = true;
        document.cookie = `coins=${coins}`;
        let itemlist_cookie = "itemlist=";
        for(let i = 0;i < item_list.length;i++){
            if(boughtitem_flag[i]){
                itemlist_cookie += "1";
            }
            else{
                itemlist_cookie += "0";
            }
        }
        document.cookie = itemlist_cookie;
        let loaded_item = 0;
        for(let i = 0;i < item_list.length && loaded_item <= 3;i++){
            if(!boughtitem_flag[i]){
                shoplist[loaded_item] = i;
                shop_elm[loaded_item].setAttribute('src', `./img/items/${i}.png`);
                description_elm[loaded_item].innerText = `${item_list[i].name}\n${item_list[i].cost} Coins / Lv${item_list[i].need_lv} needed\n${item_list[i].description}`;
                loaded_item++;
            }
        }
        while(loaded_item <= 3){
            shoplist[loaded_item] = -1;
            shop_elm[loaded_item].setAttribute('src', `./img/items/soldout.png`);
            description_elm[loaded_item].innerText = "";
            loaded_item++;
        }
    }
}

function deleteData(){
    if(window.confirm('Are you sure you want to delete savedata?')){
        document.cookie = "coins=; max-age=0";
        document.cookie = "xp=; max-age=0";
        document.cookie = "itemlist=; max-age=0";
        document.cookie = "time=; max-age=0";
        document.cookie = "totalcoins=; max-age=0";
        document.cookie = "kills=; max-age=0";
        document.cookie = "dmg=; max-age=0";
        coins = 0;
        enemy_hp = 13000;
        enemy_id = 0;
        xp = 0;
        lv = 0;
        can_attack = true;
        boughtitem_flag = [false, false, false, false];
        shoplist = [0, 1, 2, 3];
        killflag = false;
        statistics = {
            playedtime: 0,
            totalcoins: 0,
            totalkills: 0,
            totaldamages: 0,
        }
        buyItem();
        window.alert('Savedata has been successfully deleted.');
    }
}

window.addEventListener('DOMContentLoaded', function () {
    document.cookie.split('; ').forEach(function(value){
        let content = value.split('=');
        if(content[0] == "coins"){
            coins = Number(content[1]);
        }
        else if(content[0] == "xp"){
            xp = Number(content[1]);
            for(;lv < need_xp.length && xp >= need_xp[lv];lv++){}
        }
        else if(content[0] == "itemlist"){
            for(let i = 0;i < content[1].length;i++){
                if(content[1].charAt(i) == '1'){
                    boughtitem_flag[i] = true;
                }
                else{
                    boughtitem_flag[i] = false;
                }
            }
        }
        else if(content[0] == "time"){
            statistics.playedtime = Number(content[1]);
        }
        else if(content[0] == "totalcoins"){
            statistics.totalcoins = Number(content[1]);
        }
        else if(content[0] == "kills"){
            statistics.totalkills = Number(content[1]);
        }
        else if(content[0] == "dmg"){
            statistics.totaldamages = Number(content[1]);
        }
    })
    buyItem();
    this.setInterval(() => {
        statistics.playedtime = Math.floor((statistics.playedtime+0.1)*10)/10;
        document.cookie = `time=${statistics.playedtime}`;
        playedtime_elm.innerText = `Total Played Time: ${Math.floor(statistics.playedtime/3600)}:${('00'+Math.floor(statistics.playedtime/60)%60).slice(-2)}:${('00'+Math.floor(statistics.playedtime)%60).slice(-2)}`
        coins_elm.innerText = `${coins} Coins`;
        xp_elm.innerText = `${xp} XP (Next: ${need_xp[lv] - xp}XP)`;
        lv_elm.innerText = `Lv.${lv}`;
        if (enemy_id == 2) {
            message_elm.innerText = "SPECIAL ZEALOT!";
        }
        else {
            message_elm.innerText = "Welcome to Zealot Clicker";
        }
    }, 100);
});

dialog_elm.addEventListener('click', (event) => {
    if(event.target.closest('#dialog-container') === null) {
        dialog_elm.close();
    }
});