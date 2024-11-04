function getTransictions(transactionsData){
    const contentTransactions = document.createElement('div')
    contentTransactions.id = transactionsData.id
    contentTransactions.classList.add('contentTransactions')
    console.log(contentTransactions)

    const spaceHistoric = document.createElement('div')
    spaceHistoric.classList.add('spaceHistoric')

    const nameTrasaction = document.createElement('p')
    nameTrasaction.classList.add('nameTransaction')
    nameTrasaction.textContent = transactionsData.name

    spaceHistoric.appendChild(nameTrasaction)

    const valueTransaction = document.createElement('p')
    valueTransaction.classList.add('valueTransaction')
    valueTransaction.textContent = `R$ ${transactionsData.value},00`

    const divButtons = document.createElement('div')
    divButtons.classList.add('buttons')

    const buttonEdit = document.createElement('button')
    buttonEdit.type = "button"
    buttonEdit.textContent = 'Editar'
    buttonEdit.classList.add('button', 'edit')
    const buttonDel = document.createElement('button')
    buttonDel.type = "button"
    buttonDel.textContent = "Excluir"
    buttonDel.id = transactionsData.id + "-buttonDelete"
    buttonDel.classList.add('button', 'exc')
    
    addEditButtonListener(buttonEdit, contentTransactions, transactionsData)
    addDeleteButtonListener(buttonDel, contentTransactions, transactionsData.id)

    divButtons.append(buttonEdit, buttonDel)
    contentTransactions.append(spaceHistoric, valueTransaction, divButtons)
    document.querySelector('#transactions').appendChild(contentTransactions)


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
            console.error("Elementos nameTransaction ou valueTransaction não encontrados.")
            return
        }

        buttonEdit.textContent = 'Salvar'
        buttonEdit.classList.add('buttonEditColor')

        buttonEdit.onclick = async () => {
            transactionsData.name = inputName.value
            transactionsData.value = inputValue.value

            try {
                const response = await fetch(`http://localhost:3000/transactions/${transactionsData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transactionsData)
                })

                if (response.ok) {
                    const updatedName = document.createElement('p')
                    updatedName.classList.add('nameTransaction')
                    updatedName.textContent = transactionsData.name

                    const updatedValue = document.createElement('p')
                    updatedValue.classList.add('valueTransaction')
                    updatedValue.textContent = transactionsData.value

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
        }
    })
}


const form = document.querySelector('#form')
form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const transactionsData = {
        name: document.querySelector('#name').value,
        value: document.querySelector('#value').value
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
        getTransictions(savedTransactions);
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
        data.forEach(getTransictions)
    } catch (error) {
        console.log(error)
    }
    
    
    
}