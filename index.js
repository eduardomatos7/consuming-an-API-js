function getTransictions(transictionsData){
    const contentTransactions = document.createElement('div')
    contentTransactions.id = transictionsData.id
    contentTransactions.classList.add('contentTransactions')

    const spaceHistoric = document.createElement('div')
    spaceHistoric.classList.add('spaceHistoric')

    const nameTrasaction = document.createElement('p')
    nameTrasaction.classList.add('nameTrasaction')
    nameTrasaction.textContent = transictionsData.name

    spaceHistoric.appendChild(nameTrasaction)

    const valueTransaction = document.createElement('p')
    valueTransaction.classList.add('valueTransaction')
    valueTransaction.textContent = transictionsData.valor

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
document.addEventListener('DOMContentLoaded', ()=>{
    fechResponse()
    
})


async function fechResponse() {
    const response = await fetch("http://localhost:3000/transactions").then(res => res.json())
    response.forEach(getTransictions)
    console.log(response)
    
    
}