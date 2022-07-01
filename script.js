const form = document.querySelector("#form");
const input = document.querySelector("#input");
const todo = document.querySelector("#todo");
let todoList = [];

const getDate = () =>{
    let today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth()+1).padStart(2, "0");
    const year = today.getFullYear();
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

const renderList = () =>{   
    todo.innerHTML = null;
    const todos = localStorage.getItem("todos");
    todoList = JSON.parse(todos) || [];

    for(let i = 0; i<todoList.length; i++){
        const item = document.createElement("li");
        const label = document.createElement("label");
        label.className = "label-class";
        const span = document.createElement("span");
        span.className = "checkmark";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        label.appendChild(checkbox);
        label.appendChild(span);

        if(todoList[i].completed){
            item.classList.add("done");
            item.classList.remove("undone");
            checkbox.checked = todoList[i].completed;
        }else{
            item.classList.add("undone");
            item.classList.remove("done");
            checkbox.checked = todoList[i].completed;
        }

        checkbox.addEventListener("click", (e) =>{
            todoList[i].completed = e.target.checked;
            localStorage.setItem("todos", JSON.stringify(todoList));

            if(todoList[i].completed){
                item.classList.add("done");
                item.classList.remove("undone");
                checkbox.checked = todoList[i].completed;
            }else{
                item.classList.add("undone");
                item.classList.remove("done");
                checkbox.checked = todoList[i].completed;
            }
        })
        const text = document.createElement("p");
        text.className = "text";
        text.innerText = todoList[i].text;

        const date = document.createElement("p");
        date.innerHTML = `<i class='far fa-calendar-plus'></i> ${todoList[i].date}`;

        const editDate = document.createElement("span");
        date.appendChild(editDate);
        editDate.innerHTML = `<br /><i class='fas fa-pen'></i> ${todoList[i].editDate}`;
        if(todoList[i].editDate == null || todoList[i].editDate == "undefined"){
            editDate.style.display = "none";
        }
        
        const deleteBTN = document.createElement("button");
        deleteBTN.innerHTML = '<i class="far fa-trash-alt"></i>'
        deleteBTN.addEventListener("click", () =>{
          todoList.splice(i, 1);
          localStorage.setItem("todos", JSON.stringify(todoList));
          renderList();
        });

        let editText = document.getElementsByClassName("text");
        const editBTN = document.createElement("button");
        editBTN.innerHTML = '<i class="fas fa-pen-square"></i>';
        editBTN.addEventListener("click", () =>{           
            editText[i].contentEditable = true;
            editBTN.innerHTML = '<i class="fas fa-check"></i>';
            editText[i].classList.add("text-edit");
            checkbox.disabled = true;
            editBTN.addEventListener("click", () =>{
                if(todoList[i].text != editText[i].innerHTML){
                    todoList[i].editDate = getDate();
                    todoList[i].text = editText[i].innerText;
                    localStorage.setItem("todos", JSON.stringify(todoList));
                    renderList();
                }else{
                    renderList();
                }
            });      
        });
        
        item.appendChild(text);
        item.appendChild(date);
        item.appendChild(label);
        item.appendChild(deleteBTN);
        item.appendChild(editBTN);
        todo.appendChild(item);
        input.value = null;
    }
}
renderList();

const addToList = () =>{
    const newItem = input.value;
    if(!newItem){
        return;
    }
    todoList.push({
        text: newItem,
        completed: false,
        date: getDate(),
        editDate: null
    });
    localStorage.setItem("todos", JSON.stringify(todoList));
    renderList();  
}

form.addEventListener("submit", (e) =>{
    e.preventDefault();
    addToList();
})