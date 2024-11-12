'use strict';

const message_elm = document.getElementById("message");
const enemyname_elm = document.getElementById("enemyname");
const enemyhp_elm = document.getElementById("enemyhp");
const coins_elm = document.getElementById("coins");
const xp_elm = document.getElementById("xp");
const lv_elm = document.getElementById("lv");
const img_elm = document.getElementById("enderman");
const popup_elm = [document.getElementById("got-coins"), document.getElementById("got-xp"), document.getElementById("levelup")];
const title_elm = document.getElementById("title");
const critmessage_elm = document.getElementById("crit-message");
const dialog_elm = [document.getElementById("statistics-dialog"), document.getElementById("slayer-dialog")];
const playedtime_elm = document.getElementById("playedtime");
const totalcoins_elm = document.getElementById("totalcoins");
const totalkills_elm = document.getElementById("totalkills");
const totaldamages_elm = document.getElementById("totaldamages");
const youratk_elm = document.getElementById("youratk");
const yourctc_elm = document.getElementById("yourctc");
const yourctd_elm = document.getElementById("yourctd");
const yourzealuck_elm = document.getElementById("yourzealuck");
const yourxp_elm = document.getElementById("yourxp");
const yourlv_elm = document.getElementById("yourlv");
const slayerstatus_elm = [document.getElementById("tier1-status"), document.getElementById("tier2-status"), document.getElementById("tier3-status"), document.getElementById("tier4-status")];
const shop_elm = [document.getElementById("item0"), document.getElementById("item1"), document.getElementById("item2"), document.getElementById("item3")];
const description_elm = [document.getElementById("description0"), document.getElementById("description1"), document.getElementById("description2"), document.getElementById("description3")];
const deathsound = new Audio('snd/death.ogg');
const attacksound = [new Audio('snd/attack1.ogg'), new Audio('snd/attack2.ogg'), new Audio('snd/attack3.ogg'), new Audio('snd/attack4.ogg')];
const critsound = new Audio('snd/crit.ogg');
const levelupsound = new Audio('snd/levelup.ogg');
const buysound = new Audio('snd/buy.ogg');
const item_list = [
    {name: "Rogue Sword", description: "ATK+100\nReduce attacking cool time by 100ms", cost: 100, need_lv: 2},
    {name: "Tactician's Sword", description: "ATK+(Your Zealot Kills)\nIncrease CritChance 20%", cost: 500, need_lv: 5},
    {name: "Aspect of the End", description: "ATK+300\nNo cool time on your first attack", cost: 2000, need_lv: 5},
    {name: "Raider Axe", description: "ATK+300\nEarn +20 coins from monster kills", cost: 2000, need_lv: 8},
    {name: "Emerald Blade", description: "ATK+500\nATK+(Square root of Your Coins)", cost: 5000, need_lv: 11},
    {name: "Soul Whip", description: "ATK+500\nExcess damage will overflow", cost: 100000, need_lv: 15},
];
const slayer_hplist = [100000, 250000, 500000, 1000000];
const slayer_costlist = [10000, 100000, 1000000, 3000000];

let coins = 0;
let enemy_hp = 13000;
let enemy_maxhp = 13000;
let enemy_id = 0; //0:Normal 1:Chest 2:Special
let xp = 0;
let lv = 0;
let can_attack = true;
let boughtitem_flag = [false, false, false, false, false, false];
let shoplist = [0, 1, 2, 3];
let killflag = false;
let excess_damage = 0;
let challenge_slayer = -1;
let slayer_timelimit = 0;
let slayer_cleared = [false, false, false, false];
let statistics = {
    playedtime: 0,
    totalcoins: 0,
    totalkills: 0,
    totaldamages: 0,
}

