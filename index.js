function getTransictions(transactionsData){
    const contentTransactions = document.createElement('div')
    contentTransactions.classList.add('contentTransactions')

    const spaceHistoric = document.createElement('div')
    spaceHistoric.classList.add('spaceHistoric')

    const nameTrasaction = document.createElement('p')
    nameTrasaction.classList.add('nameTrasaction')
    nameTrasaction.textContent = transactionsData.name

    spaceHistoric.appendChild(nameTrasaction)

    const valueTransaction = document.createElement('p')
    valueTransaction.classList.add('valueTransaction')
    valueTransaction.textContent = transactionsData.value

    const divButtons = document.createElement('div')
    divButtons.classList.add('buttons')

    const buttonEdit = document.createElement('button')
    buttonEdit.type = "button"
    buttonEdit.textContent = 'Editar'
    buttonEdit.classList.add('button', 'edit')
    const buttonDel = document.createElement('button')
    buttonDel.type = "button"
    buttonDel.textContent = "Excluir"
    buttonDel.classList.add('button', 'exc')

    divButtons.append(buttonEdit, buttonDel)
    contentTransactions.append(spaceHistoric, valueTransaction, divButtons)
    document.querySelector('#transactions').appendChild(contentTransactions)


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