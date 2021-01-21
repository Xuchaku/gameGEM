let cnv = document.querySelector("#cnv"),
    context = cnv.getContext("2d");
const   colors = ["blue", "red", "yellow", "green", "purple"];

const space = 5, w = 40, h = 40, N = 10;
let endSwap = false;
let tmp = null;
let iSelect, jSelect, iCurrent, jCurrent;
let isSelected = false;
let isBlocked = false;
let animationID = null;
let mtrx = [];
cnv.width = w*N + space*(N+1);
cnv.height = w*N + space*(N+1);

cnv.style.backgroundColor = "#ccc";

let x1,x2,y1,y2;
class Rect {
    constructor(x,y,color,ind) {
        this.width = w;
        this.index = ind;
        this.height = h;
        this.x = x;
        this.y = y;
       // this.color = color;
        this.dirX = 0;
        this.dirY = 0;
        this.color = colors[Math.floor(Math.random()*colors.length)];
        this.speedY = Math.floor(Math.random()*1) + 2;
        this.yins = -50;
        this.isCompleted = false;
        context.fillStyle = color;
    }
    init(){

        context.clearRect(this.x, this.yins, this.width, this.height);
        this.yins += this.speedY;

        if(this.yins < this.y)
        {

            context.fillStyle = this.color;
            context.beginPath();
            context.fillRect(this.x, this.yins, this.width, this.height);
            context.closePath();
        }
        else {
            this.yins = this.y;
            context.fillStyle = this.color;
            context.beginPath();
            context.fillRect(this.x, this.yins, this.width, this.height);
            context.closePath();
            this.isCompleted = true;
            return;
        }



    }
    swap(dstX, dstY){

        context.clearRect(this.x, this.y, this.width, this.height);
        if(this.x != dstX || this.y != dstY){
            this.x += this.dirX*1;
            this.y += this.dirY*1;
            context.fillStyle = this.color;
            context.beginPath();
            context.fillRect(this.x, this.y, this.width, this.height);
            context.closePath();
        }
        else{
            context.fillStyle = this.color;
            context.beginPath();
            context.fillRect(this.x, this.y, this.width, this.height);
            context.closePath();
            this.isCompleted = true;
            return;
        }

    }
    setOption(x,y){
        if(this.x < x){
            this.dirX = 1;
        }
        else if(this.x > x){
            this.dirX = -1;
        }
        else{
            this.dirX = 0;
        }

        if(this.y < y){
            this.dirY = 1;
        }
        else if(this.y > y){
            this.dirY = -1;
        }
        else{
            this.dirY = 0;
        }
        this.isCompleted = false;
    }
}
//
for(let i = N - 1;i>=0;i--){
     mtrx[i] = [];
     for(let j = N - 1;j>= 0;j--){
            mtrx[i][j] = new Rect(j*h + space*(j+1), i*w + space*(i+1), "blue", i + " " + j);
     }
}


