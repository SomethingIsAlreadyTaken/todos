(function(){
	'use strict';

	
	
	//Block peremenih

	let todoInput = document.getElementById('todoInput'), 
		addBtn    = document.getElementById('addBtn'),
		form      = document.querySelector('form');

	// vivod sushestvuushih zdach iz local storage	
	let existTodos = getStorage();
	existTodos.forEach(function(todo) {
		createTask('todos', todo);
	});
	


	//Dobavlenie sobitiy

	todoInput.addEventListener('input', function(event){

		if (todoInput.value.length > 3) {   				// opredelyaem dlinu stroki kotoruu vveli v imput
			addBtn.removeAttribute('disabled');				// udalyaem atribut blokirovki knopki
		} else {
			addBtn.setAttribute('disabled', true);  		// blokiruem knopku dobavlyaa atribut
		}
	});

	form.addEventListener('submit', function(event){		
		event.preventDefault();								// zapreshaem otpravku na formi server

		createTask('todos', todoInput.value);   			// vizivaem function sozdaniya zadachi vvedenoi zadachi v spiske 'todos'
		createTaskAtStorage(todoInput.value);							// vizov function sohraneniya zadachi v local storage 

		todoInput.value = '';								// ochistka polya vvoda 
		addBtn.setAttribute('disabled', true);				// blokiruem knopku dobavlyaa atribut
	});



	// block functions

	function createTask(targetList, text) {					// sozdanie elementa spiska 
		
		let newLi = document.createElement('li'),
			html  = `<label>
						<input type="checkbox">
						<span>${text}</span>
					</label>
					<input type="text" value="${text}" hidden>
					<button class="editBtn">Edit</button>
					<button class="deleteBtn">Delete</button>
					<button class="saveBtn" hidden>Save</button>
					<button class="cancelBtn" hidden>Cancel</button>`; // gotovim html dlya elementa spiska todos 		
	
		if (targetList == 'completed') {
			html = `${text} <button class="deleteBtn">Delete</button>` // gotovim html dlya elementa spiska completed
		}

		newLi.innerHTML = html;										   // zapisivaem html v element spiska 					
	
		document.getElementById(targetList).appendChild(newLi);	       // vivodim element spiska v ukazanii spisok (todos ili completed)
																	   // todos pri sozdaii elementa 					
																	   // completed pri peremeshenii 					
		addEvents(newLi);											   // vizivaem function dobavleniya sobitiy 		

	}

	function addEvents(li) {

		let checkbox  = li.querySelector('input[type="checkbox"]'),    // nahodim checkbox 
			label     = li.querySelector('label'),					   // nahodim label	
			deleteBtn = li.querySelector('.deleteBtn'),				   // nahodim knopku udaleniya zadahci 
			editBtn   = li.querySelector('.editBtn'),				   // nahodim knopku edit 	
			editInput = li.querySelector('input[type="text"]'),		   // nahodim po;e redaktirovaniya texta zadachi 
			saveBtn   = li.querySelector('.saveBtn'),				   // nahodim knopku save zadachi 	
			cancelBtn = li.querySelector('.cancelBtn');				   // nahodim knopku otmeni redaktirovaniya

		if (checkbox) {
			checkbox.addEventListener('change', function() {           // dobavlyaem obrabotchik sobitiya change dlya checkboxa esli checkbox est
				createTask('completed', label.innerText);			   // vizivaem  function sozdaniya zadachi v spiske completed
				deleteElem(li);										   // vizov function udaleniya elementa, peredaem tuda element spiska
			});
		}

		if (deleteBtn) {												
			deleteBtn.addEventListener('click', function() {		   // dobavlyaem obrabotchik sobitiya najatiya na knopku udaleniya esli on est  	
				deleteElem(li);	
				if (label) {									   // vizivaem function udaleniya elementa, peredaem tuda element spiska			
				deleteTaskFromStorage(label.innerText);
				} 
			});
		}

		if (editBtn) {
			editBtn.addEventListener('click', function() {
				toggleVisibility([label, deleteBtn, editBtn], true);
				toggleVisibility([editInput, saveBtn, cancelBtn], false);
			});
		}

		if (saveBtn) {
			saveBtn.addEventListener('click', function() {
				toggleVisibility([label, deleteBtn, editBtn], false);
				toggleVisibility([editInput, saveBtn, cancelBtn], true);

				let span = label.querySelector('span');
				
				if (editInput.value.length > 0) {
					updateTaskAtStorage(span.innerText, editInput.value);
				} else {
					deleteTaskFromStorage(span.innerText);
					deleteElem(li);
				}

				span.innerText = editInput.value;
			});
		}		

		if (cancelBtn) {
			cancelBtn.addEventListener('click', function() {
				toggleVisibility([label, deleteBtn, editBtn], false);
				toggleVisibility([editInput, saveBtn, cancelBtn], true);
			});
		}	

		if (editInput) {
			editInput.addEventListener('keypress', function(event){
				if(event.key == 'Enter') {
					saveBtn.click();
				}
			})
		}
	}


	function toggleVisibility(elems, status) {
		elems.forEach(function(elem){
			elem.hidden = status;	
		});
	}

	function deleteElem(elem) {											// ydalaem elemnt, kotoriy peredali v parametre elem 
		elem.remove();
	}

	function createTaskAtStorage(todo) {
		
		let todos = getStorage();

		todos.push(todo);

		setStorage(todos);
	}

	function updateTaskAtStorage (oldTodo, newTodo) {
		let todos = getStorage();
		
		todos.forEach(function(todo, index) {
			if (todo == oldTodo.trim()) {
				todos[index] = newTodo.trim();
			}
		});

		setStorage(todos);
	}

	function deleteTaskFromStorage(todo) {
		let todos = getStorage(),
			index = todos.indexOf(todo.trim());

		if (index > -1) {
			todos.splice(index, 1);
		}

		setStorage(todos);
	}

	function getStorage() {

		let todos = localStorage.getItem('todos');						// zabirraem iz local storage stroku s zadachami 
		todos = todos ? todos.split('**') : [];
		return todos;

	}

	function setStorage(todos) {
		todos = todos.join('**');
		localStorage.setItem('todos', todos);

	}	

})();