function clicked(overflow = -1, before_coins = 0, before_xp = 0) {
    if (can_attack || overflow != -1) {
        if(overflow == -1){
            enemy_hp -= getAtk();
            statistics.totaldamages += getAtk();
            document.cookie = `dmg=${statistics.totaldamages}`;
        }
        else{
            enemy_hp -= overflow;
        }
        enemyhp_elm.innerText = `${enemy_hp}/${enemy_maxhp}`;
        if (enemy_hp <= 0) {
            let reward_coins = before_coins;
            let reward_xp = before_xp;
            if(overflow == -1){
                deathsound.pause();
                deathsound.currentTime = 0;
                deathsound.play();
            }
            statistics.totalkills++;
            document.cookie = `kills=${statistics.totalkills}`;
            killflag = true;
            excess_damage = -enemy_hp;
            switch (enemy_id) {
                case 0:
                    reward_coins += 15 + Math.floor(Math.random() * 10);
                    reward_xp += 15 + Math.floor(Math.random() * 10);
                    break;
                case 1:
                    reward_coins += 1000 + Math.floor(Math.random() * 1000);
                    reward_xp += 40 + Math.floor(Math.random() * 100);
                    break;
                case 2:
                    reward_coins += 700000 + Math.floor(Math.random() * 200000);
                    reward_xp += 40 + Math.floor(Math.random() * 200);
                    break;
                case 3:
                    slayer_cleared[challenge_slayer] = true;
                    let slayer_cookie = "slayer=";
                    for(let i = 0;i < slayer_cleared.length;i++){
                        if(slayer_cleared[i]){
                            slayer_cookie += "1";
                        }
                        else{
                            slayer_cookie += "0";
                        }
                    }
                    document.cookie = slayer_cookie;
                    switch(challenge_slayer){
                        case 0:
                            reward_coins += 300 + Math.floor(Math.random() * 200);
                            reward_xp += 1000 + Math.floor(Math.random() * 1000);
                            break;
                        case 1:
                            reward_coins += 600 + Math.floor(Math.random() * 400);
                            reward_xp += 2000 + Math.floor(Math.random() * 2000);
                            break;
                        case 2:
                            reward_coins += 1200 + Math.floor(Math.random() * 800);
                            reward_xp += 10000 + Math.floor(Math.random() * 10000);
                            break;
                        case 3:
                            reward_coins += 2400 + Math.floor(Math.random() * 1600);
                            reward_xp += 100000 + Math.floor(Math.random() * 100000);
                            break;
                    }
                    showTitle(`Enderman Slayer Tier${challenge_slayer+1} Cleared!`, 3000);
                    challenge_slayer = -1;
                    excess_damage = 0;
                    break;
            }
            summonZealot(true);
            if(boughtitem_flag[5] && excess_damage > 0){
                clicked(excess_damage, reward_coins, reward_xp);
            }
            else{
                gotCoins(reward_coins);
                gainXP(reward_xp);
            }
        }
        else{
            if(overflow!=-1){
                gotCoins(before_coins);
                gainXP(before_xp);
            }
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

function summonZealot(random=true){
    if (random && Math.floor(Math.random() * 24000)/100 <= getSpecialChance()) {
        enemy_id = 2;
        enemy_hp = 2000;
        enemy_maxhp = 2000;
        enemyname_elm.innerText = "Special Zealot";
        enemyhp_elm.innerText = "2000/2000";
        message_elm.innerText = "SPECIAL ZEALOT!";
        img_elm.setAttribute('src', 'img/special.png');
        showTitle("Special Zealot!", 3000);
    }
    else if (random && Math.floor(Math.random() * 20) == 0) {
        enemy_id = 1;
        enemy_hp = 13000;
        enemy_maxhp = 13000;
        enemyname_elm.innerText = "Zealot";
        enemyhp_elm.innerText = "13000/13000";
        message_elm.innerText = "Welcome to Zealot Clicker";
        img_elm.setAttribute('src', 'img/chest.png');
    }
    else {
        enemy_id = 0;
        enemy_hp = 13000;
        enemy_maxhp = 13000;
        enemyname_elm.innerText = "Zealot";
        enemyhp_elm.innerText = "13000/13000";
        message_elm.innerText = "Welcome to Zealot Clicker";
        img_elm.setAttribute('src', 'img/normal.png');
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
    while (xp >= getNeedXP(lv)) {
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
        atk += statistics.totalkills;
    }
    if(boughtitem_flag[2]){
        atk += 300;
    }
    if(boughtitem_flag[3]){
        atk += 300;
    }
    if(boughtitem_flag[4]){
        atk += 500;
        atk += Math.floor(Math.sqrt(coins));
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

function getNeedXP(level){
    return 40*(level+1)+(level*(level+1)*(2*level+1)/6)*10;
}

let popup_timer_id = [];
function popup (type, value = 0){
    switch(type){
        case 0:
            popup_elm[type].innerText = `+${value} Coins`;
            break;
        case 1:
            popup_elm[type].innerText = `+${value} XP`;
            break;
        case 2:
            break;
    }
    clearTimeout(popup_timer_id[type]);
    popup_elm[type].style.opacity = "1";
    popup_timer_id[type] = setTimeout(() => {
        popup_elm[type].style.opacity = "0";
    }, 1000);
}

function getSpecialChance(){
    let chance = 1;
    if(slayer_cleared[0]){
        chance += 0.1;
    }
    if(slayer_cleared[1]){
        chance += 0.15;
    }
    if(slayer_cleared[2]){
        chance += 0.2;
    }
    if(slayer_cleared[3]){
        chance += 0.25;
    }
    return chance;
}

function openDialog(id){
    if(id == 0){
        totalcoins_elm.innerText = `Coins Gained: ${statistics.totalcoins} Coins`;
        totalkills_elm.innerText = `Zealot Kills: ${statistics.totalkills} Kills`;
        totaldamages_elm.innerText = `Total Damages: ${statistics.totaldamages} Damages`;
        youratk_elm.innerText = `ATK: ${getAtk(true)} (Base 1000 + Level Bonus ${lv}x100 + Other Bonus ${getAtk(true)-lv*100})`;
        yourctc_elm.innerText = `Crit Chance: ${getCritChance()}%`;
        yourctd_elm.innerText = `Crit Damage: +${getCritDamage()*100-100}%`;
        yourzealuck_elm.innerText = `Zealuck: +${Math.round(getSpecialChance()*100-100)}%`;
        yourxp_elm.innerText = `Total XP: ${xp}`;
        yourlv_elm.innerText = `Level: ${(Math.floor(((lv==0)?(xp/40):(lv+(xp-getNeedXP(lv-1))/(getNeedXP(lv)-getNeedXP(lv-1))))*100)/100).toFixed(2)}`;
    }
    else if(id == 1){
        for(let i = 0;i < slayerstatus_elm.length;i++){
            if((i==0 && lv>=5) || (i!=0 && slayer_cleared[i-1])){
                if(slayer_cleared[i]){
                    slayerstatus_elm[i].innerText = `Cleared!`;
                    slayerstatus_elm[i].style.color = "#00FF00";
                }
                else{
                    slayerstatus_elm[i].innerText = `Not Cleared Yet`;
                    slayerstatus_elm[i].style.color = "#FF0000";
                }
            }
            else{
                slayerstatus_elm[i].innerText = `Locked`;
                slayerstatus_elm[i].style.color = "#666666";
            }
        }
        
    }
    dialog_elm[id].showModal();
}

function closeDialog(id=-1){
    if(id==-1){
        dialog_elm.forEach(function(elm){
            elm.close();
        })
    }
    else{
        dialog_elm[id].close();
    }
}

let title_timer_id;
function showTitle(text, ms){
    title_elm.style.opacity = "1";
    title_elm.innerText = text;
    clearTimeout(title_timer_id);
    title_timer_id = setTimeout(() => {
        title_elm.style.opacity = "0";
    }, ms);
}

function buyItem(index = -1){
    if(index == -1){
        let loaded_item = 0;
        for(let i = 0;i < item_list.length && loaded_item <= 3;i++){
            if(!boughtitem_flag[i]){
                shoplist[loaded_item] = i;
                shop_elm[loaded_item].setAttribute('src', `img/items/${i}.png`);
                description_elm[loaded_item].innerText = `${item_list[i].name}\n${item_list[i].cost} Coins / Lv${item_list[i].need_lv} needed\n${item_list[i].description}`;
                loaded_item++;
            }
        }
        while(loaded_item <= 3){
            shoplist[loaded_item] = -1;
            shop_elm[loaded_item].setAttribute('src', `img/items/soldout.png`);
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
                shop_elm[loaded_item].setAttribute('src', `img/items/${i}.png`);
                description_elm[loaded_item].innerText = `${item_list[i].name}\n${item_list[i].cost} Coins / Lv${item_list[i].need_lv} needed\n${item_list[i].description}`;
                loaded_item++;
            }
        }
        while(loaded_item <= 3){
            shoplist[loaded_item] = -1;
            shop_elm[loaded_item].setAttribute('src', `img/items/soldout.png`);
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

function challengeSlayer(tier){
    if(((tier==0 && lv>=5) || (tier!=0 && slayer_cleared[tier-1])) && coins >= slayer_costlist[tier]){
        coins -= slayer_costlist[tier];
        closeDialog();
        slayer_timelimit = 30;
        challenge_slayer = tier;
        enemy_id = 3;
        enemy_hp = slayer_hplist[tier];
        enemy_maxhp = slayer_hplist[tier];
        enemyname_elm.innerText = "Voidgloom Seraph";
        enemyhp_elm.innerText = `${slayer_hplist[tier]}/${slayer_hplist[tier]}`;
        img_elm.setAttribute('src', 'img/normal.png');
    }
}

function loadCookie(){
    document.cookie.split('; ').forEach(function(value){
        let content = value.split('=');
        if(content[0] == "coins"){
            coins = Number(content[1]);
        }
        else if(content[0] == "xp"){
            xp = Number(content[1]);
            for(;xp >= getNeedXP(lv);lv++){}
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
        else if(content[0] == "slayer"){
            for(let i = 0;i < content[1].length;i++){
                if(content[1].charAt(i) == '1'){
                    slayer_cleared[i] = true;
                }
                else{
                    slayer_cleared[i] = false;
                }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', function () {
    loadCookie();
    buyItem();
    summonZealot(false);
    this.setInterval(() => {
        statistics.playedtime = Math.floor((statistics.playedtime+0.11)*10)/10;
        document.cookie = `time=${statistics.playedtime}`;
        playedtime_elm.innerText = `Total Played Time: ${Math.floor(statistics.playedtime/3600)}:${('00'+Math.floor(statistics.playedtime/60)%60).slice(-2)}:${('00'+Math.floor(statistics.playedtime)%60).slice(-2)}`
        coins_elm.innerText = `${coins} Coins`;
        xp_elm.innerText = `${xp} XP (Next: ${getNeedXP(lv) - xp}XP)`;
        lv_elm.innerText = `Lv.${lv}`;
        if(challenge_slayer >= 0){
            slayer_timelimit -= 0.1;
            message_elm.innerText = `(${slayer_timelimit.toFixed(1)}) Challenging Enderman Slayer ${challenge_slayer+1} (${slayer_timelimit.toFixed(1)})`;
            if(slayer_timelimit <= 0){
                challenge_slayer = -1;
                summonZealot(false);
                message_elm.innerText = "Slayer failed...";
            }
        }
    }, 100);
});

dialog_elm.forEach(function(elm){
    elm.addEventListener('click', (event) => {
        if(event.target.closest('.dialog-container') === null) {
            elm.close();
        }
    });
})