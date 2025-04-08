//променливи
// aaaa
//bbbbbbbbbbb
var checkersBoard=[];
var checkers=[];
var button=0;
var pos=null;
var turn=1;

var pos1X=0;
var pos1Y=0;
var pos3X=0;
var pos3Y=0;
var pos4X=0;
var pos4Y=0;

var square1=null;
var square2=null;
var pull1=null;

var possibleMoves=[];
var countPossibleMoves=0;

var num=0;

//масив, който представлява самата дъска и пуловете - 1 - черни, -1 - бели
var igra=[[0,-1,0,-1,0,-1,0,-1],
          [-1,0,-1,0,-1,0,-1,0],
          [0,-1,0,-1,0,-1,0,-1],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [1,0,1,0,1,0,1,0],
          [0,1,0,1,0,1,0,1],
          [1,0,1,0,1,0,1,0]];


// въртене на дъската с мишката
var orbit=orbit(100,0);
orbit.maxDistance = 200;
orbit.minDistance = 50;



//инициализация          
cube([0.8,0.8,-13.5],[80,80,1],"black"); //рамка на таблата


for(var j=9;j<73;j=j+9){
    for(var i=9;i<73;i=i+9){
        var plocha=cube([i-40,j-40,-13],[9,9,1],rgb(255*((i+j)%2),255*((i+j)%2),255*((i+j)%2)));
        var aa=7-(Math.abs((j)/9)-1);
        var bb=(Math.abs((i)/9)-1);
        plocha.id=aa+" "+bb;
        plocha.addEventListener("pointerDown",movingPull);
        checkersBoard.push(plocha); //таблата

        if((29>=j)&&(i+j)%2==0){
            var a = cylinder([i-40,j-40,-12.6],[8.5,1],rgb(92, 64, 51)).style({spinV:90});
            a.addEventListener("pointerDown",clickedBlackPull)
            checkers.push(a); //кафяви пулта 
            
        }
        if((j>=53)&&(i+j)%2==0){
            var a =cylinder([i-40,j-40,-12.6],[8.5,1],rgb(228,213,183)).style({spinV:90});
            a.addEventListener("pointerDown",clickedWhitePull);
            checkers.push(a); // бежови пулта
        }
    }
}

tutorialStep(button); //викаме функцията, която представлява 90% от сайта  

// вградена функция на белите пулове, която показва плочките, на които може да се движи
function clickedWhitePull(event){
    possibleMoves=[];
    possiblePullMoves(this);
    
}

// вградена функция на черните пулове, която показва плочките, на които може да се движи
function clickedBlackPull(event){
    possibleMoves=[];
    possiblePullMoves(this);

}

// функция, която търси възможните плочки за движения на даден пул, алгоритъмът е ужасен, логиката може би има, но на места няма. Има много за оправяне, 
// на моменти бъгва и съм сигурна, че има много по-оптимизиран начин ..., но важното е да сме живи и здрави (моля ви, пропуснете кода важното е, че знаете
// за какво се предполага да работи :) ) 
function possiblePullMoves(pull){

    //тука си създавам временни променливи и използвам id-тата като индекси после в масива (знам, че е непрактично, но тогава нямах добри идеи и още нямам)
    pos1Y=((pull.x+40)/9)-1; 
    pos1X=8-((pull.y+40)/9);
    var pullProperty=igra[pos1X][pos1Y];
    var flagRight=true; //+1
    var flagLeft=true; //-1
    var nRight=1;
    var nLeft=-1;

    //следващите редове са проверки дали има празно място или пул и това е като цяло главната идея, НО Е УЖАСНА
    if(turn==pullProperty && flagRight){
        pull1=pull;

        if(igra[pos1X-(pullProperty)][pos1Y+1]==0 ){ 
                    pos3X=(7-(pos1X-(pullProperty*nRight)))*8;
                    pos3Y=pos1Y+nRight;
                    square1=checkersBoard[(pos3X)+pos3Y];
                    checkersBoard[pos3X+pos3Y].color="yellow";
                    possibleMoves.push(checkersBoard[(pos3X)+pos3Y]);
                    flagRight=false;
        }else{
            while(flagRight){

                if(igra[pos1X-(pullProperty*nRight)][pos1Y+nRight]==-1*pullProperty &&  igra[pos1X-((pullProperty* nRight)-(1*pullProperty))][pos1Y+nRight+1]==0){
                    pos3X=(7-(pos1X-(pullProperty* nRight)-(1*pullProperty)))*8;
                    pos3Y=pos1Y+nRight+1;
                    checkersBoard[pos3X+pos3Y].color="yellow";
                    possibleMoves.push(checkersBoard[pos3X+pos3Y]);
                    nRight+=2;
                }else{
                    flagRight=false;
                }
            }
         }
        }

        
    if(turn==pullProperty && flagLeft){

        if(igra[pos1X-pullProperty][pos1Y-1]==0 ){
                pos3X=(7-(pos1X-(pullProperty)))*8;
                pos3Y=pos1Y+nLeft;
                square1=checkersBoard[(pos3X)+pos3Y];
                checkersBoard[pos3X+pos3Y].color="yellow";
                possibleMoves.push(checkersBoard[(pos3X)+pos3Y]);
                flagLeft=false;
        } else{
             while(flagLeft){

            if(igra[pos1X+(pullProperty*nLeft)][pos1Y+nLeft]==-1*pullProperty &&  igra[pos1X+((pullProperty*nLeft)-(1*pullProperty))][pos1Y+nLeft-1]==0){
                pos3X=(7-(pos1X+(pullProperty*nLeft)-(1*pullProperty)))*8;
                pos3Y=pos1Y+nLeft-1;
                checkersBoard[pos3X+pos3Y].color="yellow";
                possibleMoves.push(checkersBoard[pos3X+pos3Y]);
                nLeft+=-2;
            }else{
                flagLeft=false;
            }
            }
        }

       
    }

    
  
    


}