function loop(){
    console.log(1)
    let isAnimationcompleted = true;
    for(let i = N - 1;i>=0;i--){
        for(let j = N - 1;j>= 0;j--){
            if(i < N - 1) {
                if (mtrx[i+1][j].isCompleted) {
                    mtrx[i][j].init();

                }
            }
            else{
                mtrx[i][j].init();
            }
        }
    }
    for(let i = N - 1;i>=0;i--){
        for(let j = N - 1;j>= 0;j--){
            isAnimationcompleted = isAnimationcompleted && mtrx[i][j].isCompleted;
        }
    }

    animationID = requestAnimationFrame(loop);
    if(isAnimationcompleted){
        cancelAnimationFrame(animationID);
        console.log("DONE");
        //return;
    }

}
function calccombination(i1,j1,i2,j2){

    let combYUp = 0;
    let combYDown = 0;
    let combXLeft = 0;
    let combXRight = 0;

    let i = i1, j = j1;
    console.log(mtrx[i][j].color)
    while(j >= 1){
        if(mtrx[i][j1].color == mtrx[i][j-1].color)
            combXLeft++;
        else
            break;
        j--;
    }
    console.log(combXLeft);
    j = j1;
    while(j < N - 1){
        if(mtrx[i][j1].color == mtrx[i][j+1].color)
            combXRight++;
        else
            break;
        j++;
    }
    j = j1;

    console.log(combXRight);

   // console.log(combXLeft  + combXRight - 1);
    while(i >= 1){
        if(mtrx[i][j1].color == mtrx[i-1][j1].color)
            combYUp++;
        else
            break;
        i--;
    }
    console.log(combYUp);
    i = i1;
    j = j1;
    while(i < N - 1){
        if(mtrx[i][j1].color == mtrx[i+1][j1].color)
            combYDown++;
        else
            break;
        i++;
    }
    console.log(combYDown);
    i = i1;
    j = j1;
    if((combXLeft + combXRight) < 2){
        console.log("NO COMBO X");
    }
    else{
        let jStart = j - combXLeft, jEnd = j + combXRight;
        for(let k = 0;k < i;k++){
            for(let m = jStart;m <= jEnd;m++){
                //let temp = mtrx[k-1][m];
                mtrx[k][m].isCompleted = false;
                mtrx[k][m].yins = mtrx[k][m].y;
                mtrx[k][m].y = mtrx[k+1][m].y;

               // mtrx[k][m] = mtrx[k-1][m];
            }
        }
        for(let k = i;k > 0;k--){
            for(let m = jStart;m <= jEnd;m++){
                mtrx[k][m] = mtrx[k-1][m];
            }
        }
        for(let m = jStart;m <= jEnd;m++){
            mtrx[0][m] = new Rect(m*h + space*(m+1), space, "blue", i + " " + j);
        }

        isBlocked = false;
        isSelected = false;
        requestAnimationFrame(loop);
    }
    if((combYUp + combYDown) < 2){
        console.log("NO COMBO Y");
    }
    else{
        let iStart = i - combYUp, iEnd = i + combYDown;
        let l = 0;
        for(let k = 0;k<iStart;k++){
            mtrx[k][j].isCompleted = false;
            mtrx[k][j].yins = mtrx[k][j].y;
            mtrx[k][j].y = mtrx[k+combYUp + combYDown + 1][j].y;
            //mtrx[k+combYUp + combYDown + 1][j] = mtrx[k][j];
        }
        for(let k = iStart - 1;k>=0;k--){
            mtrx[iEnd - l][j] = mtrx[k][j];
            l++;
        }

        let dst = (iEnd - iStart + 1);
        for(let k = dst -1;k>=0;k--){
           // mtrx[k][j].isCompleted = new Rect(m*h + space*(m+1), space, "blue", i + " " + j);
            console.log(k);
             mtrx[k][j] = new Rect(j*h + space*(j+1), k*w + space*(k+1), "blue", i + " " + j);
        }
        isBlocked = false;
        isSelected = false;
        requestAnimationFrame(loop);

    }
    if((combYUp + combYDown) < 2 && (combXLeft + combXRight) < 2){
        mtrx[iSelect][jSelect].setOption(mtrx[iCurrent][jCurrent].x, mtrx[iCurrent][jCurrent].y);
        mtrx[iCurrent][jCurrent].setOption(mtrx[iSelect][jSelect].x, mtrx[iSelect][jSelect].y);
        x1 = mtrx[iCurrent][jCurrent].x;
        y1 = mtrx[iCurrent][jCurrent].y;
        x2 = mtrx[iSelect][jSelect].x;
        y2 = mtrx[iSelect][jSelect].y;
        endSwap = true;
        isBlocked = false;
        isSelected = false;
        requestAnimationFrame(swap.bind(null, x1,y1,x2,y2,iSelect,jSelect,iCurrent,jCurrent));
    }

    console.log(combYDown);
}
function swap(x1,y1,x2,y2,iSelect,jSelect,iCurrent,jCurrent){

   mtrx[iSelect][jSelect].swap(x1, y1);
   mtrx[iCurrent][jCurrent].swap(x2,y2);
   animationID = requestAnimationFrame(swap.bind(null, x1,y1,x2,y2,iSelect,jSelect,iCurrent,jCurrent));
   if(mtrx[iSelect][jSelect].isCompleted && mtrx[iCurrent][jCurrent].isCompleted) {
        window.cancelAnimationFrame(animationID);
        console.log("DONE");
        //swap in matrx
        tmp = mtrx[iSelect][jSelect];
        mtrx[iSelect][jSelect] = mtrx[iCurrent][jCurrent];
        mtrx[iCurrent][jCurrent] = tmp;
        let tmpi = iCurrent, tmpj = jCurrent;
        iCurrent = iSelect;
        jCurrent = jSelect;
        iSelect = tmpi;
        jSelect = tmpj;
        if(!endSwap)
            calccombination(iSelect, jSelect, iCurrent, jCurrent);
   }



}

animationID = requestAnimationFrame(loop);
cnv.addEventListener("click", (e)=>{
    console.log(e.clientX, e.clientY);

    if(isSelected && !isBlocked){
        iCurrent = Math.floor((e.clientY - space)/(w + space));
        jCurrent = Math.floor((e.clientX - space)/(h + space));
        if((Math.abs(iSelect - iCurrent) == 1 && Math.abs(jSelect - jCurrent) == 0) || (Math.abs(iSelect - iCurrent) == 0 && Math.abs(jSelect - jCurrent) == 1)) {
            //let tmpx = mtrx[iCurrent][jCurrent].x, tmpy = mtrx[iCurrent][jCurrent].y;
            mtrx[iSelect][jSelect].setOption(mtrx[iCurrent][jCurrent].x, mtrx[iCurrent][jCurrent].y);
            mtrx[iCurrent][jCurrent].setOption(mtrx[iSelect][jSelect].x, mtrx[iSelect][jSelect].y);
           // mtrx[iSelect][jSelect].setOption(tmpx, tmpy);
            x1 = mtrx[iCurrent][jCurrent].x;
            y1 = mtrx[iCurrent][jCurrent].y;
            x2 = mtrx[iSelect][jSelect].x;
            y2 = mtrx[iSelect][jSelect].y;
            isBlocked = true;
            endSwap = false;


            requestAnimationFrame(swap.bind(null, x1,y1,x2,y2,iSelect,jSelect,iCurrent,jCurrent));
        }
    }
    for(let i = N - 1;i>=0;i--){
        for(let j = N - 1;j>= 0;j--){
            if(e.clientX >= mtrx[i][j].x && e.clientX <= (mtrx[i][j].x + w) && e.clientY >= mtrx[i][j].y && e.clientY <= (mtrx[i][j].y + w) && !isSelected)
            {
                   context.lineWidth = "2";
                   context.strokeStyle = "black";
                   context.rect(mtrx[i][j].x, mtrx[i][j].y, w, h);
                   iSelect = i;
                   jSelect = j;
                   context.stroke();

                   isSelected = true;
            }
        }
    }

});





