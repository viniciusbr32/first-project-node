/*
query params => Meusite.com/users?nome=rodolfo&age=28
route params => /users/2   // buscar, deletar ou atualizar algo especifico
request body => {"name": "rodolfo", "age": }

get   => Buscar informaçoes no back-end
post => Criar informação no back-end
put / patch  => Alterar/atualizar informação no bakc-end
delete   => Deletar informação no bakc-end

middleware => interceptador => tem o poder de parar ou alterar dados da requisição
*/

const express = require('express');
const uuid = require('uuid');

const port = 3000;
const app = express();
app.use(express.json());

const users = [];

const checkUserId = (request, response, next) => {
	const { id } = request.params;
	const index = users.findIndex((user) => user.id === id);
	if (index < 0) {
		return response.status(404).json({ message: 'User not found' });
	}

	request.userIndex = index;
	request.userId = id;
	next();
};

app.get('/users', (request, response) => {
	return response.json({ users });
});

app.post('/users', (request, response) => {
	const { age, name } = request.body;

	const user = { id: uuid.v4(), name, age };

	users.push(user);
	return response.status(201).json(user);
});

app.put('/users/:id', checkUserId, (request, response) => {
	const { name, age } = request.body;
	const index = request.userIndex;
	const id = request.userId;
	const updateUser = { id, name, age };

	users[index] = updateUser;
	return response.json(updateUser);
});

app.delete('/users/:id', checkUserId, (request, response) => {
	const index = request.userIndex;
	users.splice(index, 1);

	return response.status(204).json();
});

app.listen(port, () => {
	console.log(`🚀 Server started on port ${port}`);
});
