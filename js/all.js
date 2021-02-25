const inputHeight = document.getElementById('dataInputHeight');
const inputWeight = document.getElementById('dataInputWeight');
const sendBtn = document.querySelector('.sendBtn');
const resultBtn = document.querySelector('.resultBtn');
const resultTable = document.querySelector('.resultTable');
const loopIcon = document.querySelector('.loopIcon');
const pageShow = document.querySelector('.pageShow');
const removeAll = document.querySelector('.removeAll');
let bmiDataArray = JSON.parse(localStorage.getItem('userData')) || [];

// 宣告 分頁物件資訊
let pageInfo = '';
    
sendBtn.addEventListener('click',dataFilter,false); // 監聽 輸入資料篩選函式
resultTable.addEventListener('click',deleteData,false); // 監聽 刪除函式
pageShow.addEventListener('click',switchPage,false); // 監聽 換頁函式
loopIcon.addEventListener('click',reset,false); // 監聽 清空輸入值函式
removeAll.addEventListener("click", deleteList); // 監聽 清空全部資料函式
pagination(bmiDataArray,1) // 預設分頁第一頁渲染畫面

// 輸入資料篩選函式
function dataFilter(){
    let inputGroup = document.querySelectorAll('.inputGroup');
    // console.log(inputGroup);
    // 使用 for...of '遍歷'所要的值
    for (inputEle of inputGroup) {
    //   console.log(inputEle);
    // 判斷input是否為空值，classList顯示或隱藏
      if (inputEle.querySelector('input').value === ''){
        inputEle.querySelector('.inputNotice').classList.add('noticeShow');
        return;
      } else {
        inputEle.querySelector('.inputNotice').classList.remove('noticeShow');
      }
    };
    if(inputHeight.value !=='' && inputWeight.value !==''){
        dataCount();
    }else{
        return;
    }
};

// 計算函式
function dataCount(){
    // 看結果按鈕隱藏，顯示結果圓圈
    sendBtn.style.display = "none";
    resultBtn.style.display = "flex";

    // 開始處理輸入值 並 計算
    let userHeight = parseFloat(inputHeight.value).toFixed(2);
        // toFixed() 的值又會轉回 string
    userHeight = parseFloat(userHeight);
    let userWeight = parseFloat(inputWeight.value).toFixed(2);
    userWeight = parseFloat(userWeight);
    let bmi = (userWeight / (userHeight / 100) **2).toFixed(2);
    // console.log(bmi)
    // console.log(typeof(bmi))

    let userRecord = {
        height: userHeight,
        weight: userWeight,
        bmi: bmi,
        status: '',
        class: '',
        time: ''
    };

    if( bmi > 0){
        if ( bmi < 18.5 ){
            userRecord.status = '體重過輕';
            userRecord.class = 'UnderWeight'
        } else if (bmi >= 18.5 && bmi < 24){
            userRecord.status = '正常';
            userRecord.class = 'Normal'
        } else if (bmi >= 24 && bmi < 27){
            userRecord.status = '過重';
            userRecord.class = 'OverWeight'
        } else if (bmi >= 27 && bmi < 30){
            userRecord.status = '輕度肥胖';
            userRecord.class = 'MildObesity'
        } else if (bmi >= 30 && bmi < 35){
            userRecord.status = '中度肥胖';
            userRecord.class = 'ModerateObesity'
        } else {
            userRecord.status = '重度肥胖';
            userRecord.class = 'SevereObesity'
        }
      }else{
        alert('資料錯誤');
      };

    //獲得當前日期
    let date = new Date();
    let day = date.getDate();
    day = JSON.stringify(day);  //要轉字串才能知道長度
    let month = date.getMonth()+1;
    month = JSON.stringify(month);  //要轉字串才能知道長度
    let year = date.getFullYear();
    if(day.length === 1){day = '0'+day}
    if(month.length === 1){month = '0'+month}
    // console.log(year,month,day)
    userRecord.time = `${year}-${month}-${day}`;

    addInputData(userRecord);
}

// 資料存取函式
function addInputData(data){
    bmiDataArray.splice(0,0,data);
    // 將新資料 data 放入陣列 bmiDataArray
    localStorage.setItem('userData', JSON.stringify(bmiDataArray));
    // 將陣列 bmiDataArray 轉換成 string 放入 localStorage'userData'

// 渲染 結果文字
    const resultCycleBtn = document.getElementById('resultCycleBtn');
    const resultCycleType = document.querySelector('.resultCycleType');
    resultCycleBtn.innerHTML = `${data.bmi}<br><span class='smallText'>BMI</span>`;
    resultCycleType.textContent = data.status;
// 渲染 結果按鈕顏色（增加標籤屬性）
    resultBtn.setAttribute(`class`,`resultBtn bmiType${data.class}`);
    let loopIcon = document.querySelector('.loopIcon');
    loopIcon.setAttribute(`class`,`loopIcon bmiType${data.class}`);

// 預設保留資料 i 筆。超過自動刪除
    let i = 25;
    if(bmiDataArray.length > i){
        autoClear(i);
    };

    pagination(bmiDataArray,1);
}