// функция за местене на даден пул, като проверяваме дали "натиснатата" плочка е в 
//масива с възможни плочки за движение
function movingPull(event){

    var newPos=this;
    if(possibleMoves.indexOf(newPos)!=-1){
        pull1.center=this.center;
        var con=igra[pos1X][pos1Y];
        igra[pos1X][pos1Y]=0;
        var num =this.id.split(' ').map(Number);
        igra[num[0]][num[1]]=con;
        turn*=-1;
        possibleMoves=[];

    }
    
}


//бутон от урока, който сменя "страницата" напред
function nextButton(){
    if(button<8&&button>-1){
        button+=1;
        tutorialStep(button);
    }


}

//бутон от урока, който сменя "страницата" назад
function previuosButton(){
    if(button<8&&button>-1){
        button-=1;
        tutorialStep(button);
        // console.log(button);
    }
}

//бутон от готното меню, който мести потребителя направо към играта или урока, ако нещо не му е "ясно" 
function buttonPlay(){
    if(button<7&&button>-1){
        button=7;
        document.getElementsByClassName("topMenuButton")[0].innerHTML="ПРАВИЛА";
        tutorialStep(button);
        console.log(button);
    }else if(button==7){
        console.log(button);
        button=0;
        document.getElementsByClassName("topMenuButton")[0].innerHTML="ИГРАЙ";
        tutorialStep(button);
    }
}

//модалът ми не работеше 
// function onClickImg(){
//     console.log(this)
// document.getElementById("myModal").style.display="block";
// document.getElementsByClassName("imageModal")[0].src=this.src;

// }


//целият урок е в тази функция
function tutorialStep(x){
    
    // document.getElementById("image1").addEventListener('click', onClickImg())

    switch(x){
        case 1:
            document.getElementsByClassName("prevButton")[0].style.display="block";
            document.getElementsByClassName("tutBubbleText")[0].innerHTML = "Шашки се играе на квадратна дъска, подобна на шахматната дъска. Дъската има 64 квадрата (8х8) с редуващи се черни и бяли цветове. Дъската е разположена така, че всеки играч да има светъл квадрат в десния си ъгъл."
            document.getElementById("image1").src="checkersBoard.png";

            break;
        case 2:
            document.getElementsByClassName("tutBubbleText")[0].innerHTML="Всеки играч започва с 12 кръгли фигури (пулове), оцветени в тъмен и светъл цвят, които съответстват на квадратите на дъската. "
            document.getElementById("image1").src="checkersFullBoard.png";
            document.getElementById("examplePics").href="checkersFullBoard.png";

            break;
        case 3:
            document.getElementsByClassName("tutBubbleText")[0].innerHTML=" Пуловете могат да се движат само по диагонал към други празни съседни черни квадрати. Освен това те могат да се движат само напред към противника."
            document.getElementById("image1").src="checkersBoardFullMoves.png";
            document.getElementById("examplePics").href="checkersBoardFullMoves.png";

            break;
        case 4:
            document.getElementsByClassName("tutBubbleText")[0].innerHTML=" Aко една фигура достигне противниковата страна на дъската, тя става цар. Царете могат да се движат по диагонал напред и назад."
            document.getElementById("image1").src="checkersBecomeAKing.png";
            document.getElementById("examplePics").href="checkersBecomeAKing.png";
            break;
        case 5:
            document.getElementsByClassName("tutBubbleText")[0].innerHTML=" За да може да се улови фигура на противника трябва зад нея да има празно пространство по диагонал, тогава нашата фигура може да се придвижи с две пространства вместо с едно, като „прескочи“ фигурата."
            document.getElementById("image1").src="jumping.png";
            document.getElementById("examplePics").href="jumping.png";
            break;
        case 6:
            document.getElementsByClassName("tutBubbleText")[0].innerHTML=" В играта на шашки има два начина за победа. Или улавяте всички фигури на противника, или го хващате в капан, в който не може да направи нито един законен ход."
            document.getElementById("image1").src="aGame.png";
            document.getElementById("examplePics").href="aGame.png";
            break;
        case 7:
            document.getElementsByClassName("topMenuButton")[0].innerHTML="ПРАВИЛА";
            document.getElementsByClassName("tutBubble")[0].style.display = "none";
            document.getElementById("image1").style.display = "none";
            document.getElementById("examplePics").style.display = "none";
            document.getElementById('suica').style.display = "block";
            document.getElementsByClassName("nextButton")[0].style.display="none";
            document.getElementsByClassName("prevButton")[0].style.display="none";
            
            break;
        case 0:
            document.getElementsByClassName("tutBubble")[0].style.display = "block";
            document.getElementById("image1").style.display = "block";
            document.getElementById("examplePics").style.display = "block";
            document.getElementById('suica').style.display = "block";
            document.getElementsByClassName("nextButton")[0].style.display="block";
            document.getElementsByClassName("prevButton")[0].style.display="none";
            document.getElementsByClassName("tutBubbleText")[0].innerHTML = "Шашки е класическа настолна игра, която се играе и днес. Тя е бърза игра с по-малко правила за запомняне и по-лесна за усвояване, новсе пак изисква мислене и планиране"
            document.getElementById("image1").src="checkersFullBoard.png";
            document.getElementById("examplePics").href="checkersFullBoard.png"
            document.getElementById('suica').style.display = "none";
            break;
    }
}

//с тази функция оцветяваме плочките обратно в черно
function pointerDown(event){
    
    for(var i of possibleMoves){
        i.color="black";
    }
    
}

//не знаех, че няма да ми потрябва
function pointerUp(event){

}



