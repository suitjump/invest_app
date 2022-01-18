const mydata = loans;

const wrapperData = document.getElementById('main__wrapper');

mydata.map((item, i) =>
        wrapperData.innerHTML = wrapperData.innerHTML + 
        `<div class='main__wrap' id="+i+">
            <div class='main__wrap_text'>
                <h1>Loan name ${item.id} </h1>
                <p>${item.title}</p>
            </div>
            <div class='main__wrap_success'><p>Invested</p></div>
            <button class='main__wrap_button'>Invest</button>
        </div>`)

const popupButton = document.querySelectorAll('.main__wrap_button');
const popupForm = document.getElementById("main__popup");
const totalAmount = document.querySelector('.main__total')


function popupFormClick(i) {
    popupForm.innerHTML = popupForm.innerHTML + 
        `<div class='main__popup_wrap'>
            <button class='main__popup_close'>×</button>
            <h1>Invest in loan</h1>
            <p>Loan title you've clicked</p>
            <p>Amount available: ${mydata[i].available}</p>
            <p>Loan ends in: ${timeConvert(mydata[i].term_remaining)}</p>
            <p>Investment amount (£)</p>
            <form name='user' class='main__popup_form'>
                <div class='main__popup_wrap_invest'>
                    <input class='main__popup_input' name='numberInvest' pattern='[0-9]+' type='text' required>
                    <button class='main__popup_button' type='submit'>Invest</button>
                </div>
            </form>
        </div>`
}

function timeConvert(num){ 
    const month = Math.floor(num / 43800);  
    const hours = num % 24;
    return `${month} months ${hours} hours`;         
}

popupButton.forEach((button) => { 
    button.addEventListener('click', (e) => { 
        e.preventDefault(); 
        popupFormClick(Array.from(popupButton).indexOf(e.target));
        popupForm.classList.add('active'); 

        const indexButton = Array.from(popupButton).indexOf(e.target);
        const elForm = document.querySelector('.main__popup_form');
        const requestURL = elForm.action;
        const valueForm = elForm.querySelector('.main__popup_input');

        elForm.addEventListener('submit', (e) => {
            e.preventDefault();

            function sendForm() {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', requestURL);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    if (xhr.status !== 200) {
                        return;
                    } else {
                        return wrapperData.innerHTML = '<p>some error has happened</p>';
                    }
                }
                amountSubmit(valueForm.value)
                document.querySelectorAll('.main__wrap_success')[indexButton].style.display = "block";
                popupForm.classList.remove('active');  
                while (popupForm.firstChild) {
                    popupForm.removeChild(popupForm.firstChild);
                }
            }
            sendForm();
        });
    })
});
function amountSubmit(value) {
    let valueData = Number.parseInt(mydata[1].amount);
    let subValue = value;
    let valueAmount = valueData - subValue;
    if(subValue === undefined) {
        totalAmount.innerHTML = `<p>Total amount available for investments: £${valueData}</p>`;
    } else {
        totalAmount.innerHTML = `<p>Total amount available for investments: £${valueAmount}</p>`;
    }
}

amountSubmit();

document.addEventListener('click', (e) => { 
    if(e.target === popupForm || e.target === document.querySelector(".main__popup_close")) { 
        popupForm.classList.remove('active');  
        while (popupForm.firstChild) {
            popupForm.removeChild(popupForm.firstChild);
        }
    }
});