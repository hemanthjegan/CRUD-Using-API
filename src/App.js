import { useEffect, useState } from 'react';
import { Button , EditableText , InputGroup, Toaster} from '@blueprintjs/core';
import './App.css';

const AppToaster = Toaster.create({
	position:"top"
})

function App() {

	const [users, setUsers] = useState([]);
	// const [newUser, setNewUser] = useState({});
	const [newName, setNewName] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [newWebsite, setNewWebsite] = useState('');
	
	useEffect(()=>{
		fetch('http://jsonplaceholder.typicode.com/users')
		.then((response)=> response.json())
		.then((json)=> setUsers(json))
	},[]) // it can call only one time

	function addUser(){
		const name = newName.trim();
		const email = newEmail.trim();
		const website = newWebsite.trim();

		if(name && email && website){
			fetch('http://jsonplaceholder.typicode.com/users',
				{
					method:"POST",
					body:JSON.stringify({
						name, email, website
					}),
					headers: {
						"content-Type": "application/json; charset=UTF-8"  // to know what type of code we sent
					}
				}
			).then((response)=> response.json())
			.then(data => {
				setUsers([...users, data]);
				AppToaster.show({
					message: "user added successfully",
					intent: "success",
					timeout: 3000
				})
				setNewEmail('');
				setNewName('');
				setNewWebsite('');  // not working
			})
		}
	}

	function onChangeHandler(id, key, value){
		setUsers((users)=>{
			return (users.map((user) => {
				return user.id === id ? {...user, [key] : value} : user;
		   }))
		})
	}

	function updateUser(id){

		const user = users.find((user)=> user.id === id);

		fetch(`http://jsonplaceholder.typicode.com/users/${id}`,
		{
			method:"PUT",
			body:JSON.stringify({
				user
			}),
			headers: {
				"content-Type": "application/json; charset=UTF-8"  // to know what type of code we sent
			}
		})
		.then((response)=> response.json())
		.then(data => {
			// setUsers([...users, data]);  // no need it will show update on bottom
			AppToaster.show({
				message: "user updated successfully",
				intent: "primary",
				timeout: 3000
			})
		})
	}

	function deleteUser(id){

		fetch(`http://jsonplaceholder.typicode.com/users/${id}`,
		{
			method:"DELETE",
		})
		.then((response)=> response.json())
		.then(data => { 
			setUsers((users)=>{
				return users.filter((user) => user.id !== id)
				// it will return all data except given id so we use filter
			})
			AppToaster.show({
				message: "user deleted successfully",
				intent: "danger",
				timeout: 3000
			})
		})
	}

  return (
    <div className="App">
      <table className='bp4-html-table modifier'>
		<thead>
			<th>ID</th>
			<th>Name</th>
			<th>Email</th>
			<th>Website</th>
			<th>Action</th>
		</thead>
		<tbody>
			{users.map(user => 
				<tr key={user.id}>
					<td> {user.id}</td>
					<td> {user.name}</td>
					<td><EditableText value={user.email} onChange={(value)=> { onChangeHandler(user.id, 'email', value)}}/></td>
					<td><EditableText value={user.website} onChange={(value)=> { onChangeHandler(user.id, 'website', value)}}/></td>
					<td>
						<Button intent='primary' onClick={()=> updateUser(user.id)}>Update</Button> 
						&nbsp;
						{/* &nbsp; is used for providing space between two elements */}
						<Button intent='danger' onClick={()=> deleteUser(user.id)}>Delete</Button> 
					</td>
			</tr>)}
		</tbody>
		<tfoot>
			<tr>
				<td></td>
				{/* <td><InputGroup name='name' onChange={(e) => setUsers((previousState)=> {return {...previousState, [e.target.name] : e.target.value}})}/></td>
				<td><InputGroup name='email' onChange={(e) => setUsers((previousState)=> {return {...previousState, [e.target.email] : e.target.value}})}/></td>
				<td><InputGroup name='website' onChange={(e) => setUsers((previousState)=> {return {...previousState, [e.target.website] : e.target.value}})}/></td>
				 */}
				<td><InputGroup name='name' placeholder='Enter your name' onChange={(e) => setNewName(e.target.value)}/></td>
				<td><InputGroup name='email' placeholder='Enter your email' onChange={(e) => setNewEmail(e.target.value)}/></td>
				<td><InputGroup name='website' placeholder='Enter your website' onChange={(e) => setNewWebsite(e.target.value)}/></td>
				
				<td><Button onClick={addUser} intent='success'>Add User</Button> </td>
			</tr>
		</tfoot>
	  </table>
    </div>
  );
}

export default App;
