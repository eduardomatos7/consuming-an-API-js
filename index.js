function renderTransactions(transactionsData){
    const content = CreateContent(transactionsData.id)
    const historic = divOrganizer()
    const valueTransaction = createTransactionAmount(transactionsData.value)
    const nameTrasaction = createTransactionTitle(transactionsData.name)
    const buttonEdit = createEditBtn()
    const buttonDel = createDeleteBtn(transactionsData)
    const divButtons = createClassDivBtn()
    
    addEditButtonListener(buttonEdit, content, transactionsData)
    addDeleteButtonListener(buttonDel, content, transactionsData.id)

    historic.appendChild(nameTrasaction)
    divButtons.append(buttonEdit, buttonDel)
    historic.append(nameTrasaction)
    content.append(historic, valueTransaction, divButtons)
    document.querySelector('#transactions').appendChild(content)

}

 function CreateContent(transactionsDataId){
    const contentTransactions = document.createElement('div')
    contentTransactions.id = transactionsDataId
    contentTransactions.classList.add('contentTransactions')
    return contentTransactions
}

function divOrganizer(){
    const spaceHistoric = document.createElement('div')
    spaceHistoric.classList.add('spaceHistoric')
    return spaceHistoric
}

function createTransactionTitle(title){
    const nameTrasaction = document.createElement('p')
    nameTrasaction.classList.add('nameTransaction')
    nameTrasaction.textContent = title
    return nameTrasaction
}




function createTransactionAmount(amount){
    const valueTransaction = document.createElement('p')
    valueTransaction.classList.add('valueTransaction')
    const formater = Intl.NumberFormat('pt-BR', {
        compactDisplay: 'long',
        currency: 'BRL',
        style: 'currency',
      })
    const formatedAmount = formater.format(amount)
    if (amount > 0){
        valueTransaction.textContent = `${formatedAmount} C`
        valueTransaction.classList.add('credit-color')
    }else if(amount === 0){
        valueTransaction.textContent = formatedAmount
        
    }else{
        valueTransaction.textContent = `${formatedAmount} D`
        valueTransaction.classList.add('debit-color')
    }
    return valueTransaction
}


function createClassDivBtn(){
    const divButtons = document.createElement('div')
    divButtons.classList.add('buttons')
    return divButtons
}

function createEditBtn(){
    const buttonEdit = document.createElement('button')
    buttonEdit.type = "button"
    buttonEdit.textContent = 'Editar'
    buttonEdit.classList.add('button', 'edit')
    return buttonEdit
}
function createDeleteBtn(id){
    const buttonDel = document.createElement('button')
    buttonDel.type = "button"
    buttonDel.textContent = "Excluir"
    buttonDel.id = id + "-buttonDelete"
    buttonDel.classList.add('button', 'exc')
    return buttonDel
}




function addDeleteButtonListener(buttonDel, contentTransactions, transactionId){
    buttonDel.addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:3000/transactions/${transactionId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                document.querySelector('#transactions').removeChild(contentTransactions)
            } else {
                console.log('Erro ao deletar a transação')
            }
        } catch (error) {
            console.log("Erro ao deletar transação", error)
        }
    });
}


function addEditButtonListener(buttonEdit, contentTransactions, transactionsData) {
    buttonEdit.addEventListener('click', () => {
        const inputName = document.createElement('input')
        inputName.type = 'text'
        inputName.value = transactionsData.name
        inputName.classList.add('editInput')

        const inputValue = document.createElement('input')
        inputValue.type = 'text'
        inputValue.value = transactionsData.value
        inputValue.classList.add('editInput')

        const nameTransaction = contentTransactions.querySelector('.nameTransaction')
        const valueTransaction = contentTransactions.querySelector('.valueTransaction')
        
        if (nameTransaction && valueTransaction) {
            nameTransaction.replaceWith(inputName)
            valueTransaction.replaceWith(inputValue)
        }
         else {
            return
        }

        buttonEdit.textContent = 'Salvar'
        buttonEdit.classList.add('buttonEditColor')

        buttonEdit.addEventListener('click', async () => {
            transactionsData.name = inputName.value
            transactionsData.value = parseFloat(inputValue.value)

            try {
                const response = await fetch(`http://localhost:3000/transactions/${transactionsData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transactionsData)
                })

                if (response.ok) {
                    const updatedName = createTransactionTitle(transactionsData.name)

                    const updatedValue = createTransactionAmount(transactionsData.value)

                    inputName.replaceWith(updatedName)
                    inputValue.replaceWith(updatedValue)
                    buttonEdit.textContent = 'Editar'
                    buttonEdit.classList.remove('buttonEditColor')

                    buttonEdit.onclick = null;
                    addEditButtonListener(buttonEdit, contentTransactions, transactionsData)
                } else {
                    console.log('Erro ao atualizar a transação')
                }
            } catch (error) {
                console.log('Erro ao enviar atualização', error)
            }
        })
    })
}


const form = document.querySelector('#form')
form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const transactionsData = {
        name: document.querySelector('#name').value,
        value: parseFloat(document.querySelector('#value').value)
    }
    try {
        const response = await fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionsData)
    
        })
        const savedTransactions = await response.json();
        form.reset();
        renderTransactions(savedTransactions);
    } catch (error) {
        console.log("Erro ao enviar transação", error)
    }
    
})

document.addEventListener('DOMContentLoaded', () => {
    fetchTransaction()    
    
})


async function fetchTransaction() {
    try {
        const response = await fetch("http://localhost:3000/transactions")
        const data = await response.json()
        data.forEach(renderTransactions)
    } catch (error) {
        console.log(error)
    }
    
    
    
}