// 自動刪除函式。超過 i 筆的刪除
function autoClear(i){
    let j = bmiDataArray.length - i;
    bmiDataArray.splice(i,j);
    // 刪除第10筆，共刪除j筆資料
    localStorage.setItem('userData', JSON.stringify(bmiDataArray));
    // 刪除資料後 將陣列 存入 localStorage
}


// 處理分頁資料
function pagination(dataX,nowPage){
    let dataLen = dataX.length;
    let perPage = 5;
    let pageNumber = Math.ceil(dataLen / perPage);

    // 設定分頁第一筆資料及最後一筆資料
    const minData = (nowPage * perPage) - perPage + 1;  //第2頁 2*4-4+1=5
    const maxData = nowPage * perPage;  //第2頁 2*4=8

    let recordItem = [];
    dataX.forEach(function (item,index) {
        const pageRange = index + 1; // 資料索引從0開始
        if ( pageRange >= minData && pageRange <= maxData) {
            recordItem.push(item);
        }; 
    }); 
    // 用物件傳遞資料
    pageInfo = {
        nowPage,  // 當前頁數
        pageNumber, // 總頁數
        addPrev: nowPage > 1, //判斷當前的頁數有沒有大於1
        addNext: nowPage < pageNumber, //判斷當前的頁數有沒有小於總頁數
    }; 

    // 渲染分頁畫面
    randerTable(recordItem);
    // 渲染分頁按鈕
    pageBtn(pageInfo);
}


// 渲染 紀錄畫面
function randerTable(record){
    // 資料總數
    const totalRecordNum = document.querySelector('.totalRecordNum');
    let totalDataNum = bmiDataArray.length;
    totalRecordNum.textContent = `總筆數：${totalDataNum}`;

    let str = '';
    record.forEach(function(item,index){
        str += `
        <tr>
            <td class='bmiType bmiType${item.class}'>${item.status}</td>
            <td><span class='smallText'>BMI</span>${item.bmi}</td>
            <td><span class='smallText'>height</span>${item.height} cm</td>
            <td><span class='smallText'>weight</span>${item.weight} kg</td>
            <td class='dataText'>${item.time}</td>
            <td><input type='button' class='pure-button button-error' value='刪除' data-num='${index}'</td>
        </tr>`
        
    });
    
    resultTable.innerHTML = str;
}

// 刪除資料按鈕函式
function deleteData(e){
    if (e.target.nodeName !== 'INPUT'){return;} //從父元素監聽子元素
    // console.log(e.target.nodeName)
    let deleteNum = e.target.dataset.num; // 鎖定自訂編號的資料

    bmiDataArray.splice(deleteNum,1);
    localStorage.setItem('userData', JSON.stringify(bmiDataArray));

    pagination(bmiDataArray,pageInfo.nowPage);
}

// 渲染 分頁按鈕
function pageBtn(page){
    let eleStr ='';
    if(page.addPrev) { //如果當前的頁數大於1，Prev 的按鈕就可以按
        eleStr += `<li><a href="#" data-page="1" class="page1st">第一頁</a></li>
                   <li><a href="#" data-page="${Number(page.nowPage) - 1}" class="pagePrev">prev</a></li>`;
        } else { //否則不顯示
        eleStr += `<li><a data-page="1" style="display: none">第一頁</a></li>
                   <li><a data-page="${Number(page.nowPage) - 1}" style="display: none">prev</a></li>`;
        };
    
    for (let i = 1; i <= page.pageNumber; i++) {
        if(Number(page.nowPage) === i){
            eleStr +=`
            <li><a data-page="${i}" class="pageActive">${i}</a></li>
            `}else{
                eleStr +=`<li><a href="#" data-page="${i}" class="pageOther">${i}</a></li>`;
            };
        };
    if(page.addNext) {//如果當前的頁數小於總頁數，Next 的按鈕就可以按
        eleStr += `<li><a href="#" data-page="${Number(page.nowPage) + 1}" class="pageNext">next</a></li>
                   <li><a href="#" data-page="${page.pageNumber}" class="pageLast">最後一頁</a></li>`;
        } else { //否則不顯示
        eleStr += `<li><a data-page="${Number(page.nowPage) + 1}" style="display: none">next</a></li>
                   <li><a data-page="${page.pageNumber}" style="display: none">最後一頁</a></li>`;
        };

    pageShow.innerHTML = eleStr;
}

// 更換頁面函式
function switchPage(e) {
    // console.log(e.target.nodeName)
    if(e.target.nodeName !== 'A') return;
    
    const pageNum = e.target.dataset.page; // 由自定義的data-num鎖定頁數
    // console.log(bmiDataArray,pageNum);
    pagination(bmiDataArray,pageNum);
}

// 清空資料函式
function reset(){
    inputHeight.value = '';
    inputWeight.value = '';

    sendBtn.style.display = "flex";
    resultBtn.style.display = "none";
}

 // 刪除全部資料
 function deleteList(e){
     e.preventDefault();
     let deleteNum = bmiDataArray.length; // 陣列數量
    //  console.log(deleteNum)
     bmiDataArray.splice(0 ,deleteNum); // 從第0筆開始，刪除deleteNum筆
     localStorage.setItem("userData", JSON.stringify(bmiDataArray));
     pagination(bmiDataArray,pageInfo.nowPage);
 };